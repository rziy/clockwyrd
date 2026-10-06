import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, isApiConfigured } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!isApiConfigured()) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const login = () => {
    if (isApiConfigured()) window.location.href = apiFetchLoginUrl();
  };

  const logout = async () => {
    try { await apiFetch("/api/auth/logout", { method: "POST" }); } catch {}
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, refresh, login, logout }}>{children}</AuthContext.Provider>;
}

function apiFetchLoginUrl() {
  const base = (import.meta.env.VITE_API_URL || import.meta.env.VITE_RENDER_URL || "").replace(/\/$/, "");
  return `${base}/api/auth/discord`;
}

export function useAuth() {
  return useContext(AuthContext);
}
