import { apiPost } from './api';

/**
 * PUBLIC_INTERFACE
 * requestInvite
 * Admin triggers invite flow for a new member
 */
export async function requestInvite(email) {
  return apiPost('/auth/invite', { email });
}

// PUBLIC_INTERFACE
export async function acceptInvite(token, profile) {
  /** Member accepts invite, sets up profile */
  return apiPost('/auth/accept', { token, profile });
}
