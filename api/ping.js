export default async function handler(_req, res) {
  const target = process.env.RENDER_URL;
  if (!target) return res.status(200).json({ status: "ok", message: "Keep-alive target is not configured." });
  try {
    const response = await fetch(target, { method: "GET" });
    return res.status(200).json({ status: "success", upstream: response.status });
  } catch (error) {
    return res.status(502).json({ status: "error", message: error.message });
  }
}
