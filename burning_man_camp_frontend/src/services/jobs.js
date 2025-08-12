import { apiDelete, apiGet, apiPost, apiPut } from './api';

/**
 * PUBLIC_INTERFACE
 * fetchJobs
 * Returns list of camp jobs/tasks
 */
export async function fetchJobs() {
  return apiGet('/jobs').catch(() => []);
}

// PUBLIC_INTERFACE
export async function assignJob(jobId, memberId) {
  /** Assign a member to a job */
  return apiPost(`/jobs/${jobId}/assign`, { memberId });
}

// PUBLIC_INTERFACE
export async function createJob(payload) {
  /** Admin: create a new job */
  return apiPost('/jobs', payload);
}

// PUBLIC_INTERFACE
export async function updateJob(id, payload) {
  /** Admin: update job details */
  return apiPut(`/jobs/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteJob(id) {
  /** Admin: delete a job */
  return apiDelete(`/jobs/${id}`);
}
