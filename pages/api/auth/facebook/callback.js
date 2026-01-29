// Facebook OAuth Callback
// Exchange code for access token and save to database

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { code, state, error, error_description } = req.query;

  // Handle error from Facebook
  if (error) {
    console.error('Facebook OAuth error:', error, error_description);
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

    const clientId = process.env.FACEBOOK_APP_ID;
    const clientSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`;

    // Exchange code for access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', clientId);
    tokenUrl.searchParams.set('client_secret', clientSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }

    const { access_token, expires_in } = tokenData;

    // Get long-lived token (60 days instead of ~2 hours)
    const longLivedUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    longLivedUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longLivedUrl.searchParams.set('client_id', clientId);
    longLivedUrl.searchParams.set('client_secret', clientSecret);
    longLivedUrl.searchParams.set('fb_exchange_token', access_token);

    const longLivedResponse = await fetch(longLivedUrl.toString());
    const longLivedData = await longLivedResponse.json();

    const finalToken = longLivedData.access_token || access_token;
    const finalExpiresIn = longLivedData.expires_in || expires_in;

    // Get user profile
    const profileResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,picture&access_token=${finalToken}`
    );
    const profileData = await profileResponse.json();

    // Get user's pages (for posting to pages)
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${finalToken}`
    );
    const pagesData = await pagesResponse.json();

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + finalExpiresIn * 1000).toISOString();

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('social_accounts')
      .select('id')
      .eq('user_id', user_id)
      .eq('platform', 'facebook')
      .eq('platform_user_id', profileData.id)
      .single();

    const accountData = {
      user_id,
      platform: 'facebook',
      platform_user_id: profileData.id,
      platform_username: profileData.name,
      access_token: finalToken,
      token_expires_at: expiresAt,
      is_active: true,
      metadata: {
        picture: profileData.picture?.data?.url,
        pages: pagesData.data || [],
      },
    };

    if (existingAccount) {
      // Update existing account
      await supabase
        .from('social_accounts')
        .update(accountData)
        .eq('id', existingAccount.id);
    } else {
      // Insert new account
      await supabase.from('social_accounts').insert(accountData);
    }

    // Redirect back to app with success
    res.redirect('/?social_success=facebook');
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`/?social_error=${encodeURIComponent(error.message)}`);
  }
}
