// Cron job to process scheduled posts
// This should be called by a cron service (e.g., Vercel Cron, external cron service)
// Recommended: Run every minute

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ikkmumdaqbopacoxklzp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Verify cron secret for security
function verifyCronSecret(req) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // Skip if no secret configured

  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${cronSecret}`;
}

export default async function handler(req, res) {
  // Only allow GET requests (for cron compatibility)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret
  if (!verifyCronSecret(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date().toISOString();

    // Get all scheduled posts that are due
    const { data: duePosts, error } = await supabase
      .from('scheduled_posts')
      .select('id')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .limit(10); // Process max 10 posts per run

    if (error) throw error;

    if (!duePosts || duePosts.length === 0) {
      return res.json({ processed: 0, message: 'No scheduled posts due' });
    }

    // Process each post
    const results = [];
    for (const post of duePosts) {
      try {
        // Call the posting API internally
        const postResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/social/post`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduled_post_id: post.id }),
          }
        );

        const result = await postResponse.json();
        results.push({ post_id: post.id, ...result });
      } catch (postError) {
        results.push({ post_id: post.id, error: postError.message });
      }
    }

    res.json({
      processed: duePosts.length,
      results,
    });
  } catch (error) {
    console.error('Cron error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Vercel Cron configuration
export const config = {
  api: {
    bodyParser: true,
  },
};
