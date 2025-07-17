'use client';

import * as React from 'react';
import { users, User } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('shield-her-light-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from session storage', error);
      sessionStorage.removeItem('shield-her-light-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    // This is a mock login. In a real app, you'd call an API.
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const isDevUser = (email === 'legendmatthew32@gmail.com' || email === 'gitranvitran@gmail.com') && pass === '0000';

    if (foundUser && (foundUser.password === pass || isDevUser)) {
        setUser(foundUser);
        sessionStorage.setItem('shield-her-light-user', JSON.stringify(foundUser));
        return foundUser;
    }
    
    // Mock for any user for easier testing
    if (foundUser) {
        setUser(foundUser);
        sessionStorage.setItem('shield-her-light-user', JSON.stringify(foundUser));
        return foundUser;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('shield-her-light-user');
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
