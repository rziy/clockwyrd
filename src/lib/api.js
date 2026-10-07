const RENDER_URL = (import.meta.env.VITE_RENDER_URL || "").replace(/\/$/, "");

const LOCAL_API_PATHS = ["/api/auth/"];

export function apiUrl(path) {
  const isLocal = LOCAL_API_PATHS.some((prefix) => path.startsWith(prefix));
  if (isLocal) return path;
  return `${RENDER_URL}${path}`;
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
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

export function isApiConfigured() { return Boolean(RENDER_URL); }
