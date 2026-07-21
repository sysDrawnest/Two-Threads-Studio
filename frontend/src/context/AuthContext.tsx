import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapBackendUserToAuthUser = (backendUser: any): AuthUser => {
  return {
    id: backendUser.id,
    name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
    email: backendUser.email,
    role: backendUser.role.toLowerCase() as UserRole,
    avatar: backendUser.avatarUrl || undefined,
    membershipTier: 'none',
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('tt_access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { apiClient } = await import('../services/apiClient');
        const result = await apiClient.get('/auth/me');
        if (result.success && result.data?.user) {
          setUser(mapBackendUserToAuthUser(result.data.user));
        } else {
          localStorage.removeItem('tt_access_token');
          localStorage.removeItem('tt_refresh_token');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        localStorage.removeItem('tt_access_token');
        localStorage.removeItem('tt_refresh_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const handleLogoutEvent = () => {
      localStorage.removeItem('tt_access_token');
      localStorage.removeItem('tt_refresh_token');
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        return { success: false, error: result.message || 'Login failed' };
      }

      const { user: backendUser, accessToken, refreshToken } = result.data;
      localStorage.setItem('tt_access_token', accessToken);
      localStorage.setItem('tt_refresh_token', refreshToken);

      // Merge guest cart if guestId exists
      const guestId = localStorage.getItem('tts_guest_id');
      if (guestId) {
        try {
          await fetch(`${API_BASE_URL}/cart/merge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ guestId }),
          });
          localStorage.removeItem('tts_guest_id');
        } catch (mergeErr) {
          console.error('Failed to merge guest cart on login:', mergeErr);
        }
      }

      const authUser = mapBackendUserToAuthUser(backendUser);
      setUser(authUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Split full name
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || ' ';

      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const registerResult = await registerResponse.json();
      if (!registerResponse.ok || !registerResult.success) {
        return { success: false, error: registerResult.message || 'Signup failed' };
      }

      // Auto login after successful signup
      return await login(email, password);
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('tt_refresh_token');
    if (refreshToken) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(err => console.error('Silent logout error:', err));
    }

    localStorage.removeItem('tt_access_token');
    localStorage.removeItem('tt_refresh_token');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
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
