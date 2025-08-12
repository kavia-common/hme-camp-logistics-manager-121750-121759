import { apiDelete, apiGet, apiPost, apiPut } from './api';

/**
 * PUBLIC_INTERFACE
 * fetchMembers
 * List camp members with optional query
 */
export async function fetchMembers(query = '') {
  return apiGet(`/members${query ? `?q=${encodeURIComponent(query)}` : ''}`).catch(() => []);
}

// PUBLIC_INTERFACE
export async function createMember(payload) {
  /** Create a new member (admin) */
  return apiPost('/members', payload);
}

// PUBLIC_INTERFACE
export async function updateMember(id, payload) {
  /** Update member details */
  return apiPut(`/members/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteMember(id) {
  /** Remove member (admin) */
  return apiDelete(`/members/${id}`);
}

// PUBLIC_INTERFACE
export async function inviteMember(email) {
  /** Send invite email to a member (admin) */
  return apiPost('/members/invite', { email });
}
