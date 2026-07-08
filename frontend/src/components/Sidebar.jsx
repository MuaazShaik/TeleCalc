import { useAuth } from '../AuthContext';

const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'plans', label: 'Plans', icon: '📋' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'history', label: 'All History', icon: '📜' },
];
const AGENT_NAV = [
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
  { id: 'history', label: 'My History', icon: '📜' },
  { id: 'plans', label: 'Plans', icon: '📋' },
];

export default function Sidebar({ view, onNavigate }) {
  const { user, logout } = useAuth();
  const nav = user?.role === 'ADMIN' ? ADMIN_NAV : AGENT_NAV;
  const initials = (user?.fullName || user?.username || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>⚡ TeleCalc</h2>
        <p>{user?.role === 'ADMIN' ? 'Admin Panel' : 'Agent Portal'}</p>
      </div>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button key={item.id} className={`nav-btn ${view === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{user?.fullName || user?.username}</div>
            <span className="sidebar-user-role">{user?.role}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>Sign Out</button>
      </div>
    </aside>
  );
}
