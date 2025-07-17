
'use client';

import * as React from 'react';
import { users as initialUsers, User } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<User | null>;
  updateUserRole: (userId: number, newRole: User['role']) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// In a real app, you'd use a database, but for this prototype, we'll manage users in memory.
let users = [...initialUsers];

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

    // Specific check for developer credentials
    const isDeveloper = (email === 'legendmatthew32@gmail.com' || email === 'gitranvitran@gmail.com') && pass === '0000';
    if (foundUser?.role === 'Developer' && isDeveloper) {
        setUser(foundUser);
        sessionStorage.setItem('shield-her-light-user', JSON.stringify(foundUser));
        return foundUser;
    }
    
    // Mock login for any other user for easier testing during development
    if (foundUser && foundUser.role !== 'Developer') {
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

  const signup = async (name: string, email: string, pass: string): Promise<User | null> => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return null; // User already exists
    }

    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      password: pass,
      role: 'Member', // Default role for new sign-ups is always Member
      avatar: 'https://placehold.co/100x100.png',
    };
    
    users.push(newUser);
    setUser(newUser);
    sessionStorage.setItem('shield-her-light-user', JSON.stringify(newUser));
    
    return newUser;
  };
  
  const updateUserRole = (userId: number, newRole: User['role']) => {
      // Update the master list
      users = users.map(u => (u.id === userId ? { ...u, role: newRole } : u));
      
      // If the updated user is the currently logged-in user, update their session
      if (user && user.id === userId) {
          const updatedUser = { ...user, role: newRole };
          setUser(updatedUser);
          sessionStorage.setItem('shield-her-light-user', JSON.stringify(updatedUser));
      }
  };

  const value = { user, loading, login, logout, signup, updateUserRole };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
