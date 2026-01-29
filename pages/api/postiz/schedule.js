// Schedule a post via Postiz
// POST /api/postiz/schedule

import { createClient } from '@supabase/supabase-js';
import { schedulePost, getConnectedAccounts } from '../../../lib/postiz';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, mediaUrls, platforms, scheduledAt, userId, propertyId } = req.body;

  if (!content || !platforms || !scheduledAt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get connected Postiz accounts
    const connectedAccounts = await getConnectedAccounts();

    // Find integration IDs for requested platforms
    const integrationIds = [];
    const platformResults = {};

    for (const platform of platforms) {
      const account = connectedAccounts.find(
        acc => acc.type === platform || acc.platform === platform
      );

      if (account) {
        integrationIds.push(account.id);
        platformResults[platform] = { status: 'pending', integration_id: account.id };
      } else {
        platformResults[platform] = { status: 'not_connected' };
      }
    }

    let postizPostId = null;
    let status = 'draft';

    // Schedule via Postiz if we have connected accounts
    if (integrationIds.length > 0) {
      try {
        const postizResult = await schedulePost({
          content,
          mediaUrls,
          platforms,
          scheduledAt,
          integrationIds,
        });

        postizPostId = postizResult?.id;
        status = 'scheduled';

        // Update platform results
        for (const platform of platforms) {
          if (platformResults[platform]?.status === 'pending') {
            platformResults[platform].status = 'scheduled';
            platformResults[platform].postiz_post_id = postizPostId;
          }
        }
      } catch (postizError) {
        console.error('Postiz scheduling error:', postizError);
        // Still save to our database, but mark as failed for Postiz
        for (const platform of platforms) {
          if (platformResults[platform]?.status === 'pending') {
            platformResults[platform].status = 'postiz_error';
            platformResults[platform].error = postizError.message;
          }
        }
      }
    }

    // Save to our database for tracking
    const { data, error } = await supabase.from('scheduled_posts').insert({
      user_id: userId,
      property_id: propertyId || null,
      content,
      media_urls: mediaUrls || [],
      platforms,
      scheduled_at: new Date(scheduledAt).toISOString(),
      status,
      platform_results: platformResults,
      metadata: {
        postiz_post_id: postizPostId,
        scheduled_via: 'postiz',
      },
    }).select().single();

    if (error) throw error;

    res.json({
      success: true,
      post: data,
      postiz_post_id: postizPostId,
      platform_results: platformResults,
    });
  } catch (error) {
    console.error('Schedule error:', error);
    res.status(500).json({ error: error.message });
  }
}
