import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (emailOrCredentials: any, password?: string) => Promise<void>;
  register: (nameOrData: any, email?: string, phone?: string, password?: string) => Promise<void>;
  logout: () => void;
  quickSwitchUser: (role: 'USER' | 'ADMIN') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('airbooking_token');
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('airbooking_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (token) {
      api.getCurrentUser()
        .then((profile) => {
          setUser(profile);
          sessionStorage.setItem('airbooking_user', JSON.stringify(profile));
        })
        .catch(() => {
          // Keep existing cached profile if network or token refresh
        });
    }
  }, [token]);

  const login = async (emailOrCredentials: any, password?: string) => {
    const payload = typeof emailOrCredentials === 'string'
      ? { email: emailOrCredentials, password }
      : emailOrCredentials;
    const data = await api.login(payload);
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    });
    sessionStorage.setItem('airbooking_token', data.token);
    sessionStorage.setItem('airbooking_user', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    }));
  };

  const register = async (nameOrData: any, email?: string, phone?: string, password?: string) => {
    const payload = typeof nameOrData === 'string'
      ? { name: nameOrData, email, phone, password }
      : nameOrData;
    const data = await api.register(payload);
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    });
    sessionStorage.setItem('airbooking_token', data.token);
    sessionStorage.setItem('airbooking_user', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('airbooking_token');
    sessionStorage.removeItem('airbooking_user');
    localStorage.removeItem('airbooking_token');
    localStorage.removeItem('airbooking_user');
  };

  const quickSwitchUser = async (role: 'USER' | 'ADMIN') => {
    const email = role === 'ADMIN' ? 'admin@airlink.com' : 'user@airlink.com';
    await login({ email, password: 'Password@123' });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        quickSwitchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
