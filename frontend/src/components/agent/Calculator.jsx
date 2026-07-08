import { useState, useEffect } from 'react';
import { get, post } from '../../api';
import ChargeResult from './ChargeResult';

export default function Calculator() {
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState('');
  // Auto-fill with current time
  const now = new Date();
  const [hh, setHh] = useState(String(now.getHours()).padStart(2, '0'));
  const [mm, setMm] = useState(String(now.getMinutes()).padStart(2, '0'));
  const [ss, setSs] = useState('00');
  const [duration, setDuration] = useState('1800'); // Default 30 min
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    get('/plans').then(p => { setPlans(p); if (p.length) setPlanId(String(p[0].id)); }).catch(() => {});
  }, []);

  const selectedPlan = plans.find(p => p.id === Number(planId));

  // Quick duration presets
  const presets = [
    { label: '1 min', val: 60 },
    { label: '5 min', val: 300 },
    { label: '15 min', val: 900 },
    { label: '30 min', val: 1800 },
    { label: '1 hr', val: 3600 },
  ];

  const handleCalc = async (e) => {
    e.preventDefault(); setError(''); setResult(null); setRecommendations(null); setLoading(true);
    try {
      const startTime = `${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:${ss.padStart(2,'0')}`;
      const body = { planId: Number(planId), startTime, durationSec: Number(duration) };
      const res = await post('/calculate', body);
      setResult(res);
      // Fetch AI plan recommendations in parallel
      post('/recommend', body).then(recs => setRecommendations(recs)).catch(() => {});
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const setNow = () => {
    const n = new Date();
    setHh(String(n.getHours()).padStart(2, '0'));
    setMm(String(n.getMinutes()).padStart(2, '0'));
    setSs(String(n.getSeconds()).padStart(2, '0'));
  };

  const fmtTime = (sec) => `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}`;

  return (
    <div>
      <form onSubmit={handleCalc}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">Select Plan</label>
            {plans.length === 0 ? (
              <div style={{ padding: 12, background: 'var(--warning-bg)', borderRadius: 8, fontSize: 13, color: 'var(--warning)' }}>
                ⚠️ No plans available. {selectedPlan ? '' : 'Ask an Admin to create plans first.'}
              </div>
            ) : (
              <select className="form-select" value={planId} onChange={e => setPlanId(e.target.value)}>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.peakRate}/min peak, ₹{p.offPeakRate}/min off-peak</option>)}
              </select>
            )}
          </div>
          {selectedPlan && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, padding: '8px 12px', background: 'rgba(20,184,166,0.06)', borderRadius: 8 }}>
              <span>🎁 Free: {Math.floor(selectedPlan.freeSeconds / 60)}m {selectedPlan.freeSeconds % 60}s</span>
              <span>⏱️ Pulse: {selectedPlan.pulseSec}s</span>
              <span>☀️ Peak: {fmtTime(selectedPlan.peakStartSec)}–{fmtTime(selectedPlan.peakEndSec)}</span>
            </div>
          )}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Call Start Time</label>
              <button type="button" className="btn btn-secondary btn-sm" onClick={setNow} style={{ fontSize: 11 }}>⏰ Use Now</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 8, alignItems: 'center', marginTop: 6 }}>
              <input className="form-input" type="number" min="0" max="23" value={hh} onChange={e => setHh(e.target.value)} placeholder="HH" />
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-dim)' }}>:</span>
              <input className="form-input" type="number" min="0" max="59" value={mm} onChange={e => setMm(e.target.value)} placeholder="MM" />
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-dim)' }}>:</span>
              <input className="form-input" type="number" min="0" max="59" value={ss} onChange={e => setSs(e.target.value)} placeholder="SS" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration (seconds)</label>
            <input className="form-input" type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 1800 for 30 minutes" required />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {presets.map(p => (
                <button key={p.val} type="button"
                  className={`btn btn-sm ${Number(duration) === p.val ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDuration(String(p.val))} style={{ fontSize: 11 }}>
                  {p.label}
                </button>
              ))}
              {duration > 0 && <span style={{ fontSize: 12, color: 'var(--text-dim)', marginLeft: 8 }}>
                = {Math.floor(duration / 60)}m {duration % 60}s
              </span>}
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading || !planId || !duration}>
            {loading ? <div className="spinner" /> : '🧮 Calculate Charge'}
          </button>
        </div>
      </form>
      {result && <ChargeResult data={result} recommendations={recommendations} />}
    </div>
  );
}

