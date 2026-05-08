import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Auth            from './pages/Auth';
import LanguageSelector from './components/LanguageSelector';
import SessionPage     from './pages/Session';
import Progress        from './pages/Progress';
import Flashcards      from './pages/Flashcards';

function Home({ onStart }) {
  const { user, logout } = useAuth();
  const s = {
    page:  { minHeight: '100vh', background: '#0f0f0f', padding: '2rem' },
    nav:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    brand: { fontSize: '20px', fontWeight: '700', color: '#fff' },
    user:  { fontSize: '13px', color: '#888' },
    grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', maxWidth: '800px', margin: '0 auto' },
    card:  { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '1.5rem', cursor: 'pointer' },
    icon:  { fontSize: '28px', marginBottom: '10px' },
    title: { fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' },
    desc:  { fontSize: '13px', color: '#666' },
    logoutBtn: { background: 'none', border: '1px solid #333', borderRadius: '8px', padding: '6px 12px', color: '#888', fontSize: '13px' },
  };
  return (
    <div style={s.page}>
      <div style={s.nav}>
        <div style={s.brand}>🌍 Language Tutor</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={s.user}>Hi, {user?.name}</span>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>
      <div style={s.grid}>
        <div style={s.card} onClick={() => onStart('session')}>
          <div style={s.icon}>🎙️</div>
          <div style={s.title}>Start a session</div>
          <div style={s.desc}>Practice conversation with your AI tutor</div>
        </div>
        <div style={s.card} onClick={() => onStart('progress')}>
          <div style={s.icon}>📊</div>
          <div style={s.title}>Progress</div>
          <div style={s.desc}>View your stats and learning trends</div>
        </div>
        <div style={s.card} onClick={() => onStart('flashcards')}>
          <div style={s.icon}>🃏</div>
          <div style={s.title}>Flashcards</div>
          <div style={s.desc}>Review grammar corrections from sessions</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { isLoggedIn } = useAuth();
  const [view,    setView]    = useState('home');
  const [config,  setConfig]  = useState(null);

  if (!isLoggedIn) return <Auth />;

  if (view === 'home')       return <Home onStart={setView} />;
  if (view === 'progress')   return <Progress onBack={() => setView('home')} />;
  if (view === 'flashcards') return <Flashcards onBack={() => setView('home')} />;
  if (view === 'session' && !config) return <LanguageSelector onStart={cfg => { setConfig(cfg); setView('chat'); }} />;
  if (view === 'chat' && config)     return <SessionPage config={config} onEnd={() => { setConfig(null); setView('home'); }} />;
}