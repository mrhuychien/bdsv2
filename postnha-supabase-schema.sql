-- ═══════════════════════════════════════════════════════════════
-- POSTNHÀ DATABASE SCHEMA - PHASE 1
-- Run this in Supabase SQL Editor
-- Project: PostNhà Platform v2.1
-- Date: 28/01/2025
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- 1. PROFILES TABLE (extends auth.users)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  specialization TEXT[], -- array of property types
  areas TEXT[], -- array of areas
  social_links JSONB DEFAULT '{}',
  agent_page_slug TEXT UNIQUE,
  agent_page_template TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 2. PROPERTIES TABLE (Kho hàng BĐS)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  title TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('can-ho', 'dat-nen', 'nha-pho', 'biet-thu', 'mat-bang', 'phong-tro')),
  status TEXT DEFAULT 'dang-ban' CHECK (status IN ('dang-ban', 'da-coc', 'da-ban', 'tam-ngung')),
  
  -- Price
  price NUMERIC,
  price_unit TEXT DEFAULT 'ty' CHECK (price_unit IN ('ty', 'trieu', 'trieu-m2')),
  
  -- Specifications
  area NUMERIC, -- m2
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  direction TEXT CHECK (direction IN ('dong', 'tay', 'nam', 'bac', 'dong-nam', 'dong-bac', 'tay-nam', 'tay-bac')),
  
  -- Location
  address TEXT,
  ward TEXT,
  district TEXT,
  city TEXT DEFAULT 'Hồ Chí Minh',
  
  -- Details
  description TEXT,
  features TEXT[], -- array of features
  images TEXT[], -- array of image URLs
  videos TEXT[], -- array of video URLs
  
  -- Owner Info (private)
  owner_name TEXT,
  owner_phone TEXT,
  commission_rate NUMERIC,
  notes TEXT,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 3. LANDING PAGES TABLE (Phase 2 - tạo sẵn)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.landing_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  
  template_id TEXT DEFAULT 'modern-minimal-1',
  slug TEXT UNIQUE NOT NULL,
  
  custom_title TEXT,
  custom_description TEXT,
  custom_cta_text TEXT DEFAULT 'Liên hệ ngay',
  custom_cta_phone TEXT,
  
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  lead_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 4. CRM LEADS TABLE (Phase 5 - tạo sẵn)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.crm_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  
  source TEXT DEFAULT 'other' CHECK (source IN ('facebook', 'zalo', 'tiktok', 'landing-page', 'referral', 'other')),
  source_detail TEXT,
  
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'quan-tam', 'xem-nha', 'dam-phan', 'chot', 'mat')),
  
  budget_min NUMERIC,
  budget_max NUMERIC,
  property_types_interest TEXT[],
  areas_interest TEXT[],
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 5. CRM LEAD PROPERTIES (Khách quan tâm BĐS nào)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.crm_lead_properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  interest_level INTEGER DEFAULT 3 CHECK (interest_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lead_id, property_id)
);

-- ═══════════════════════════════════════════════════════════════
-- 6. CRM ACTIVITIES (Lịch sử tương tác)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.crm_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'message', 'meeting', 'note', 'status-change')),
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 7. CRM PIPELINE STAGES (Tùy chỉnh pipeline)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.crm_pipeline_stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 8. SOCIAL POSTS (Phase 3 - tạo sẵn)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.social_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'zalo', 'tiktok')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted')),
  
  engagement JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 9. ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Public can view agent profiles (for agent pages)
CREATE POLICY "Public can view agent profiles" ON public.profiles
  FOR SELECT USING (agent_page_slug IS NOT NULL);

-- Properties: Users can CRUD their own properties
CREATE POLICY "Users can view own properties" ON public.properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = user_id);

-- Landing Pages: Users can CRUD their own, public can view published
CREATE POLICY "Users can manage own landing pages" ON public.landing_pages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view published landing pages" ON public.landing_pages
  FOR SELECT USING (is_published = true);

-- CRM Leads: Users can CRUD their own leads
CREATE POLICY "Users can manage own leads" ON public.crm_leads
  FOR ALL USING (auth.uid() = user_id);

-- CRM Lead Properties
CREATE POLICY "Users can manage own lead properties" ON public.crm_lead_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.crm_leads 
      WHERE crm_leads.id = crm_lead_properties.lead_id 
      AND crm_leads.user_id = auth.uid()
    )
  );

-- CRM Activities
CREATE POLICY "Users can manage own activities" ON public.crm_activities
  FOR ALL USING (auth.uid() = user_id);

-- CRM Pipeline Stages
CREATE POLICY "Users can manage own pipeline stages" ON public.crm_pipeline_stages
  FOR ALL USING (auth.uid() = user_id);

-- Social Posts
CREATE POLICY "Users can manage own social posts" ON public.social_posts
  FOR ALL USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 10. FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_properties ON public.properties;
CREATE TRIGGER set_updated_at_properties
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_landing_pages ON public.landing_pages;
CREATE TRIGGER set_updated_at_landing_pages
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_crm_leads ON public.crm_leads;
CREATE TRIGGER set_updated_at_crm_leads
  BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_social_posts ON public.social_posts;
CREATE TRIGGER set_updated_at_social_posts
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- 11. STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════

-- Create bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

-- ═══════════════════════════════════════════════════════════════
-- 12. SEED DEFAULT PIPELINE STAGES (Optional)
-- ═══════════════════════════════════════════════════════════════

-- This will be run per user when they first access CRM
-- Or you can create a function to initialize defaults

-- ═══════════════════════════════════════════════════════════════
-- DONE! Schema ready for PostNhà Platform
-- ═══════════════════════════════════════════════════════════════
