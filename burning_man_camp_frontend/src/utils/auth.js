export const handleAuthError = (error, navigate) => {
  // eslint-disable-next-line no-console
  console.error('Authentication error:', error);
  const message = (error && error.message) || '';

  if (message.includes('redirect')) {
    navigate('/auth/error?type=redirect');
  } else if (message.includes('email')) {
    navigate('/auth/error?type=email');
  } else {
    navigate('/auth/error');
  }
};
