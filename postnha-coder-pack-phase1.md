# ═══════════════════════════════════════════════════════════════════════════════
#                           🔧 CODER PACK - PHASE 1
#                        PostNhà Platform v2.1
#                      Foundation + Kho Hàng BĐS
#                         Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
#
#  📋 HƯỚNG DẪN:
#  1. Copy TOÀN BỘ file này → Paste vào Claude Code / Cursor
#  2. Cung cấp Supabase credentials khi được hỏi
#  3. Ngồi chờ code được tạo
#
# ═══════════════════════════════════════════════════════════════════════════════

---

## 🎭 VAI TRÒ

Bạn là **THỢ XÂY** trong hệ thống Vibecode Kit v4.0.

Kiến trúc sư và Chủ nhà đã THỐNG NHẤT bản vẽ dưới đây.

### QUY TẮC TUYỆT ĐỐI:
1. **KHÔNG** thay đổi kiến trúc / layout
2. **KHÔNG** thêm features không có trong Blueprint
3. **KHÔNG** đổi tech stack
4. Gặp conflict → **BÁO CÁO**, không tự quyết định

---

## 📋 THÔNG TIN PROJECT

| Field | Value |
|-------|-------|
| Dự án | PostNhà Platform v2.1 |
| Phase | 1 - Foundation + Kho Hàng |
| Tech | React + Tailwind + Supabase |
| Output | Single JSX file + SQL schema |
| Chủ nhà | Nguyễn Huy Chiến (1nguoi.com) |

---

## 🚀 BẮT ĐẦU

Hỏi DUY NHẤT: 
1. "Bạn muốn lưu dự án ở đâu?"
2. "Cung cấp Supabase URL và Anon Key"

Sau đó → **TIẾN HÀNH NGAY**.

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 1: SUPABASE SQL SCHEMA
# ═══════════════════════════════════════════════════════════════════════════════

## 🗄️ DATABASE SCHEMA

Chạy SQL này trong Supabase SQL Editor:

```sql
-- ═══════════════════════════════════════════════════════════════
-- POSTNHÀ DATABASE SCHEMA - PHASE 1
-- Run this in Supabase SQL Editor
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
-- 5. ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

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

-- ═══════════════════════════════════════════════════════════════
-- 6. FUNCTIONS & TRIGGERS
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

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_properties
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_landing_pages
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_crm_leads
  BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- 7. STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can upload to their own folder
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 2: BLUEPRINT CHI TIẾT
# ═══════════════════════════════════════════════════════════════════════════════

## 📱 APP STRUCTURE - PHASE 1

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 1 SCREENS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  AUTH SCREENS                                                       │
│  ├── Login (Email/Password)                                        │
│  ├── Register                                                       │
│  └── Forgot Password                                                │
│                                                                     │
│  MAIN APP (Bottom Nav - 5 tabs)                                    │
│  ├── 🏠 Home (Dashboard placeholder)                               │
│  ├── 📦 Kho hàng (FULL CRUD) ← FOCUS PHASE 1                      │
│  │   ├── Property List (filter, search)                            │
│  │   ├── Property Detail                                           │
│  │   ├── Add Property (form + image upload)                        │
│  │   └── Edit Property                                             │
│  ├── ➕ Tạo mới (placeholder)                                      │
│  ├── 📱 Content (placeholder)                                      │
│  └── 👤 CRM (placeholder)                                          │
│                                                                     │
│  HEADER                                                             │
│  └── Profile menu (settings, logout)                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 DESIGN SPECS

```
COLORS:
├── Primary: #F59E0B (Amber)
├── Primary Dark: #D97706
├── Secondary: #1E3A5F (Deep Blue)
├── Success: #22C55E (Green)
├── Warning: #EF4444 (Red)
├── Background: #0F172A (Dark)
├── Card: #1E293B
├── Border: #334155
└── Text: #F8FAFC (white), #94A3B8 (muted)

TYPOGRAPHY:
├── Font: Be Vietnam Pro (Google Fonts)
├── Headings: 600-700 weight
└── Body: 400-500 weight

SPACING:
├── Container padding: 16px (mobile)
├── Card padding: 16-20px
├── Gap: 12-16px
└── Border radius: 12-16px

MOBILE FIRST:
├── Bottom nav height: 64px
├── Touch targets: min 44px
├── Safe area: env(safe-area-inset-bottom)
└── Max width: 100% mobile, 480px centered on tablet+
```

## 📦 KHO HÀNG - CHI TIẾT SCREENS

### Screen 1: Property List
```
┌─────────────────────────────────────────┐
│  📦 Kho hàng                    [+ Add] │
│  ─────────────────────────────────────  │
│  🔍 Tìm kiếm BĐS...                     │
│  ─────────────────────────────────────  │
│  [Tất cả] [Đang bán] [Đã cọc] [Đã bán] │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🖼️ [Image Carousel]             │   │
│  │ ┌─ Badge: Đang bán (green)      │   │
│  │ ─────────────────────────────── │   │
│  │ Căn hộ 2PN Vinhomes Grand Park  │   │
│  │ 📍 Quận 9, TP.HCM               │   │
│  │ 💰 2.5 tỷ • 75m² • 2 PN         │   │
│  │ ─────────────────────────────── │   │
│  │ [🔗 Tạo LP] [📱 MXH] [⋮ More]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Property Card 2]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Property Card 3]               │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
│  🏠    📦    ➕    📱    👤            │
└─────────────────────────────────────────┘
```

### Screen 2: Add/Edit Property Form
```
┌─────────────────────────────────────────┐
│  ← Thêm BĐS mới                         │
│  ─────────────────────────────────────  │
│                                         │
│  📷 HÌNH ẢNH                            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ img │ │ img │ │ img │ │  +  │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│                                         │
│  📋 THÔNG TIN CƠ BẢN                    │
│  ┌─────────────────────────────────┐   │
│  │ Tiêu đề *                       │   │
│  │ [VD: Căn hộ 2PN view sông]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────┐ ┌──────────────────┐     │
│  │ Loại BĐS │ │ Trạng thái       │     │
│  │ [Select] │ │ [Select]         │     │
│  └──────────┘ └──────────────────┘     │
│                                         │
│  💰 GIÁ & DIỆN TÍCH                     │
│  ┌──────────┐ ┌────────┐               │
│  │ Giá      │ │ Đơn vị │               │
│  │ [2.5]    │ │ [Tỷ ▼] │               │
│  └──────────┘ └────────┘               │
│                                         │
│  ┌──────────┐ ┌──────────┐             │
│  │ Diện tích│ │ Hướng    │             │
│  │ [75] m²  │ │ [Đông ▼] │             │
│  └──────────┘ └──────────┘             │
│                                         │
│  🏠 CHI TIẾT                            │
│  ┌────┐ ┌────┐ ┌────┐                  │
│  │PN  │ │ WC │ │Tầng│                  │
│  │[2] │ │[2] │ │[1] │                  │
│  └────┘ └────┘ └────┘                  │
│                                         │
│  📍 VỊ TRÍ                              │
│  ┌─────────────────────────────────┐   │
│  │ Địa chỉ                         │   │
│  │ [Số nhà, đường...]              │   │
│  └─────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────────────┐     │
│  │ Quận/Huyện│ │ Tỉnh/TP         │     │
│  │ [Select] │ │ [Hồ Chí Minh]    │     │
│  └──────────┘ └──────────────────┘     │
│                                         │
│  📝 MÔ TẢ                               │
│  ┌─────────────────────────────────┐   │
│  │ [Textarea - mô tả chi tiết]    │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ✨ TIỆN ÍCH                            │
│  [Nội thất] [Hồ bơi] [Gym] [Sân vườn] │
│  [Gara] [An ninh 24/7] [+ Thêm]       │
│                                         │
│  👤 THÔNG TIN CHỦ NHÀ (Riêng tư)       │
│  ┌─────────────────────────────────┐   │
│  │ Tên chủ nhà                     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ SĐT chủ nhà                     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Hoa hồng (%)                    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Ghi chú riêng                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [💾 Lưu BĐS]                     │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 3: Property Detail
```
┌─────────────────────────────────────────┐
│  ←                        [✏️] [🗑️]    │
│  ─────────────────────────────────────  │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [Image Gallery/Carousel]   │   │
│  │                                 │   │
│  │  ○ ○ ● ○ ○                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🟢 Đang bán                            │
│  Căn hộ 2PN Vinhomes Grand Park        │
│  📍 Quận 9, TP. Hồ Chí Minh            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  💰 2.5 tỷ    📐 75m²   🛏️ 2PN │   │
│  │  🚿 2 WC      🧭 Đông Nam       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📝 MÔ TẢ                               │
│  Căn hộ cao cấp view sông, nội thất    │
│  đầy đủ, tiện ích 5 sao...             │
│                                         │
│  ✨ TIỆN ÍCH                            │
│  • Nội thất cao cấp                    │
│  • Hồ bơi                               │
│  • Gym, Spa                             │
│  • An ninh 24/7                         │
│                                         │
│  👤 THÔNG TIN CHỦ NHÀ                   │
│  ┌─────────────────────────────────┐   │
│  │ Anh Minh                        │   │
│  │ 📞 0909.xxx.xxx                 │   │
│  │ 💰 Hoa hồng: 2%                 │   │
│  │ 📝 Chủ nhà dễ thương lượng      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│  ┌────────────┐ ┌────────────────┐     │
│  │ 🔗 Tạo LP  │ │ 📱 Tạo Content │     │
│  └────────────┘ └────────────────┘     │
└─────────────────────────────────────────┘
```

## 🔧 TECH IMPLEMENTATION

### File Structure (Single JSX)
```
postnha-v2.1.jsx
├── // Supabase Client Config
├── // Auth Context & Provider
├── // Components
│   ├── BottomNav
│   ├── Header
│   ├── PropertyCard
│   ├── PropertyForm
│   ├── PropertyDetail
│   ├── ImageUploader
│   ├── FilterTabs
│   └── SearchBar
├── // Screens
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── HomeScreen (placeholder)
│   ├── PropertiesScreen
│   ├── PropertyDetailScreen
│   ├── AddPropertyScreen
│   ├── EditPropertyScreen
│   ├── ContentScreen (placeholder)
│   └── CRMScreen (placeholder)
└── // Main App
```

### Supabase Integration
```javascript
// Initialize
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Auth
supabase.auth.signUp({ email, password, options: { data: { full_name } } })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
supabase.auth.onAuthStateChange(callback)

// Properties CRUD
supabase.from('properties').select('*').eq('user_id', userId)
supabase.from('properties').insert({ ...data, user_id: userId })
supabase.from('properties').update(data).eq('id', propertyId)
supabase.from('properties').delete().eq('id', propertyId)

// Image Upload
supabase.storage.from('property-images').upload(path, file)
supabase.storage.from('property-images').getPublicUrl(path)
```

## ✅ PHASE 1 CHECKLIST

```
□ Supabase connection
□ Auth flow (login/register/logout)
□ Auth state persistence
□ Bottom navigation (5 tabs)
□ Header with profile menu
□ Properties list view
□ Property filters (status tabs)
□ Property search
□ Property detail view
□ Add property form (all fields)
□ Edit property form
□ Delete property (with confirm)
□ Image upload to Supabase Storage
□ Multi-image support
□ Status badge colors
□ Loading states
□ Error handling
□ Empty states
□ Responsive mobile-first design
□ Vietnamese language UI
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 3: DATA REFERENCE
# ═══════════════════════════════════════════════════════════════════════════════

## 📊 ENUMS & OPTIONS

### Property Types
```javascript
const PROPERTY_TYPES = [
  { value: 'can-ho', label: 'Căn hộ', icon: '🏢' },
  { value: 'dat-nen', label: 'Đất nền', icon: '🌳' },
  { value: 'nha-pho', label: 'Nhà phố', icon: '🏠' },
  { value: 'biet-thu', label: 'Biệt thự', icon: '🏰' },
  { value: 'mat-bang', label: 'Mặt bằng', icon: '🏪' },
  { value: 'phong-tro', label: 'Phòng trọ', icon: '🚪' },
]
```

### Status
```javascript
const PROPERTY_STATUS = [
  { value: 'dang-ban', label: 'Đang bán', color: '#22C55E' },
  { value: 'da-coc', label: 'Đã cọc', color: '#F59E0B' },
  { value: 'da-ban', label: 'Đã bán', color: '#6B7280' },
  { value: 'tam-ngung', label: 'Tạm ngưng', color: '#EF4444' },
]
```

### Price Units
```javascript
const PRICE_UNITS = [
  { value: 'ty', label: 'Tỷ' },
  { value: 'trieu', label: 'Triệu' },
  { value: 'trieu-m2', label: 'Triệu/m²' },
]
```

### Directions
```javascript
const DIRECTIONS = [
  { value: 'dong', label: 'Đông' },
  { value: 'tay', label: 'Tây' },
  { value: 'nam', label: 'Nam' },
  { value: 'bac', label: 'Bắc' },
  { value: 'dong-nam', label: 'Đông Nam' },
  { value: 'dong-bac', label: 'Đông Bắc' },
  { value: 'tay-nam', label: 'Tây Nam' },
  { value: 'tay-bac', label: 'Tây Bắc' },
]
```

### Features/Amenities
```javascript
const FEATURES = [
  'Nội thất cao cấp',
  'Nội thất cơ bản',
  'Nhà trống',
  'Hồ bơi',
  'Gym',
  'Sân vườn',
  'Gara ô tô',
  'An ninh 24/7',
  'Thang máy',
  'Ban công',
  'Sân thượng',
  'Hầm để xe',
]
```

### Districts (HCM Sample)
```javascript
const DISTRICTS_HCM = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
  'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
  'Quận 11', 'Quận 12', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận',
  'Tân Bình', 'Tân Phú', 'Thủ Đức', 'Bình Tân', 'Nhà Bè',
  'Hóc Môn', 'Củ Chi', 'Cần Giờ', 'Bình Chánh',
]
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 4: HƯỚNG DẪN SETUP
# ═══════════════════════════════════════════════════════════════════════════════

## 🔧 SETUP SUPABASE

### Bước 1: Tạo Project
1. Truy cập https://supabase.com
2. Đăng nhập / Đăng ký
3. Click "New Project"
4. Điền thông tin:
   - Name: `postnha`
   - Database Password: [tạo password mạnh]
   - Region: Singapore (gần VN nhất)
5. Click "Create new project"
6. Đợi 2-3 phút để setup

### Bước 2: Lấy Credentials
1. Vào Project Settings > API
2. Copy:
   - Project URL: `https://xxxx.supabase.co`
   - anon public key: `eyJxxxx...`

### Bước 3: Chạy SQL Schema
1. Vào SQL Editor
2. Paste toàn bộ SQL ở PHẦN 1
3. Click "Run"
4. Kiểm tra Tables đã được tạo

### Bước 4: Tạo Storage Bucket
1. Vào Storage
2. Click "New bucket"
3. Name: `property-images`
4. Public bucket: ✅ ON
5. Click "Create bucket"

### Bước 5: Enable Auth
1. Vào Authentication > Providers
2. Email: ✅ Enabled
3. Confirm email: có thể tắt để test nhanh

---

## ✅ SAU KHI HOÀN THÀNH BUILD

```
✅ Đã tạo xong PostNhà v2.1
📁 File: postnha-v2.1.jsx

Để chạy:
1. Paste code vào Claude Artifact
2. Thay SUPABASE_URL và SUPABASE_ANON_KEY
3. Preview trên Claude

Hoặc deploy lên Vercel:
1. Tạo Next.js project
2. Copy code vào pages/index.js (điều chỉnh imports)
3. npm install @supabase/supabase-js
4. Add env variables
5. Deploy
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                              END OF CODER PACK
#                           PostNhà Platform v2.1
#                            Phase 1: Foundation
#                             Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
