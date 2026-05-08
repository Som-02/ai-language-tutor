import { useState } from 'react';
import { registerUser, loginUser } from '../api/tutorApi';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const fn   = isLogin ? loginUser : registerUser;
      const { data } = await fn(form);
      login(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  const s = {
    wrap:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' },
    card:  { background: '#1a1a1a', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '380px', border: '1px solid #2a2a2a' },
    title: { fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '6px' },
    sub:   { fontSize: '13px', color: '#666', marginBottom: '2rem' },
    label: { display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' },
    input: { width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px',
             color: '#fff', padding: '11px 14px', fontSize: '14px', outline: 'none', marginBottom: '14px' },
    btn:   { width: '100%', padding: '12px', background: '#7c6bff', border: 'none', borderRadius: '10px',
             color: '#fff', fontWeight: '600', fontSize: '14px' },
    toggle:{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: '#666' },
    link:  { color: '#7c6bff', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer' },
    error: { color: '#ef4444', fontSize: '13px', marginBottom: '14px' },
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <p style={s.title}>{isLogin ? 'Welcome back' : 'Get started'}</p>
        <p style={s.sub}>{isLogin ? 'Sign in to continue' : 'Create your free account'}</p>
        {error && <p style={s.error}>{error}</p>}
        {!isLogin && (
          <>
            <label style={s.label}>Name</label>
            <input style={s.input} placeholder="Your name" value={form.name}
                   onChange={e => setForm({ ...form, name: e.target.value })} />
          </>
        )}
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" placeholder="you@email.com" value={form.email}
               onChange={e => setForm({ ...form, email: e.target.value })} />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" placeholder="••••••••" value={form.password}
               onChange={e => setForm({ ...form, password: e.target.value })}
               onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
        </button>
        <div style={s.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button style={s.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}