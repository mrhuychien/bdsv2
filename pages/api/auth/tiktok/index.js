// TikTok OAuth - Initiate Flow
// Redirect user to TikTok login page

import crypto from 'crypto';

export default function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;

  if (!clientKey) {
    return res.status(500).json({ error: 'TikTok Client Key not configured' });
  }

  // Scopes for posting videos
  const scope = [
    'user.info.basic',
    'video.list',
    'video.publish',
    'video.upload',
  ].join(',');

  // State contains user_id for callback
  const state = Buffer.from(JSON.stringify({ user_id })).toString('base64');

  // Generate code verifier and challenge for PKCE
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Store code verifier in cookie for callback
  res.setHeader('Set-Cookie', `tiktok_code_verifier=${codeVerifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authUrl.searchParams.set('client_key', clientKey);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
}
