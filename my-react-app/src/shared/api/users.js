import { apiRequest } from "./client";

export function getUserByEmail(email) {
  return apiRequest(`/api/users/${encodeURIComponent(email)}`);
}

export function updateUserByEmail(email, data) {
  return apiRequest(`/api/user_update/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: data,
  });
}
