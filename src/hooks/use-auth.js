'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getCurrentSession,
  syncTokensToCookies,
  clearAuthCookies,
} from '@/lib/cognito';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const session = await getCurrentSession();
      if (session && session.isValid()) {
        const idToken = session.getIdToken();
        setUser({
          email: idToken.payload.email,
          sub: idToken.payload.sub,
        });
        syncTokensToCookies();
      } else {
        setUser(null);
        clearAuthCookies();
      }
    } catch (error) {
      setUser(null);
      clearAuthCookies();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const result = await cognitoSignIn(credentials);
    // Check if this is a challenge response (e.g., NEW_PASSWORD_REQUIRED)
    if (result?.challengeName) {
      return result;
    }
    // Otherwise, it's a successful session
    const idToken = result.getIdToken();
    setUser({
      email: idToken.payload.email,
      sub: idToken.payload.sub,
    });
    syncTokensToCookies();
    router.push('/creators');
    return null;
  };

  const loginWithSession = async (session) => {
    const idToken = session.getIdToken();
    setUser({
      email: idToken.payload.email,
      sub: idToken.payload.sub,
    });
    syncTokensToCookies();
    router.push('/creators');
  };

  const logout = async () => {
    await cognitoSignOut();
    clearAuthCookies();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithSession,
    logout,
    getSession: getCurrentSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
