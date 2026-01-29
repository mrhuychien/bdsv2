// Zalo OA OAuth - Initiate Flow
// Redirect user to Zalo login page for Official Account authorization

export default function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  const appId = process.env.ZALO_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/zalo/callback`;

  if (!appId) {
    return res.status(500).json({ error: 'Zalo App ID not configured' });
  }

  // State contains user_id for callback
  const state = Buffer.from(JSON.stringify({ user_id })).toString('base64');

  // Zalo OA OAuth URL
  const authUrl = new URL('https://oauth.zaloapp.com/v4/oa/permission');
  authUrl.searchParams.set('app_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  res.redirect(authUrl.toString());
}
