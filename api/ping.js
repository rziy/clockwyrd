export default function handler(_req, res) {
  res.status(200).json({ status: "ok", service: "clockwyrd-web", timestamp: new Date().toISOString() });
}
