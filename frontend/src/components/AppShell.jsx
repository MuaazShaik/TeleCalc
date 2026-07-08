import { useState } from 'react';
import { useAuth } from '../AuthContext';
import Sidebar from './Sidebar';
import LiveZoneIndicator from './LiveZoneIndicator';
import AdminDashboard from './admin/AdminDashboard';
import PlanManager from './admin/PlanManager';
import UserManager from './admin/UserManager';
import AllHistory from './admin/AllHistory';
import AgentDashboard from './agent/AgentDashboard';
import MyHistory from './agent/MyHistory';

const VIEW_TITLES = {
  dashboard: 'Dashboard', calculator: 'Charge Calculator', plans: 'Plan Management',
  users: 'User Management', history: 'Call History',
};

export default function AppShell() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [view, setView] = useState(isAdmin ? 'dashboard' : 'calculator');

  return (
    <div className="app-layout">
      <Sidebar view={view} onNavigate={setView} />
      <div className="app-main" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <header className="topbar">
          <h1>{VIEW_TITLES[view] || 'TeleCalc'}</h1>
          <LiveZoneIndicator />
        </header>
        <main className="app-content">
          <div className="app-content-inner">
            {isAdmin && view === 'dashboard' && <AdminDashboard onNavigate={setView} />}
            {isAdmin && view === 'plans' && <PlanManager />}
            {isAdmin && view === 'users' && <UserManager />}
            {isAdmin && view === 'history' && <AllHistory />}
            {!isAdmin && view === 'calculator' && <AgentDashboard />}
            {!isAdmin && view === 'history' && <MyHistory />}
            {!isAdmin && view === 'plans' && <PlanManager readOnly />}
          </div>
        </main>
      </div>
    </div>
  );
}
