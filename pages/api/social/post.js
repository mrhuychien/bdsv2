// Social Media Posting API
// Posts content to connected social accounts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function postToFacebook(account, content, mediaUrls) {
  // Post to user's default page or profile
  const pages = account.metadata?.pages || [];

  if (pages.length > 0) {
    // Post to first page
    const page = pages[0];
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${page.id}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          access_token: page.access_token,
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return { post_id: data.id, url: `https://facebook.com/${data.id}` };
  } else {
    // Post to user profile
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          access_token: account.access_token,
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return { post_id: data.id, url: `https://facebook.com/${data.id}` };
  }
}

async function postToZalo(account, content, mediaUrls) {
  // Zalo OA Article API
  const response = await fetch('https://openapi.zalo.me/v2.0/oa/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': account.access_token,
    },
    body: JSON.stringify({
      recipient: { user_id: 'broadcast' }, // Broadcast to all followers
      message: {
        text: content,
      },
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.message || data.error);
  return { message_id: data.data?.message_id };
}

async function postToTiktok(account, content, mediaUrls) {
  // TikTok requires video upload - this is a simplified version
  // In production, you'd need to upload video first, then create post

  if (!mediaUrls || mediaUrls.length === 0) {
    throw new Error('TikTok requires a video to post');
  }

  // For now, return a placeholder - real implementation needs video upload flow
  return {
    status: 'pending',
    message: 'Video posting to TikTok requires additional setup',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scheduled_post_id } = req.body;

  try {
    // Get scheduled post
    const { data: post, error: postError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('id', scheduled_post_id)
      .single();

    if (postError || !post) {
      throw new Error('Scheduled post not found');
    }

    // Update status to publishing
    await supabase
      .from('scheduled_posts')
      .update({ status: 'publishing' })
      .eq('id', scheduled_post_id);

    // Get user's social accounts for the platforms
    const { data: accounts } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', post.user_id)
      .in('platform', post.platforms)
      .eq('is_active', true);

    const results = {};
    let hasSuccess = false;
    let hasFailed = false;

    for (const platform of post.platforms) {
      const account = accounts?.find(a => a.platform === platform);

      if (!account) {
        results[platform] = { status: 'failed', error: 'Account not connected' };
        hasFailed = true;
        continue;
      }

      try {
        let postResult;
        switch (platform) {
          case 'facebook':
            postResult = await postToFacebook(account, post.content, post.media_urls);
            break;
          case 'zalo':
            postResult = await postToZalo(account, post.content, post.media_urls);
            break;
          case 'tiktok':
            postResult = await postToTiktok(account, post.content, post.media_urls);
            break;
          default:
            throw new Error(`Unknown platform: ${platform}`);
        }

        results[platform] = { status: 'published', ...postResult };
        hasSuccess = true;
      } catch (error) {
        results[platform] = { status: 'failed', error: error.message };
        hasFailed = true;
      }
    }

    // Determine final status
    let finalStatus = 'failed';
    if (hasSuccess && !hasFailed) {
      finalStatus = 'published';
    } else if (hasSuccess && hasFailed) {
      finalStatus = 'partial';
    }

    // Update scheduled post with results
    await supabase
      .from('scheduled_posts')
      .update({
        status: finalStatus,
        platform_results: results,
        published_at: hasSuccess ? new Date().toISOString() : null,
      })
      .eq('id', scheduled_post_id);

    res.json({ success: true, status: finalStatus, results });
  } catch (error) {
    console.error('Posting error:', error);

    // Update post status to failed
    if (req.body.scheduled_post_id) {
      await supabase
        .from('scheduled_posts')
        .update({
          status: 'failed',
          error_message: error.message,
        })
        .eq('id', req.body.scheduled_post_id);
    }

    res.status(500).json({ error: error.message });
  }
}
