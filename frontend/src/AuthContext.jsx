import { createContext, useContext, useState, useEffect } from 'react';
import { post, get } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      get('/auth/me').then(u => setUser(u)).catch(() => localStorage.clear()).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const login = async (username, password) => {
    const data = await post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const register = async (username, password, fullName) => {
    const data = await post('/auth/register', { username, password, fullName });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => { localStorage.clear(); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
