import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/tutorApi';
import MessageBubble from '../components/MessageBubble';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis   from '../hooks/useSpeechSynthesis';

export default function SessionPage({ config, onEnd }) {
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [sessionId,  setSessionId]  = useState(null);
  const [corrections,setCorrections]= useState({});
  const bottomRef = useRef(null);

  const { transcript, listening, startListening, stopListening, reset } = useSpeechRecognition(config.langCode);
  const { speak, speaking } = useSpeechSynthesis();

  // Fill input with voice transcript
  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  // Auto-scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Greet the user when session starts
  useEffect(() => {
    const greet = async () => {
      setLoading(true);
      const { data } = await sendMessage({
        message:  `Start the ${config.scenario} scenario. Greet me to begin.`,
        language: config.language, level: config.level,
        scenario: config.scenario, history: []
      });
      setMessages([{ role: 'assistant', content: data.reply }]);
      setSessionId(data.sessionId);
      speak(data.reply, config.langCode);
      setLoading(false);
    };
    greet();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    reset();
    setLoading(true);

    try {
      // Send only previous messages as history (not the current user message)
      // Filter to only include complete user/assistant pairs
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const { data } = await sendMessage({
        message: text,
        language: config.language,
        level: config.level,
        scenario: config.scenario,
        history,   // ← previous messages only, current message sent separately
        sessionId
      });

      const assistantMsg = { role: 'assistant', content: data.reply };
      const msgIdx = newMessages.length;
      setMessages(prev => [...prev, assistantMsg]);
      if (data.corrections?.length) setCorrections(prev => ({ ...prev, [msgIdx]: data.corrections }));
      speak(data.reply, config.langCode);
    } catch (err) {
      console.error('Send error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const s = {
    page:     { height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f0f0f' },
    header:   { padding: '16px 20px', background: '#1a1a1a', borderBottom: '1px solid #2a2a2a',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    hTitle:   { fontSize: '16px', fontWeight: '600', color: '#fff' },
    hSub:     { fontSize: '12px', color: '#666', marginTop: '2px' },
    messages: { flex: 1, overflowY: 'auto', padding: '20px' },
    inputRow: { padding: '16px 20px', background: '#1a1a1a', borderTop: '1px solid #2a2a2a',
                display: 'flex', gap: '10px', alignItems: 'flex-end' },
    input:    { flex: 1, background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
                color: '#fff', padding: '12px 16px', fontSize: '14px', resize: 'none', outline: 'none' },
    micBtn:   { width: '46px', height: '46px', borderRadius: '50%', border: 'none', flexShrink: 0,
                background: listening ? '#ef4444' : '#2a2a2a', color: '#fff', fontSize: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: listening ? 'pulse 1s infinite' : 'none' },
    sendBtn:  { padding: '12px 20px', background: '#7c6bff', border: 'none', borderRadius: '12px',
                color: '#fff', fontWeight: '600', fontSize: '14px' },
    endBtn:   { padding: '7px 14px', background: 'transparent', border: '1px solid #333',
                borderRadius: '8px', color: '#888', fontSize: '13px' },
    loading:  { padding: '12px 16px', background: '#1e1e1e', borderRadius: '18px', display: 'inline-block',
                color: '#888', fontSize: '14px', marginBottom: '12px' },
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={s.header}>
        <div>
          <div style={s.hTitle}>{config.language} · {config.scenario}</div>
          <div style={s.hSub}>{config.level} level {speaking && '· Speaking...'}</div>
        </div>
        <button style={s.endBtn} onClick={onEnd}>End session</button>
      </div>

      <div style={s.messages}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} corrections={corrections[i]} />
        ))}
        {loading && <div style={s.loading}>AI is typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputRow}>
        <textarea
          style={s.input}
          rows={1}
          placeholder={listening ? 'Listening...' : `Type or speak in ${config.language}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
        />
        <button style={s.micBtn} onClick={listening ? stopListening : startListening} title="Voice input">
          {listening ? '⏹' : '🎤'}
        </button>
        <button style={s.sendBtn} onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
}