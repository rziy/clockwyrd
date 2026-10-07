import crypto from "node:crypto";

export const DISCORD_API = "https://discord.com/api/v10";
export const COOKIE_NAME = "clockwyrd_session";

export function env(name) {
  return process.env[name] || "";
}

export function siteUrl(req) {
  const configured = env("SITE_URL").replace(/\/$/, "");
  if (configured) return configured;
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return host ? `${proto}://${host}` : "http://localhost:5173";
}

export function redirectUri(req) {
  return `${siteUrl(req)}/api/auth/callback`;
}

export function sign(value) {
  return crypto.createHmac("sha256", env("SESSION_SECRET") || "missing-secret").update(value).digest("base64url");
}

export function makeSession(user) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function parseCookies(header = "") {
  const result = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    try { result[key] = decodeURIComponent(part.slice(index + 1)); } catch {}
  }
  return result;
}

export function readSession(req) {
  if (!env("SESSION_SECRET")) return null;
  const raw = parseCookies(req.headers.cookie || "")[COOKIE_NAME];
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.exp > Date.now() ? data : null;
  } catch { return null; }
}

export function setSession(res, user) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(makeSession(user))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`);
}

export function clearSession(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

export function configured() {
  return ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET", "SESSION_SECRET"].every((key) => Boolean(env(key))) && Boolean(env("OWNER_USER_ID") || env("OWNER_ROLE_ID"));
}

export async function getDiscordUser(accessToken) {
  const response = await fetch(`${DISCORD_API}/users/@me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error("Could not read Discord user");
  return response.json();
}
