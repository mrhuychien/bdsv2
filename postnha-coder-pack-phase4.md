# ═══════════════════════════════════════════════════════════════════════════════
#                           🔧 CODER PACK - PHASE 4
#                        PostNhà Platform v2.4
#                       Agent Profile Page
#                         Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
#
#  📋 HƯỚNG DẪN:
#  1. Hoàn thành Phase 1, 2, 3 trước
#  2. Copy TOÀN BỘ file này → Paste vào Claude Code / Cursor
#  3. Tiếp tục build trên codebase đã có
#
# ═══════════════════════════════════════════════════════════════════════════════

---

## 🎭 VAI TRÒ

Bạn là **THỢ XÂY** trong hệ thống Vibecode Kit v4.0.

### QUY TẮC TUYỆT ĐỐI:
1. **KHÔNG** thay đổi code Phase 1, 2, 3 đã hoạt động
2. **THÊM** modules mới theo Blueprint
3. **SỬ DỤNG** profiles table đã có
4. Gặp conflict → **BÁO CÁO**, không tự quyết định

---

## 📋 THÔNG TIN PHASE 4

| Field | Value |
|-------|-------|
| Dự án | PostNhà Platform v2.4 |
| Phase | 4 - Agent Profile Page |
| Depends on | Phase 1, 2, 3 |
| Output | Profile builder + Public agent pages |

---

## 🎯 MỤC TIÊU PHASE 4

```
Cho phép Sales:
1. Tạo trang cá nhân chuyên nghiệp
2. Chọn template cho trang cá nhân (3-5 mẫu)
3. Hiển thị thông tin, kinh nghiệm, khu vực hoạt động
4. Hiển thị danh sách BĐS đang bán
5. Hiển thị đánh giá (tương lai)
6. Link công khai để chia sẻ: /agent/[slug]
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 1: DATABASE (Đã có)
# ═══════════════════════════════════════════════════════════════════════════════

```sql
-- Sử dụng profiles table đã có từ Phase 1
-- Các fields cần dùng:
-- • full_name
-- • phone
-- • email
-- • avatar_url
-- • bio
-- • experience_years
-- • specialization (array)
-- • areas (array)
-- • social_links (jsonb)
-- • agent_page_slug (unique)
-- • agent_page_template

-- Properties table cho listed BĐS
-- • Lọc status = 'dang-ban'
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 2: APP STRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════

## 📱 SCREENS MỚI - PHASE 4

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 4 SCREENS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PROFILE SETTINGS (Trong app - từ Header menu)                     │
│  ├── ProfileSettingsScreen                                         │
│  │   ├── Avatar upload                                             │
│  │   ├── Basic info form                                           │
│  │   ├── Bio editor                                                │
│  │   ├── Specialization picker                                     │
│  │   ├── Areas picker                                              │
│  │   └── Social links                                              │
│  │                                                                 │
│  ├── AgentPageBuilderScreen                                        │
│  │   ├── Template selector (3-5 templates)                        │
│  │   ├── Slug editor                                              │
│  │   ├── Preview                                                   │
│  │   └── Publish/Update                                           │
│  │                                                                 │
│  └── AgentPagePreviewScreen                                        │
│      └── Preview with mock data                                   │
│                                                                     │
│  PUBLIC AGENT PAGES (Không cần login)                              │
│  └── /agent/[slug] - Trang công khai                              │
│      ├── Template: Card Style (compact)                           │
│      ├── Template: Full Page (detailed)                           │
│      ├── Template: Portfolio Style (image focus)                  │
│      ├── Template: Modern Dark                                    │
│      └── Template: Professional Light                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 SCREEN DESIGNS

### Screen 1: Profile Settings
```
┌─────────────────────────────────────────┐
│  ← Hồ sơ cá nhân                        │
│  ─────────────────────────────────────  │
│                                         │
│           ┌───────────┐                 │
│           │           │                 │
│           │  [Avatar] │                 │
│           │    📷     │                 │
│           └───────────┘                 │
│         [Thay đổi ảnh]                 │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📋 THÔNG TIN CƠ BẢN                    │
│  ┌─────────────────────────────────┐   │
│  │ Họ và tên *                     │   │
│  │ [Nguyễn Văn A]                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Số điện thoại *                 │   │
│  │ [0909 123 456]                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Email                           │   │
│  │ [nguyenvana@email.com]          │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Số năm kinh nghiệm              │   │
│  │ [5] năm                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 GIỚI THIỆU BẢN THÂN                 │
│  ┌─────────────────────────────────┐   │
│  │ Tôi là chuyên viên tư vấn BĐS  │   │
│  │ với 5 năm kinh nghiệm tại khu  │   │
│  │ vực Quận 2, Quận 9...          │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 CHUYÊN MÔN                          │
│  [✓ Căn hộ] [✓ Nhà phố] [Đất nền]     │
│  [Biệt thự] [Mặt bằng] [Phòng trọ]    │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📍 KHU VỰC HOẠT ĐỘNG                   │
│  [✓ Quận 2] [✓ Quận 9] [Thủ Đức]      │
│  [Quận 7] [Bình Thạnh] [+ Thêm]       │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🔗 MẠNG XÃ HỘI                         │
│  ┌─────────────────────────────────┐   │
│  │ 📘 Facebook                     │   │
│  │ [https://fb.com/nguyenvana]     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 💬 Zalo                         │   │
│  │ [0909123456]                    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🎵 TikTok                       │   │
│  │ [@nguyenvana_bds]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [💾 Lưu thông tin]               │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 2: Agent Page Builder
```
┌─────────────────────────────────────────┐
│  ← Trang cá nhân                        │
│  ─────────────────────────────────────  │
│                                         │
│  🎨 CHỌN TEMPLATE                       │
│                                         │
│  ┌────────────┐ ┌────────────┐         │
│  │            │ │            │         │
│  │  Card      │ │  Full      │         │
│  │  Style ✓   │ │  Page      │         │
│  │            │ │            │         │
│  └────────────┘ └────────────┘         │
│                                         │
│  ┌────────────┐ ┌────────────┐         │
│  │            │ │            │         │
│  │ Portfolio  │ │  Modern    │         │
│  │  Style     │ │  Dark      │         │
│  │            │ │            │         │
│  └────────────┘ └────────────┘         │
│                                         │
│  ┌────────────┐                        │
│  │            │                        │
│  │ Professional                        │
│  │  Light     │                        │
│  │            │                        │
│  └────────────┘                        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🔗 ĐƯỜNG DẪN TRANG CÁ NHÂN            │
│  ┌─────────────────────────────────┐   │
│  │ postnha.vn/agent/               │   │
│  │ [nguyenvana]              [✏️] │   │
│  └─────────────────────────────────┘   │
│  ⚠️ Chỉ dùng chữ thường, số, gạch ngang │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📋 HIỂN THỊ                            │
│  [✓] Hiển thị số điện thoại            │
│  [✓] Hiển thị email                    │
│  [✓] Hiển thị BĐS đang bán            │
│  [✓] Hiển thị mạng xã hội             │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌────────────┐ ┌────────────────┐     │
│  │ 👁️ Preview │ │ 🚀 Publish    │     │
│  └────────────┘ └────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 3: Success & Share
```
┌─────────────────────────────────────────┐
│                                         │
│              ✅                         │
│                                         │
│     Trang cá nhân đã được tạo!         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         [QR CODE]               │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔗 postnha.vn/agent/nguyenvana        │
│                                         │
│  ┌────────────┐ ┌────────────────┐     │
│  │ 📋 Copy    │ │ 📤 Share Zalo  │     │
│  │   Link     │ │                │     │
│  └────────────┘ └────────────────┘     │
│                                         │
│  ┌────────────┐ ┌────────────────┐     │
│  │ 📘 Share   │ │ 💾 Tải QR     │     │
│  │  Facebook  │ │                │     │
│  └────────────┘ └────────────────┘     │
│                                         │
│       [Xem trang cá nhân]              │
│                                         │
└─────────────────────────────────────────┘
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                      PHẦN 3: AGENT PAGE TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════

## 🎨 5 TEMPLATES

### Template Data Structure
```javascript
const AGENT_TEMPLATES = [
  {
    id: 'card-style',
    name: 'Card Style',
    description: 'Gọn gàng như danh thiếp, hiển thị tốt trên mobile',
    thumbnail: '/agent-templates/card.jpg',
  },
  {
    id: 'full-page',
    name: 'Full Page',
    description: 'Trang đầy đủ với bio, BĐS, và contact form',
    thumbnail: '/agent-templates/full.jpg',
  },
  {
    id: 'portfolio-style',
    name: 'Portfolio Style',
    description: 'Tập trung vào hình ảnh BĐS, phong cách gallery',
    thumbnail: '/agent-templates/portfolio.jpg',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Nền tối sang trọng, phù hợp BĐS cao cấp',
    thumbnail: '/agent-templates/dark.jpg',
  },
  {
    id: 'professional-light',
    name: 'Professional Light',
    description: 'Sáng sủa, chuyên nghiệp, dễ đọc',
    thumbnail: '/agent-templates/light.jpg',
  },
];
```

---

## 📐 TEMPLATE LAYOUTS

### Template 1: Card Style (Compact)
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      ┌───────────┐              │   │
│  │      │           │              │   │
│  │      │  [Avatar] │              │   │
│  │      │           │              │   │
│  │      └───────────┘              │   │
│  │                                 │   │
│  │      NGUYỄN VĂN A               │   │
│  │      Chuyên viên tư vấn BĐS     │   │
│  │      ⭐ 5 năm kinh nghiệm        │   │
│  │                                 │   │
│  │  ─────────────────────────────  │   │
│  │                                 │   │
│  │  📍 Quận 2, Quận 9, Thủ Đức    │   │
│  │  🏠 Căn hộ, Nhà phố            │   │
│  │                                 │   │
│  │  ─────────────────────────────  │   │
│  │                                 │   │
│  │  📞 0909 123 456                │   │
│  │  ✉️ nguyenvana@email.com        │   │
│  │                                 │   │
│  │  ─────────────────────────────  │   │
│  │                                 │   │
│  │  [📘 FB] [💬 Zalo] [🎵 TikTok] │   │
│  │                                 │   │
│  │  ─────────────────────────────  │   │
│  │                                 │   │
│  │  🏠 12 BĐS đang bán            │   │
│  │  [Xem danh sách →]             │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Powered by PostNhà                    │
│                                         │
└─────────────────────────────────────────┘
```

### Template 2: Full Page
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     [Cover Image / Gradient]    │   │
│  │                                 │   │
│  │      ┌───────────┐              │   │
│  │      │  [Avatar] │              │   │
│  │      └───────────┘              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  NGUYỄN VĂN A                          │
│  Chuyên viên tư vấn BĐS                │
│  ⭐⭐⭐⭐⭐ (50 đánh giá)                  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 GIỚI THIỆU                          │
│  Tôi là chuyên viên tư vấn BĐS với    │
│  5 năm kinh nghiệm, chuyên về căn hộ  │
│  cao cấp và nhà phố tại khu vực...    │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 CHUYÊN MÔN                          │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ Căn hộ │ │Nhà phố │ │Biệt thự│     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
│  📍 KHU VỰC                             │
│  Quận 2 • Quận 9 • Thủ Đức • Quận 7   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 BĐS ĐANG BÁN (12)                  │
│  ┌──────────┐ ┌──────────┐            │
│  │  [IMG]   │ │  [IMG]   │            │
│  │ Căn hộ  │ │ Nhà phố  │            │
│  │ 2.5 tỷ  │ │ 8.5 tỷ   │            │
│  └──────────┘ └──────────┘            │
│  [Xem tất cả →]                        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📞 LIÊN HỆ                             │
│  ┌─────────────────────────────────┐   │
│  │ Họ tên: [______________]        │   │
│  │ SĐT:    [______________]        │   │
│  │ Nội dung: [______________]      │   │
│  │                                 │   │
│  │ [Gửi yêu cầu tư vấn]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ═══════════════════════════════════   │
│  │   [📞 Gọi ngay 0909 123 456]   │   │
│  ═══════════════════════════════════   │
│                                         │
│  ─────────────────────────────────────  │
│  [📘] [💬] [🎵]  Powered by PostNhà   │
└─────────────────────────────────────────┘
```

### Template 3: Portfolio Style
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌──────┐  NGUYỄN VĂN A                │
│  │Avatar│  Chuyên viên BĐS • 5 năm     │
│  └──────┘  📍 Q2, Q9, Thủ Đức          │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 BẤT ĐỘNG SẢN NỔI BẬT               │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [LARGE HERO IMAGE]         │   │
│  │                                 │   │
│  │  Căn hộ Vinhomes          2.5 tỷ│   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────┐ ┌──────────┐            │
│  │  [IMG]   │ │  [IMG]   │            │
│  │ Nhà phố  │ │ Đất nền  │            │
│  │ 8.5 tỷ   │ │ 2.1 tỷ   │            │
│  └──────────┘ └──────────┘            │
│                                         │
│  ┌──────────┐ ┌──────────┐            │
│  │  [IMG]   │ │  [IMG]   │            │
│  │ Căn hộ  │ │ Biệt thự │            │
│  │ 3.2 tỷ   │ │ 15 tỷ    │            │
│  └──────────┘ └──────────┘            │
│                                         │
│  [Xem thêm 6 BĐS khác →]              │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ═══════════════════════════════════   │
│  │  📞 0909 123 456  •  💬 Zalo   │   │
│  ═══════════════════════════════════   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 TEMPLATE STYLES

```javascript
const AGENT_TEMPLATE_STYLES = {
  'card-style': {
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#1F2937',
    accent: '#F59E0B',
    border: '#E5E7EB',
  },
  'full-page': {
    background: '#FAFAFA',
    card: '#FFFFFF',
    text: '#111827',
    accent: '#2563EB',
    border: '#E5E7EB',
  },
  'portfolio-style': {
    background: '#FFFFFF',
    card: '#F3F4F6',
    text: '#1F2937',
    accent: '#10B981',
    border: '#D1D5DB',
  },
  'modern-dark': {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    accent: '#F59E0B',
    border: '#334155',
  },
  'professional-light': {
    background: '#FFFFFF',
    card: '#F9FAFB',
    text: '#374151',
    accent: '#4F46E5',
    border: '#E5E7EB',
  },
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 4: SUPABASE OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

```javascript
// Profile Operations

// Update profile
const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Upload avatar
const uploadAvatar = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('property-images') // reuse bucket
    .upload(fileName, file, { upsert: true });
  
  if (error) return { error };
  
  const { data: urlData } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName);
  
  // Update profile with avatar URL
  await updateProfile(userId, { avatar_url: urlData.publicUrl });
  
  return { url: urlData.publicUrl };
};

// Check slug availability
const checkSlugAvailable = async (slug, currentUserId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('agent_page_slug', slug)
    .neq('id', currentUserId)
    .single();
  
  return !data; // true if available
};

// Get public agent page
const getAgentBySlug = async (slug) => {
  const { data: agent, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('agent_page_slug', slug)
    .single();
  
  if (error || !agent) return { agent: null, properties: [] };
  
  // Get agent's properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', agent.id)
    .eq('status', 'dang-ban')
    .order('created_at', { ascending: false })
    .limit(12);
  
  return { agent, properties: properties || [] };
};

// Generate unique slug from name
const generateAgentSlug = (fullName) => {
  const base = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
};
```

---

## 📦 COMPONENTS

```javascript
// Components cần tạo cho Phase 4

// 1. ProfileSettingsScreen
const ProfileSettingsScreen = () => {
  // Avatar upload
  // Basic info form
  // Bio editor
  // Specialization multi-select
  // Areas multi-select
  // Social links form
}

// 2. AvatarUploader
const AvatarUploader = ({ currentUrl, onUpload }) => {
  // Image picker
  // Crop (optional)
  // Upload progress
}

// 3. MultiSelectChips
const MultiSelectChips = ({ options, selected, onChange, maxSelect }) => {
  // Chip buttons
  // Selected state
}

// 4. AgentPageBuilderScreen
const AgentPageBuilderScreen = () => {
  // Template selector
  // Slug editor
  // Display options
  // Preview button
  // Publish button
}

// 5. AgentTemplateSelector
const AgentTemplateSelector = ({ templates, selected, onChange }) => {
  // Template grid
  // Preview thumbnails
}

// 6. SlugEditor
const SlugEditor = ({ value, onChange, checkAvailable }) => {
  // Input with prefix
  // Availability check
  // Validation feedback
}

// 7. Public Agent Page Templates
const CardStyleTemplate = ({ agent, properties }) => {}
const FullPageTemplate = ({ agent, properties }) => {}
const PortfolioStyleTemplate = ({ agent, properties }) => {}
const ModernDarkTemplate = ({ agent, properties }) => {}
const ProfessionalLightTemplate = ({ agent, properties }) => {}

// 8. AgentPropertyCard
const AgentPropertyCard = ({ property, onClick }) => {
  // Thumbnail
  // Title, price
  // Basic info
}

// 9. ContactForm (for Full Page template)
const ContactForm = ({ agentId, agentPhone }) => {
  // Name, phone, message
  // Submit (future: save to CRM)
}
```

---

## ✅ PHASE 4 CHECKLIST

```
□ ProfileSettingsScreen
□ AvatarUploader component
□ Basic info form
□ Bio editor (textarea with character count)
□ Specialization picker (multi-select chips)
□ Areas picker (multi-select chips)
□ Social links form (FB, Zalo, TikTok)
□ Save profile function
□ AgentPageBuilderScreen
□ AgentTemplateSelector (5 templates)
□ SlugEditor with availability check
□ Display options toggles
□ Preview function
□ Publish/Update function
□ Success screen with QR code
□ Copy link function
□ Share functions
□ Public agent route (/agent/[slug])
□ 5 agent template components
□ Agent info display
□ Listed properties grid
□ Contact buttons (click-to-call, Zalo)
□ ContactForm component (Full Page)
□ Responsive mobile-first
□ Loading states
□ Error handling
□ 404 for invalid slug
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                              END OF CODER PACK
#                           PostNhà Platform v2.4
#                         Phase 4: Agent Profile Page
#                             Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
