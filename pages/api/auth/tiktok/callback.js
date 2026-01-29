// TikTok OAuth Callback
// Exchange code for access token and save to database

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
}

export default async function handler(req, res) {
  const { code, state, error, error_description } = req.query;

  // Handle error from TikTok
  if (error) {
    console.error('TikTok OAuth error:', error, error_description);
    return res.redirect(`/?social_error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code || !state) {
    return res.redirect('/?social_error=Missing+code+or+state');
  }

  try {
    // Get code verifier from cookie
    const cookies = parseCookies(req.headers.cookie);
    const codeVerifier = cookies.tiktok_code_verifier;

    if (!codeVerifier) {
      throw new Error('Missing code verifier');
    }

    // Clear the cookie
    res.setHeader('Set-Cookie', 'tiktok_code_verifier=; Path=/; HttpOnly; Max-Age=0');

    // Decode state to get user_id
    const { user_id } = JSON.parse(Buffer.from(state, 'base64').toString());

    if (!user_id) {
      throw new Error('Invalid state - missing user_id');
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const { access_token, refresh_token, expires_in, open_id } = tokenData;

    // Get user info
    const userInfoResponse = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );
    const userInfo = await userInfoResponse.json();

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('social_accounts')
      .select('id')
      .eq('user_id', user_id)
      .eq('platform', 'tiktok')
      .eq('platform_user_id', open_id)
      .single();

    const accountData = {
      user_id,
      platform: 'tiktok',
      platform_user_id: open_id,
      platform_username: userInfo.data?.user?.display_name || 'TikTok User',
      access_token,
      refresh_token,
      token_expires_at: expiresAt,
      is_active: true,
      metadata: {
        avatar_url: userInfo.data?.user?.avatar_url,
        union_id: userInfo.data?.user?.union_id,
      },
    };

    if (existingAccount) {
      await supabase
        .from('social_accounts')
        .update(accountData)
        .eq('id', existingAccount.id);
    } else {
      await supabase.from('social_accounts').insert(accountData);
    }

    res.redirect('/?social_success=tiktok');
  } catch (error) {
    console.error('TikTok callback error:', error);
    res.redirect(`/?social_error=${encodeURIComponent(error.message)}`);
  }
}
