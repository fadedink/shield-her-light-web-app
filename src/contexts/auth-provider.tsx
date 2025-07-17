
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: 'Developer' | 'Chairperson' | 'Vice-Chair' | 'Secretary' | 'Vice-Secretary' | 'Treasurer' | 'Public Relations Officer' | 'Welfare Officer' | 'Flame of Fairness Officer' | 'Outreach & Partnership Officer' | 'Member';
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<User | null>;
  updateUserRole: (userId: string, newRole: User['role']) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // This case might happen if a user is created in Auth but not in Firestore
          // Or if you want to handle profile creation post-social-login
          console.error("No user profile found in Firestore for UID:", firebaseUser.uid);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      const userData = { id: userCredential.user.uid, ...userDoc.data() } as User;
      // Special check for developers
      if (userData.role === 'Developer' && pass !== '0000') {
          await signOut(auth);
          throw new Error("Invalid credentials for developer account.");
      }
      return userData;
    }
    return null;
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const signup = async (name: string, email: string, pass:string): Promise<User | null> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const { user: firebaseUser } = userCredential;

    const role = (email === 'legendmatthew32@gmail.com' || email === 'gitranvitran@gmail.com') ? 'Developer' : 'Member';

    const newUser: User = {
      id: firebaseUser.uid,
      name,
      email: firebaseUser.email!,
      role: role,
      avatar: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
    };

    // Create a document in Firestore for the new user
    await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
    });

    return newUser;
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { role: newRole });
    // If the updated user is the currently logged-in user, update their local state
    if (user && user.id === userId) {
      setUser({ ...user, role: newRole });
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
