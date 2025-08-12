import { apiDelete, apiGet, apiPost, apiPut } from './api';

/**
 * PUBLIC_INTERFACE
 * fetchAccommodations
 * Retrieves accommodation items and layout info
 */
export async function fetchAccommodations() {
  return apiGet('/accommodations').catch(() => []);
}

// PUBLIC_INTERFACE
export async function createAccommodation(payload) {
  /** Admin: create accommodation record */
  return apiPost('/accommodations', payload);
}

// PUBLIC_INTERFACE
export async function updateAccommodation(id, payload) {
  /** Update accommodation */
  return apiPut(`/accommodations/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteAccommodation(id) {
  /** Delete accommodation */
  return apiDelete(`/accommodations/${id}`);
}
