export default function MessageBubble({ msg, corrections }) {
  const isUser = msg.role === 'user';

  const s = {
    wrap:    { display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '12px' },
    bubble:  { maxWidth: '70%', padding: '12px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
               background: isUser ? '#7c6bff' : '#1e1e1e', border: isUser ? 'none' : '1px solid #2a2a2a',
               fontSize: '14px', lineHeight: '1.6', color: '#fff' },
    role:    { fontSize: '11px', color: '#666', marginBottom: '8px', textTransform: 'uppercase' },
    corrBox: { marginTop: '10px', padding: '10px', background: '#1a1410', borderRadius: '8px', border: '1px solid #3a2a10' },
    corrHd:  { fontSize: '11px', color: '#f59e0b', marginBottom: '6px', fontWeight: '600' },
    corrItem:{ fontSize: '12px', color: '#ccc', marginBottom: '4px', lineHeight: '1.5' },
    orig:    { color: '#ef4444', textDecoration: 'line-through' },
    fixed:   { color: '#4ade80', fontWeight: '600' },
  };

  return (
    <div style={s.wrap}>
      <div style={s.bubble}>
        <div style={s.role}>{isUser ? 'You' : 'AI Tutor'}</div>
        <div>{msg.content}</div>

        {!isUser && corrections && corrections.length > 0 && (
          <div style={s.corrBox}>
            <div style={s.corrHd}>📝 Corrections</div>
            {corrections.map((c, i) => (
              <div key={i} style={s.corrItem}>
                <span style={s.orig}>{c.original}</span>
                {' → '}
                <span style={s.fixed}>{c.corrected}</span>
                {c.explanation && <div style={{ color: '#999', fontSize: '11px' }}>{c.explanation}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}