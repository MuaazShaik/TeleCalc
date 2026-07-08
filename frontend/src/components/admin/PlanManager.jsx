import { useState, useEffect } from 'react';
import { get, post, put, del } from '../../api';

const EMPTY = { name: '', peakRate: 1.5, offPeakRate: 0.5, freeSeconds: 300, pulseSec: 30, peakStartSec: 32400, peakEndSec: 75600 };

export default function PlanManager({ readOnly = false }) {
  const [plans, setPlans] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | plan object for edit
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const load = () => { get('/plans').then(setPlans).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fmtTime = (sec) => `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}`;
  const parseTime = (str) => { const [h, m] = str.split(':').map(Number); return h * 3600 + m * 60; };

  const openAdd = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (p) => { setForm({ ...p }); setError(''); setModal(p); };
  const close = () => setModal(null);

  const save = async () => {
    setError('');
    try {
      if (modal === 'add') await post('/admin/plans', form);
      else await put(`/admin/plans/${form.id}`, form);
      close(); load();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this plan?')) return;
    await del(`/admin/plans/${id}`); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="section-title">📋 {readOnly ? 'Available Plans' : 'Plan Management'}</h3>
        {!readOnly && <button className="btn btn-primary" onClick={openAdd}>+ Add Plan</button>}
      </div>

      {plans.length === 0 ? <div className="empty-state">No plans yet. Create one to get started!</div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Peak Rate</th><th>Off-Peak Rate</th><th>Free</th><th>Pulse</th><th>Peak Window</th>{!readOnly && <th>Actions</th>}</tr></thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>₹{p.peakRate}/min</td>
                  <td>₹{p.offPeakRate}/min</td>
                  <td>{Math.floor(p.freeSeconds / 60)}m</td>
                  <td>{p.pulseSec}s</td>
                  <td>{fmtTime(p.peakStartSec)} – {fmtTime(p.peakEndSec)}</td>
                  {!readOnly && <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)} style={{ marginRight: 8 }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'add' ? 'Add New Plan' : 'Edit Plan'}</h2>
            {error && <div className="login-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Plan Name</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Basic, Premium" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Peak Rate (₹/min)</label>
                <input className="form-input" type="number" step="0.1" min="0" value={form.peakRate} onChange={e => set('peakRate', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Off-Peak Rate (₹/min)</label>
                <input className="form-input" type="number" step="0.1" min="0" value={form.offPeakRate} onChange={e => set('offPeakRate', Number(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Free Minutes (seconds)</label>
                <input className="form-input" type="number" min="0" value={form.freeSeconds} onChange={e => set('freeSeconds', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Pulse (seconds)</label>
                <input className="form-input" type="number" min="1" value={form.pulseSec} onChange={e => set('pulseSec', Number(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Peak Start (HH:MM)</label>
                <input className="form-input" type="time" value={fmtTime(form.peakStartSec)} onChange={e => set('peakStartSec', parseTime(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Peak End (HH:MM)</label>
                <input className="form-input" type="time" value={fmtTime(form.peakEndSec)} onChange={e => set('peakEndSec', parseTime(e.target.value))} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{modal === 'add' ? 'Create Plan' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
