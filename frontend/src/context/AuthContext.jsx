import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Refresh in background
          const freshProfile = await authService.getProfile();
          setUser(freshProfile);
        } catch (err) {
          console.error("Auth init error:", err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    return result.user;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const fresh = await authService.getProfile();
      setUser(fresh);
      return fresh;
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = user?.is_staff || user?.profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

