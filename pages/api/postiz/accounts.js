// Get connected social accounts from Postiz
// GET /api/postiz/accounts

import { getConnectedAccounts } from '../../../lib/postiz';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accounts = await getConnectedAccounts();

    // Transform to our format
    const transformed = accounts.map(acc => ({
      id: acc.id,
      platform: acc.type || acc.platform,
      platform_username: acc.name || acc.username,
      avatar: acc.picture || acc.avatar,
      is_active: acc.valid !== false,
    }));

    res.json({ accounts: transformed });
  } catch (error) {
    console.error('Error fetching Postiz accounts:', error);
    res.status(500).json({ error: error.message });
  }
}
