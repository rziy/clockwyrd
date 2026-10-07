import { readSession } from "../_auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method not allowed" });
  const session = readSession(req);
  if (!session) return res.status(401).json({ success: false, error: "Not authenticated" });
  return res.json({ success: true, user: { id: session.id, username: session.username, avatar: session.avatar } });
}
