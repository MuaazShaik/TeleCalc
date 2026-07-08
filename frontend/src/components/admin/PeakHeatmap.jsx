import { useState, useEffect } from 'react';
import { get } from '../../api';

export default function PeakHeatmap() {
  const [data, setData] = useState([]);

  useEffect(() => { get('/admin/analytics/heatmap').then(setData).catch(() => {}); }, []);

  if (!data.length) return <div className="empty-state">No data yet — calculations will populate this chart</div>;

  const maxCalls = Math.max(...data.map(d => d.calls), 1);

  const getColor = (calls) => {
    const ratio = calls / maxCalls;
    if (ratio === 0) return 'rgba(255,255,255,0.05)';
    if (ratio < 0.33) return 'rgba(20,184,166,0.5)';
    if (ratio < 0.66) return 'rgba(245,158,11,0.5)';
    return 'rgba(239,68,68,0.6)';
  };

  return (
    <div>
      <div className="heatmap">
        {data.map(d => (
          <div key={d.hour} className="heatmap-bar"
            style={{ height: `${Math.max(4, (d.calls / maxCalls) * 100)}%`, background: getColor(d.calls) }}>
            <div className="heatmap-tooltip">
              <strong>{d.hour}:00</strong><br />
              {d.calls} calls · ₹{d.revenue.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="heatmap-labels">
        {data.map(d => <span key={d.hour}>{d.hour}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: 'var(--text-dim)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(20,184,166,0.5)' }} /> Low
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(245,158,11,0.5)' }} /> Medium
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239,68,68,0.6)' }} /> High
        </span>
      </div>
    </div>
  );
}
