import { apiGet, apiPost, apiPut } from './api';

/**
 * PUBLIC_INTERFACE
 * fetchDues
 * List dues records for a user or all (admin)
 */
export async function fetchDues() {
  return apiGet('/dues').catch(() => []);
}

// PUBLIC_INTERFACE
export async function createDue(payload) {
  /** Admin: create a due item for a user */
  return apiPost('/dues', payload);
}

// PUBLIC_INTERFACE
export async function approveDue(id) {
  /** Admin: approve dues payment */
  return apiPost(`/dues/${id}/approve`, {});
}

// PUBLIC_INTERFACE
export async function markPaid(id, ref) {
  /** User/Admin: mark as paid with reference */
  return apiPut(`/dues/${id}/pay`, { reference: ref });
}
