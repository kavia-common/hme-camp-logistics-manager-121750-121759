import { apiDelete, apiGet, apiPost, apiPut } from './api';

/**
 * PUBLIC_INTERFACE
 * fetchEvents
 * Returns list of camp events
 */
export async function fetchEvents() {
  return apiGet('/calendar/events').catch(() => []);
}

// PUBLIC_INTERFACE
export async function createEvent(payload) {
  /** Admin: create event */
  return apiPost('/calendar/events', payload);
}

// PUBLIC_INTERFACE
export async function updateEvent(id, payload) {
  /** Admin: update event */
  return apiPut(`/calendar/events/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteEvent(id) {
  /** Admin: delete event */
  return apiDelete(`/calendar/events/${id}`);
}
