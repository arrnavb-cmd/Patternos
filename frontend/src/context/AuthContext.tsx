import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

interface User {
  email: string;
  role: 'aggregator' | 'brand';
  brand: string | null;
  name: string;
  sessionId: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAggregator: () => boolean;
  isBrand: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount and after every route change
  useEffect(() => {
    console.log('🔍 Checking authentication...');
    const session = AuthService.getSession();
    setUser(session);
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    console.log('🔐 Login attempt:', email);
    const session = AuthService.login(email, password);
    
    if (session) {
      setUser(session);
      console.log('✅ Login successful');
      return true;
    }
    
    console.log('❌ Login failed');
    return false;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isAggregator = () => user?.role === 'aggregator';
  const isBrand = () => user?.role === 'brand';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAggregator, isBrand }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
