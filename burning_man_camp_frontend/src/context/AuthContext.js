import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Simple client-side auth context used to store current user and admin state.
 * In production, wire this to the backend auth/session endpoints.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'demo-user',
    name: 'Demo Burner',
    email: 'demo@example.com',
    isAdmin: true,
  });

  const value = useMemo(() => ({
    user,
    setUser,
    // PUBLIC_INTERFACE
    login: (payload) => {
      /** Mock login which sets current user */
      setUser({ ...payload });
    },
    // PUBLIC_INTERFACE
    logout: () => {
      /** Mock logout to clear user - replace with backend integration */
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state */
  return useContext(AuthContext);
}
