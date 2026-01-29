// Refresh expired OAuth tokens
// Called by scheduled job or before posting

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function refreshFacebookToken(account) {
  // Facebook long-lived tokens last 60 days and need to be refreshed before expiry
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${process.env.FACEBOOK_APP_ID}&` +
    `client_secret=${process.env.FACEBOOK_APP_SECRET}&` +
    `fb_exchange_token=${account.access_token}`
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return {
    access_token: data.access_token,
    token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
  };
}

async function refreshZaloToken(account) {
  const response = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'secret_key': process.env.ZALO_APP_SECRET,
    },
    body: new URLSearchParams({
      app_id: process.env.ZALO_APP_ID,
      refresh_token: account.refresh_token,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message || data.error);
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
  };
}

async function refreshTiktokToken(account) {
  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      refresh_token: account.refresh_token,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { account_id } = req.body;

  try {
    // Get account
    const { data: account, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', account_id)
      .single();

    if (error || !account) {
      throw new Error('Account not found');
    }

    let newTokens;

    switch (account.platform) {
      case 'facebook':
        newTokens = await refreshFacebookToken(account);
        break;
      case 'zalo':
        newTokens = await refreshZaloToken(account);
        break;
      case 'tiktok':
        newTokens = await refreshTiktokToken(account);
        break;
      default:
        throw new Error(`Unknown platform: ${account.platform}`);
    }

    // Update account with new tokens
    await supabase
      .from('social_accounts')
      .update(newTokens)
      .eq('id', account_id);

    res.json({ success: true, expires_at: newTokens.token_expires_at });
  } catch (error) {
    console.error('Token refresh error:', error);

    // Mark account as inactive if refresh fails
    if (account_id) {
      await supabase
        .from('social_accounts')
        .update({ is_active: false })
        .eq('id', account_id);
    }

    res.status(500).json({ error: error.message });
  }
}
