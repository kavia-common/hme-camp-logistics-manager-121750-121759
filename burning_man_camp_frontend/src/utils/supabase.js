import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Defensive checks to help in dev; production should set these via env
if (!supabaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('Missing REACT_APP_SUPABASE_URL');
}
if (!supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing REACT_APP_SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
