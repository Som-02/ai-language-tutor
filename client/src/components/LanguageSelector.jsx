import { useState } from 'react';
const LANGUAGES = [
  { name: 'French',   code: 'fr-FR', flag: '🇫🇷' },
  { name: 'Spanish',  code: 'es-ES', flag: '🇪🇸' },
  { name: 'German',   code: 'de-DE', flag: '🇩🇪' },
  { name: 'Japanese', code: 'ja-JP', flag: '🇯🇵' },
  { name: 'Italian',  code: 'it-IT', flag: '🇮🇹' },
  { name: 'Hindi',    code: 'hi-IN', flag: '🇮🇳' },
  { name: 'Mandarin', code: 'zh-CN', flag: '🇨🇳' },
  { name: 'Arabic',   code: 'ar-SA', flag: '🇸🇦' },
];

const LEVELS   = ['beginner', 'intermediate', 'advanced'];
const SCENARIOS = ['casual', 'restaurant', 'travel', 'shopping', 'interview'];

export default function LanguageSelector({ onStart }) {
  const [lang,     setLang]     = useState(LANGUAGES[0]);
  const [level,    setLevel]    = useState('intermediate');
  const [scenario, setScenario] = useState('casual');

  const s = {
    wrap:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    card:  { background: '#1a1a1a', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '480px', border: '1px solid #2a2a2a' },
    title: { fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#fff' },
    sub:   { fontSize: '14px', color: '#888', marginBottom: '2rem' },
    label: { display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    group: { marginBottom: '1.5rem' },
    grid:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
    langBtn: (active) => ({
      padding: '10px 6px', borderRadius: '10px', border: `1px solid ${active ? '#7c6bff' : '#2a2a2a'}`,
      background: active ? '#2a2060' : '#111', color: '#fff', fontSize: '12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    }),
    pillRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    pill: (active) => ({
      padding: '7px 16px', borderRadius: '20px', border: `1px solid ${active ? '#7c6bff' : '#2a2a2a'}`,
      background: active ? '#2a2060' : '#111', color: active ? '#a89fff' : '#888', fontSize: '13px',
    }),
    btn: { width: '100%', padding: '14px', background: '#7c6bff', border: 'none', borderRadius: '12px',
           color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '1rem' },
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <p style={s.title}>AI Language Tutor</p>
        <p style={s.sub}>Practice speaking with an AI native speaker</p>

        <div style={s.group}>
          <label style={s.label}>Choose a language</label>
          <div style={s.grid}>
            {LANGUAGES.map(l => (
              <button key={l.code} style={s.langBtn(lang.code === l.code)} onClick={() => setLang(l)}>
                <span style={{ fontSize: '20px' }}>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={s.group}>
          <label style={s.label}>Your level</label>
          <div style={s.pillRow}>
            {LEVELS.map(lv => (
              <button key={lv} style={s.pill(level === lv)} onClick={() => setLevel(lv)}>
                {lv.charAt(0).toUpperCase() + lv.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={s.group}>
          <label style={s.label}>Scenario</label>
          <div style={s.pillRow}>
            {SCENARIOS.map(sc => (
              <button key={sc} style={s.pill(scenario === sc)} onClick={() => setScenario(sc)}>
                {sc.charAt(0).toUpperCase() + sc.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button style={s.btn} onClick={() => onStart({ language: lang.name, langCode: lang.code, level, scenario })}>
          Start Session →
        </button>
      </div>
    </div>
  );
}