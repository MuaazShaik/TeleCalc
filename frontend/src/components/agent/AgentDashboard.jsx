import { useState, useEffect } from 'react';
import { get } from '../../api';
import Calculator from './Calculator';

export default function AgentDashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => { get('/history').then(setHistory).catch(() => {}); }, []);

  const todayCalls = history.filter(h => new Date(h.calculatedAt).toDateString() === new Date().toDateString());
  const todayTotal = todayCalls.reduce((s, h) => s + h.totalCharge, 0);

  const fmtTime = (sec) => `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>📞</div>
          <div className="stat-card-label">My Calls Today</div>
          <div className="stat-card-value">{todayCalls.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(20,184,166,0.15)', color: 'var(--accent)' }}>💰</div>
          <div className="stat-card-label">Today's Charges</div>
          <div className="stat-card-value">₹{todayTotal.toFixed(2)}</div>
        </div>
      </div>

      <Calculator />

      {history.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className="section-title">📜 Recent Calculations</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Time</th><th>Plan</th><th>Start</th><th>Duration</th><th>Peak</th><th>Off-Peak</th><th>Charge</th></tr></thead>
              <tbody>
                {history.slice(0, 5).map(h => (
                  <tr key={h.id}>
                    <td>{new Date(h.calculatedAt).toLocaleString()}</td>
                    <td>{h.planName}</td>
                    <td>{fmtTime(h.startTimeSec)}</td>
                    <td>{h.durationSec}s</td>
                    <td><span className="badge badge-peak">{h.peakBilledSec}s</span></td>
                    <td><span className="badge badge-offpeak">{h.offPeakBilledSec}s</span></td>
                    <td style={{ fontWeight: 600 }}>₹{h.totalCharge.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
