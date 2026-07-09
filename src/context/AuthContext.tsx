import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  membershipTier?: 'none' | 'artisan' | 'master';
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock user accounts for demo
const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: 'u1',
    name: 'Julia Hampton',
    email: 'julia@example.com',
    password: 'password123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    membershipTier: 'master',
  },
  {
    id: 'admin1',
    name: 'Elara Vance',
    email: 'admin@twothreads.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=200&auto=format&fit=crop',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      // localStorage persists across tabs and page refreshes (unlike sessionStorage)
      const stored = localStorage.getItem('tt_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate network delay

    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    setIsLoading(false);

    if (found) {
      const { password: _pw, ...safeUser } = found;
      setUser(safeUser);
      try { localStorage.setItem('tt_auth_user', JSON.stringify(safeUser)); } catch {}
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Try julia@example.com / password123 or admin@twothreads.com / admin123' };
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate network delay
    setIsLoading(false);

    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: 'customer',
      membershipTier: 'none',
    };

    MOCK_USERS.push({
      ...newUser,
      password
    });

    setUser(newUser);
    try { localStorage.setItem('tt_auth_user', JSON.stringify(newUser)); } catch {}
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem('tt_auth_user'); } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
