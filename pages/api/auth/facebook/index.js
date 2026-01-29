// Facebook OAuth - Initiate Flow
// Redirect user to Facebook login page

export default function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`;

  if (!clientId) {
    return res.status(500).json({ error: 'Facebook App ID not configured' });
  }

  // Permissions needed for posting
  const scope = [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'pages_manage_metadata',
    'public_profile',
  ].join(',');

  // State contains user_id for callback
  const state = Buffer.from(JSON.stringify({ user_id })).toString('base64');

  const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');

  res.redirect(authUrl.toString());
}
