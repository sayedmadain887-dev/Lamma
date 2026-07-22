import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('lamma_token');
        const storedUser = localStorage.getItem('lamma_user');
        if (!token || !storedUser) {
          setIsLoading(false);
          return;
        }
        // TODO: once a real backend exists, verify the token here instead,
        // e.g. GET /api/auth/me, and use the response instead of localStorage.
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem('lamma_token', token);
    localStorage.setItem('lamma_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lamma_token');
    localStorage.removeItem('lamma_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((partialUser) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partialUser };
      localStorage.setItem('lamma_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}