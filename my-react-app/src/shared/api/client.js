import { API_BASE_URL } from "../config";

function buildUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, options = {}) {
  const { authToken, headers, body, ...fetchOptions } = options;
  const requestHeaders = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers: requestHeaders,
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  });

  const data = await readResponse(response);

  if (!response.ok) {
    const message =
      data?.detail || data?.message || data || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return data;
}
