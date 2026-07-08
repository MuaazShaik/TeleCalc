import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import AppShell from './components/AppShell';

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div className="spinner" style={{width:32,height:32}}/></div>;
  if (!user) return <LoginPage />;
  return <AppShell />;
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
