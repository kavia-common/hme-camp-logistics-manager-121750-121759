import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * supabase
 * Singleton Supabase client used across the app.
 * - Reads configuration from REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_KEY.
 * - In test environment, provides a minimal mock to avoid hard failures when env vars are absent.
 * - In non-test environments, throws a descriptive error if configuration is missing.
 */

// Read and sanitize env values (CRA injects process.env at build time for REACT_APP_* keys)
const supabaseUrl = (process.env.REACT_APP_SUPABASE_URL || '').trim();
const supabaseKey = (process.env.REACT_APP_SUPABASE_KEY || '').trim();

function createMockSupabase() {
  const noSession = { session: null };
  return {
    auth: {
      // Minimal API surface used by the app during tests
      getSession: async () => ({ data: noSession, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signInWithOtp: async () => ({ data: null, error: null }),
      signInWithOAuth: async () => ({ data: null, error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      signOut: async () => ({ data: null, error: null }),
      exchangeCodeForSession: async () => ({ data: noSession, error: null }),
    },
  };
}

// Helpful non-secret debug line in dev
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.info('Supabase env check:', {
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseKey),
    nodeEnv: process.env.NODE_ENV,
  });
}

let client;

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'test') {
    // Use a safe mock during tests to prevent crashes
    client = createMockSupabase();
  } else {
    // Provide a descriptive error and guidance instead of letting supabase-js throw a generic message
    const missing = [
      !supabaseUrl ? 'REACT_APP_SUPABASE_URL' : null,
      !supabaseKey ? 'REACT_APP_SUPABASE_KEY' : null,
    ]
      .filter(Boolean)
      .join(', ');

    const guidance =
      'Missing Supabase configuration. Please create a .env in the frontend root ' +
      'based on .env.example and restart the dev server. ' +
      'Required variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY';

    // eslint-disable-next-line no-console
    console.error(`Supabase: missing env vars (${missing}). ${guidance}`);

    // Throw to surface the issue early and clearly
    throw new Error(guidance);
  }
} else {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// PUBLIC_INTERFACE
export const supabase = client;
