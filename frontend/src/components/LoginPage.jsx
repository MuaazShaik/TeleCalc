import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (tab === 'login') await login(form.username, form.password);
      else await register(form.username, form.password, form.fullName);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />
      <div className="login-card">
        <h1>⚡ TeleCalc</h1>
        <p className="subtitle">Telecom Call Charge Calculator</p>
        <div className="login-tabs">
          <button className={`login-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
          <button className={`login-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Create Account</button>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Enter your full name" value={form.fullName}
                onChange={e => set('fullName', e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" placeholder="Enter username" value={form.username}
              onChange={e => set('username', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Enter password" value={form.password}
              onChange={e => set('password', e.target.value)} required minLength={6} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? <div className="spinner" /> : (tab === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        {tab === 'register' && <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginTop: 16 }}>
          First account registered becomes Admin 👑
        </p>}
        {tab === 'login' && (
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(20,184,166,0.08)', borderRadius: 8, border: '1px solid rgba(20,184,166,0.2)' }}>
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Accounts</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}
                onClick={() => { set('username', 'admin'); set('password', 'admin123'); }}>
                👑 Admin
              </button>
              <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}
                onClick={() => { set('username', 'agent'); set('password', 'agent123'); }}>
                📞 Agent
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
