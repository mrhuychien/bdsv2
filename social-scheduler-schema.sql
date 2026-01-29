-- ═══════════════════════════════════════════════════════════════
-- BATDONGSAN.DIGITAL - SOCIAL MEDIA SCHEDULER SCHEMA
-- Run this in Supabase SQL Editor after main schema
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. SOCIAL ACCOUNTS TABLE (Tài khoản MXH đã kết nối)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'tiktok', 'instagram', 'zalo', 'youtube', 'threads')),
  platform_user_id TEXT,
  platform_username TEXT,
  platform_name TEXT, -- Display name
  platform_avatar TEXT, -- Avatar URL

  access_token TEXT, -- Encrypted
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,

  account_type TEXT DEFAULT 'profile' CHECK (account_type IN ('profile', 'page', 'group', 'channel')),
  page_id TEXT, -- For Facebook Pages

  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,

  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 2. SCHEDULED POSTS TABLE (Bài đăng đã lên lịch)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,

  -- Content
  content TEXT NOT NULL,
  media_urls TEXT[], -- Array of image/video URLs
  hashtags TEXT[],

  -- Platforms to post to (stored as array)
  platforms TEXT[] NOT NULL,

  -- Scheduling
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'partial', 'failed')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,

  -- Results per platform
  platform_results JSONB DEFAULT '{}',
  -- Example: {"facebook": {"status": "published", "post_id": "123", "url": "..."}, "tiktok": {"status": "failed", "error": "..."}}

  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 3. POST TEMPLATES TABLE (Mẫu bài đăng)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.post_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  name TEXT NOT NULL,
  property_type TEXT, -- null = all types
  platform TEXT, -- null = all platforms

  content_template TEXT NOT NULL, -- Template with {{variables}}
  hashtags TEXT[],

  is_default BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 4. INDEXES
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_social_accounts_user ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_at ON scheduled_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_post_templates_user ON post_templates(user_id);

-- ═══════════════════════════════════════════════════════════════
-- 5. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_templates ENABLE ROW LEVEL SECURITY;

-- Social Accounts Policies
CREATE POLICY "Users can view own social accounts"
  ON social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social accounts"
  ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts"
  ON social_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts"
  ON social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Scheduled Posts Policies
CREATE POLICY "Users can view own scheduled posts"
  ON scheduled_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scheduled posts"
  ON scheduled_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled posts"
  ON scheduled_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled posts"
  ON scheduled_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Post Templates Policies
CREATE POLICY "Users can view own templates"
  ON post_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
  ON post_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON post_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON post_templates FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 6. FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at
  BEFORE UPDATE ON scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_templates_updated_at
  BEFORE UPDATE ON post_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- DONE! Social Scheduler schema ready
-- ═══════════════════════════════════════════════════════════════
