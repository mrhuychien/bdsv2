// Redirect to Postiz to connect a social platform
// GET /api/postiz/connect?platform=facebook

import { getConnectUrl } from '../../../lib/postiz';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform } = req.query;

  if (!platform) {
    return res.status(400).json({ error: 'Platform is required' });
  }

  try {
    // Redirect URL after Postiz OAuth completes
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/?postiz_connected=${platform}`;
    const connectUrl = getConnectUrl(platform, redirectUrl);

    res.redirect(connectUrl);
  } catch (error) {
    console.error('Error getting connect URL:', error);
    res.redirect(`/?social_error=${encodeURIComponent(error.message)}`);
  }
}
