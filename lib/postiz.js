// Postiz Integration Service
// Wraps Postiz SDK for social media scheduling

import Postiz from '@postiz/node';

// Initialize Postiz client
const getPostizClient = () => {
  const apiKey = process.env.POSTIZ_API_KEY;

  if (!apiKey) {
    throw new Error('POSTIZ_API_KEY is not configured');
  }

  return new Postiz({
    apiKey,
    // Use self-hosted URL if configured, otherwise use cloud
    baseUrl: process.env.POSTIZ_API_URL || 'https://api.postiz.com',
  });
};

// Platform mapping between our system and Postiz
const PLATFORM_MAP = {
  facebook: 'facebook',
  zalo: null, // Zalo not supported by Postiz, handle separately
  tiktok: 'tiktok',
  instagram: 'instagram',
  linkedin: 'linkedin',
  twitter: 'x',
  youtube: 'youtube',
  threads: 'threads',
};

/**
 * Get connected social accounts from Postiz
 */
export async function getConnectedAccounts() {
  try {
    const postiz = getPostizClient();
    const response = await postiz.integrations.list();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching Postiz accounts:', error);
    return [];
  }
}

/**
 * Get Postiz OAuth URL for connecting a platform
 */
export function getConnectUrl(platform, redirectUrl) {
  const postizPlatform = PLATFORM_MAP[platform];

  if (!postizPlatform) {
    throw new Error(`Platform ${platform} is not supported by Postiz`);
  }

  // Postiz OAuth connection URL
  const baseUrl = process.env.POSTIZ_APP_URL || 'https://app.postiz.com';
  return `${baseUrl}/integrations/social/${postizPlatform}/connect?redirect=${encodeURIComponent(redirectUrl)}`;
}

/**
 * Schedule a post via Postiz
 */
export async function schedulePost({ content, mediaUrls, platforms, scheduledAt, integrationIds }) {
  try {
    const postiz = getPostizClient();

    const postData = {
      content,
      integration: integrationIds, // Array of integration IDs from Postiz
      scheduledAt: new Date(scheduledAt).toISOString(),
      type: 'post',
    };

    // Add media if available
    if (mediaUrls && mediaUrls.length > 0) {
      postData.media = mediaUrls.map(url => ({
        url,
        type: url.match(/\.(mp4|mov|avi)$/i) ? 'video' : 'image',
      }));
    }

    const response = await postiz.posts.create(postData);
    return response.data;
  } catch (error) {
    console.error('Error scheduling post via Postiz:', error);
    throw error;
  }
}

/**
 * Get scheduled posts from Postiz
 */
export async function getScheduledPosts() {
  try {
    const postiz = getPostizClient();
    const response = await postiz.posts.list({
      status: 'scheduled',
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    return [];
  }
}

/**
 * Delete a scheduled post
 */
export async function deletePost(postId) {
  try {
    const postiz = getPostizClient();
    await postiz.posts.delete(postId);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

/**
 * Generate AI content using Postiz AI
 */
export async function generateContent({ prompt, platform, tone }) {
  try {
    const postiz = getPostizClient();
    const response = await postiz.ai.generate({
      prompt,
      platform: PLATFORM_MAP[platform] || platform,
      tone: tone || 'professional',
    });
    return response.data?.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export default {
  getConnectedAccounts,
  getConnectUrl,
  schedulePost,
  getScheduledPosts,
  deletePost,
  generateContent,
  PLATFORM_MAP,
};
