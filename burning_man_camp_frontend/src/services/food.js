import { apiDelete, apiGet, apiPost, apiPut } from './api';

/**
 * PUBLIC_INTERFACE
 * fetchMeals
 * Returns planned shared meals
 */
export async function fetchMeals() {
  return apiGet('/food/meals').catch(() => []);
}

// PUBLIC_INTERFACE
export async function createMeal(payload) {
  /** Admin: create a shared meal entry */
  return apiPost('/food/meals', payload);
}

// PUBLIC_INTERFACE
export async function updateMeal(id, payload) {
  /** Update meal info */
  return apiPut(`/food/meals/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteMeal(id) {
  /** Delete meal */
  return apiDelete(`/food/meals/${id}`);
}

// PUBLIC_INTERFACE
export async function signupForMeal(mealId, personId) {
  /** Sign up a person for a meal role */
  return apiPost(`/food/meals/${mealId}/signup`, { personId });
}
