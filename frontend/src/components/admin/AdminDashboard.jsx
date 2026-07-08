import { useState, useEffect } from 'react';
import { get } from '../../api';
import PeakHeatmap from './PeakHeatmap';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => { get('/admin/analytics/stats').then(setStats).catch(() => {}); }, []);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>📞</div>
          <div className="stat-card-label">Calls Today</div>
          <div className="stat-card-value">{stats?.callsToday ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(20,184,166,0.15)', color: 'var(--accent)' }}>💰</div>
          <div className="stat-card-label">Revenue Today</div>
          <div className="stat-card-value">₹{stats?.revenueToday?.toFixed(2) ?? '0.00'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>📋</div>
          <div className="stat-card-label">Active Plans</div>
          <div className="stat-card-value">{stats?.activePlans ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>👥</div>
          <div className="stat-card-label">Registered Agents</div>
          <div className="stat-card-value">{stats?.totalAgents ?? '—'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="section-title">📊 Call Volume Heatmap (24h)</h3>
        <PeakHeatmap />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => onNavigate('plans')}>📋 Manage Plans</button>
        <button className="btn btn-secondary" onClick={() => onNavigate('history')}>📜 View All History</button>
        <button className="btn btn-secondary" onClick={() => onNavigate('users')}>👥 Manage Users</button>
      </div>
    </div>
  );
}
