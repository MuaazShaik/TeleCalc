import { useState, useEffect } from 'react';
import { get, put } from '../../api';
import { useAuth } from '../../AuthContext';

export default function UserManager() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({});

  const load = () => { get('/admin/users').then(setUsers).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'ADMIN' ? 'AGENT' : 'ADMIN';
    setLoading(l => ({ ...l, [u.id]: true }));
    try {
      await put(`/admin/users/${u.id}/role`, { role: newRole });
      load();
    } catch (e) { alert(e.message); }
    setLoading(l => ({ ...l, [u.id]: false }));
  };

  return (
    <div>
      <h3 className="section-title">👥 User Management</h3>
      {users.length === 0 ? <div className="empty-state">No users found</div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Username</th><th>Full Name</th><th>Role</th><th>Registered</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-agent'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.username === me?.username ? (
                      <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>You</span>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleRole(u)} disabled={loading[u.id]}>
                        {loading[u.id] ? '...' : `Make ${u.role === 'ADMIN' ? 'Agent' : 'Admin'}`}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
