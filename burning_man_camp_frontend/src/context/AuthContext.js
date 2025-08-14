import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { getURL, buildRedirectURL } from '../utils/getURL';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load initial session and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const sUser = data?.session?.user || null;
      setUser(sUser ? mapUser(sUser) : null);
      setInitializing(false);
    };

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user || null;
      setUser(sUser ? mapUser(sUser) : null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,

      // Sign up with email/password
      async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: buildRedirectURL('auth/callback'),
          },
        });
        if (error) throw error;
        return data;
      },

      // Sign in with email/password
      async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return data;
      },

      // Magic link sign-in
      async signInWithMagicLink(email) {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${getURL()}auth/callback`,
          },
        });
        if (error) throw error;
        return data;
      },

      // OAuth sign-in
      async signInWithOAuth(provider) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: buildRedirectURL('auth/callback'),
          },
        });
        if (error) throw error;
        return data;
      },

      // Password reset
      async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: buildRedirectURL('auth/reset-password'),
        });
        if (error) throw error;
        return data;
      },

      // Sign out
      async logout() {
        await supabase.auth.signOut();
        setUser(null);
      },

      // Direct setter (rarely needed)
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Map Supabase user to app user shape with minimal fields
function mapUser(supabaseUser) {
  const isAdmin =
    supabaseUser?.user_metadata?.is_admin === true ||
    (Array.isArray(supabaseUser?.app_metadata?.roles) &&
      supabaseUser.app_metadata.roles.includes('admin'));

  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email || 'User',
    email: supabaseUser.email,
    isAdmin: Boolean(isAdmin),
    raw: supabaseUser,
  };
}
