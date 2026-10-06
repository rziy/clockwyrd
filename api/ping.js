export default async function handler(req, res) {
  try {
    const renderUrl = 'https://saint-host-1.onrender.com';
    await fetch(renderUrl);
    return res.status(200).json({ status: 'success', message: 'Bot kept alive!' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}