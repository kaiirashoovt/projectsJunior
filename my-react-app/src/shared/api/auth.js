import { jwtDecode } from "jwt-decode";
import { apiRequest } from "./client";

const TOKEN_KEY = "token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUserEmail() {
  if (!isTokenValid()) return null;

  const token = getAuthToken();
  if (!token) return null;

  try {
    return jwtDecode(token).sub || null;
  } catch {
    clearAuthToken();
    return null;
  }
}

export function isTokenValid() {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (!exp || Date.now() >= exp * 1000) {
      clearAuthToken();
      return false;
    }
    return true;
  } catch {
    clearAuthToken();
    return false;
  }
}

export async function loginUser(credentials) {
  const data = await apiRequest("/api/login", {
    method: "POST",
    body: credentials,
  });
  setAuthToken(data.token);
  return data;
}

export async function registerUser(credentials) {
  const data = await apiRequest("/api/register", {
    method: "POST",
    body: credentials,
  });
  setAuthToken(data.token);
  return data;
}

export async function logoutUser() {
  const token = getAuthToken();

  try {
    if (token) {
      await apiRequest("/api/logout", {
        method: "POST",
        authToken: token,
      });
    }
  } finally {
    clearAuthToken();
  }
}
