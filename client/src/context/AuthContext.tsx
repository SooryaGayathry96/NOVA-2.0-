import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; callsign?: string; avatar?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: { name?: string; callsign?: string; avatar?: string; bio?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nova_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const savedToken = localStorage.getItem('nova_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('nova_token');
        setUser(null);
      }
    } catch (err) {
      console.warn('Session verification failed, logging out.');
      localStorage.removeItem('nova_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('nova_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; callsign?: string; avatar?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      if (res.success && res.token) {
        localStorage.setItem('nova_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('nova_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (e) {}
  };

  const updateProfile = async (payload: { name?: string; callsign?: string; avatar?: string; bio?: string }) => {
    const res = await api.updateProfile(payload);
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
