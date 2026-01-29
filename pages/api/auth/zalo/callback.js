// Zalo OA OAuth Callback
// Exchange code for access token and save to database

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { code, state, oa_id, error, error_description } = req.query;

  // Handle error from Zalo
  if (error) {
    console.error('Zalo OAuth error:', error, error_description);
    return res.redirect(`/?social_error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code || !state) {
    return res.redirect('/?social_error=Missing+code+or+state');
  }

  try {
    // Decode state to get user_id
    const { user_id } = JSON.parse(Buffer.from(state, 'base64').toString());

    if (!user_id) {
      throw new Error('Invalid state - missing user_id');
    }

    const appId = process.env.ZALO_APP_ID;
    const appSecret = process.env.ZALO_APP_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/zalo/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': appSecret,
      },
      body: new URLSearchParams({
        app_id: appId,
        code,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.message || tokenData.error);
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Get OA info
    const oaInfoResponse = await fetch('https://openapi.zalo.me/v2.0/oa/getoa', {
      headers: {
        'access_token': access_token,
      },
    });
    const oaInfo = await oaInfoResponse.json();

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('social_accounts')
      .select('id')
      .eq('user_id', user_id)
      .eq('platform', 'zalo')
      .eq('platform_user_id', oa_id || oaInfo.data?.oa_id)
      .single();

    const accountData = {
      user_id,
      platform: 'zalo',
      platform_user_id: oa_id || oaInfo.data?.oa_id,
      platform_username: oaInfo.data?.name || 'Zalo OA',
      access_token,
      refresh_token,
      token_expires_at: expiresAt,
      is_active: true,
      metadata: {
        oa_info: oaInfo.data,
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

    res.redirect('/?social_success=zalo');
  } catch (error) {
    console.error('Zalo callback error:', error);
    res.redirect(`/?social_error=${encodeURIComponent(error.message)}`);
  }
}
