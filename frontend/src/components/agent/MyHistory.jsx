import { useState, useEffect } from 'react';
import { get } from '../../api';

export default function MyHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => { get('/history').then(setHistory).catch(() => {}); }, []);

  const fmtTime = (sec) => `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;

  return (
    <div>
      <h3 className="section-title">📜 My Call History</h3>
      {history.length === 0 ? <div className="empty-state">No calculations yet. Use the Calculator to get started!</div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Plan</th><th>Start</th><th>Duration</th><th>Peak</th><th>Off-Peak</th><th>Free Used</th><th>Charge</th><th>Holiday</th></tr></thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id}>
                  <td>{new Date(h.calculatedAt).toLocaleString()}</td>
                  <td>{h.planName}</td>
                  <td>{fmtTime(h.startTimeSec)}</td>
                  <td>{h.durationSec}s</td>
                  <td><span className="badge badge-peak">{h.peakBilledSec}s · ₹{h.peakCharge.toFixed(2)}</span></td>
                  <td><span className="badge badge-offpeak">{h.offPeakBilledSec}s · ₹{h.offPeakCharge.toFixed(2)}</span></td>
                  <td>{h.freeDeductedSec}s</td>
                  <td style={{ fontWeight: 600 }}>₹{h.totalCharge.toFixed(2)}</td>
                  <td>{h.holidayOverride ? '🎉' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
