import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { handleAuthError } from '../utils/auth';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // In supabase-js v2, exchangeCodeForSession handles both OAuth and magic link PKCE
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        handleAuthError(error, navigate);
        return;
      }

      if (data?.session) {
        navigate('/'); // redirect to dashboard
      } else {
        // Fallback: try to fetch session; if present, navigate to home
        const { data: sess } = await supabase.auth.getSession();
        if (sess?.session) {
          navigate('/');
        } else {
          navigate('/auth/error');
        }
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="card">Processing authentication...</div>;
}
