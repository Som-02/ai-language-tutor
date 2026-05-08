import { useEffect, useState } from 'react';
import { getFlashcards, reviewFlashcard, deleteFlashcard } from '../api/tutorApi';

export default function Flashcards({ onBack }) {
  const [cards,   setCards]   = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { getFlashcards().then(r => setCards(r.data.filter(c => !c.reviewed))); }, []);

  const handleReview = async (id) => {
    await reviewFlashcard(id);
    setCards(prev => prev.filter(c => c._id !== id));
    setFlipped(false);
    setCurrent(prev => Math.min(prev, cards.length - 2));
  };

  const s = {
    page:    { minHeight: '100vh', background: '#0f0f0f', padding: '2rem', color: '#fff' },
    back:    { background: 'none', border: 'none', color: '#7c6bff', fontSize: '14px', marginBottom: '1.5rem', cursor: 'pointer' },
    card:    { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '2rem',
               maxWidth: '480px', margin: '0 auto', textAlign: 'center' },
    orig:    { fontSize: '20px', color: '#ef4444', marginBottom: '12px' },
    fixed:   { fontSize: '22px', color: '#4ade80', fontWeight: '600', marginBottom: '12px' },
    expl:    { fontSize: '13px', color: '#888', lineHeight: '1.6' },
    row:     { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1.5rem' },
    flipBtn: { padding: '10px 24px', background: '#2a2a2a', border: 'none', borderRadius: '10px', color: '#fff' },
    doneBtn: { padding: '10px 24px', background: '#4ade8033', border: '1px solid #4ade80', borderRadius: '10px', color: '#4ade80' },
  };

  if (!cards.length) return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>
      <p style={{ textAlign: 'center', color: '#666', marginTop: '4rem' }}>All flashcards reviewed! 🎉</p>
    </div>
  );

  const card = cards[current];
  return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>{current + 1} / {cards.length} remaining</p>
      <div style={s.card}>
        <div style={s.orig}>{card.original}</div>
        {flipped ? (
          <>
            <div style={s.fixed}>{card.corrected}</div>
            {card.explanation && <div style={s.expl}>{card.explanation}</div>}
          </>
        ) : (
          <div style={{ color: '#444', fontSize: '14px' }}>Tap to reveal correction</div>
        )}
        <div style={s.row}>
          {!flipped
            ? <button style={s.flipBtn} onClick={() => setFlipped(true)}>Show correction</button>
            : <>
                <button style={s.flipBtn} onClick={() => { setFlipped(false); setCurrent(p => (p + 1) % cards.length); }}>Next</button>
                <button style={s.doneBtn} onClick={() => handleReview(card._id)}>Got it ✓</button>
              </>
          }
        </div>
      </div>
    </div>
  );
}