const API_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_RENDER_URL || "").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export function isApiConfigured() {
  return Boolean(API_URL);
}
