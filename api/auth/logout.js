import { clearSession } from "../_auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
  clearSession(res);
  return res.json({ success: true });
}
