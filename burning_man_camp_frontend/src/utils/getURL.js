export function getURL() {
  // Prefer explicit env override, fallback to current origin or localhost
  let url =
    process.env.REACT_APP_SITE_URL ||
    (typeof window !== 'undefined' && window.location?.origin) ||
    'http://localhost:3000';

  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/')) {
    url = `${url}/`;
  }
  return url;
}

// PUBLIC_INTERFACE
export function buildRedirectURL(path) {
  /** Build a full redirect URL that targets a client-side route when using HashRouter.
   * Example: buildRedirectURL('auth/callback') => https://host/#/auth/callback
   */
  const base = getURL();
  const clean = String(path || '').replace(/^\/+/, '');
  return `${base}#/${clean}`;
}
