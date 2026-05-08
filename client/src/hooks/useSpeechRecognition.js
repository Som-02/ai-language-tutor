import { useState, useRef } from 'react';

export default function useSpeechRecognition(langCode) {
  const [transcript, setTranscript] = useState('');
  const [listening,  setListening]  = useState(false);
  const [supported,  setSupported]  = useState(true);
  const recRef = useRef(null);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    const rec = new SR();
    rec.lang           = langCode || 'en-US';
    rec.interimResults = true;
    rec.continuous     = false;

    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    rec.start();
    recRef.current = rec;
    setListening(true);
    setTranscript('');
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const reset = () => setTranscript('');

  return { transcript, listening, supported, startListening, stopListening, reset };
}