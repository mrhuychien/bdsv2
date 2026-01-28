# ═══════════════════════════════════════════════════════════════════════════════
#                           🔧 CODER PACK - PHASE 2
#                        PostNhà Platform v2.2
#                       Landing Page Builder
#                         Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
#
#  📋 HƯỚNG DẪN:
#  1. Hoàn thành Phase 1 trước
#  2. Copy TOÀN BỘ file này → Paste vào Claude Code / Cursor
#  3. Tiếp tục build trên codebase Phase 1
#
# ═══════════════════════════════════════════════════════════════════════════════

---

## 🎭 VAI TRÒ

Bạn là **THỢ XÂY** trong hệ thống Vibecode Kit v4.0.

### QUY TẮC TUYỆT ĐỐI:
1. **KHÔNG** thay đổi code Phase 1 đã hoạt động
2. **THÊM** modules mới theo Blueprint
3. **KHÔNG** đổi tech stack
4. Gặp conflict → **BÁO CÁO**, không tự quyết định

---

## 📋 THÔNG TIN PHASE 2

| Field | Value |
|-------|-------|
| Dự án | PostNhà Platform v2.2 |
| Phase | 2 - Landing Page Builder |
| Depends on | Phase 1 (Kho hàng) |
| Output | Thêm vào file JSX hiện có |

---

## 🎯 MỤC TIÊU PHASE 2

```
Cho phép Sales:
1. Chọn BĐS từ kho hàng
2. Chọn template landing page (10+ mẫu)
3. Tùy chỉnh nội dung (optional)
4. Publish và lấy link để gửi khách
5. Xem analytics (view count)
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 1: DATABASE (Đã có từ Phase 1)
# ═══════════════════════════════════════════════════════════════════════════════

```sql
-- Table landing_pages đã tạo trong Phase 1
-- Chỉ cần thêm seed data cho templates

-- LANDING TEMPLATES (Reference data - không cần table riêng)
-- Templates được hardcode trong frontend
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 2: APP STRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════

## 📱 SCREENS MỚI - PHASE 2

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 2 NEW SCREENS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  LANDING PAGE BUILDER (trong app)                                  │
│  ├── LandingPagesListScreen (Danh sách LP đã tạo)                 │
│  ├── CreateLandingPageScreen                                       │
│  │   ├── Step 1: Chọn BĐS từ kho                                  │
│  │   ├── Step 2: Chọn Template                                    │
│  │   ├── Step 3: Tùy chỉnh (optional)                             │
│  │   └── Step 4: Preview & Publish                                │
│  └── LandingPageDetailScreen (xem stats, edit, delete)            │
│                                                                     │
│  PUBLIC LANDING PAGES (không cần login)                            │
│  └── /p/[slug] - Landing page công khai                           │
│      ├── Template: Modern Minimal (2 variants)                    │
│      ├── Template: Luxury Gold (2 variants)                       │
│      ├── Template: Compact (2 variants)                           │
│      ├── Template: Video Hero (2 variants)                        │
│      └── Template: Gallery Focus (2 variants)                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 SCREEN DESIGNS

### Screen 1: Landing Pages List
```
┌─────────────────────────────────────────┐
│  ← Kho hàng          Landing Pages      │
│  ─────────────────────────────────────  │
│  📄 Danh sách Landing Page    [+ Tạo]  │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🖼️ [Thumbnail]                  │   │
│  │ Căn hộ 2PN Vinhomes             │   │
│  │ Template: Modern Minimal        │   │
│  │ 👁️ 156 views • 📅 2 ngày trước  │   │
│  │ ─────────────────────────────── │   │
│  │ [🔗 Copy Link] [📤 Share] [⋮]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Landing Page Card 2]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │     Chưa có landing page        │   │
│  │     [+ Tạo Landing Page đầu tiên]│  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 2: Create Landing Page - Step 1 (Chọn BĐS)
```
┌─────────────────────────────────────────┐
│  ← Tạo Landing Page                     │
│  ─────────────────────────────────────  │
│  Step 1/4: Chọn BĐS                    │
│  ●───○───○───○                          │
│  ─────────────────────────────────────  │
│                                         │
│  🔍 Tìm trong kho hàng...              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ○ 🖼️ Căn hộ 2PN Vinhomes       │   │
│  │   Q9 • 75m² • 2.5 tỷ            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ● 🖼️ Nhà phố Thảo Điền  ✓      │   │
│  │   Q2 • 120m² • 8.5 tỷ           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ○ 🖼️ Đất nền Bình Chánh        │   │
│  │   100m² • 2.1 tỷ                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│            [Tiếp tục →]                │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 3: Create Landing Page - Step 2 (Chọn Template)
```
┌─────────────────────────────────────────┐
│  ← Tạo Landing Page                     │
│  ─────────────────────────────────────  │
│  Step 2/4: Chọn Template               │
│  ●───●───○───○                          │
│  ─────────────────────────────────────  │
│                                         │
│  STYLE:                                 │
│  [Modern] [Luxury] [Compact] [Video]   │
│  [Gallery]                              │
│  ─────────────────────────────────────  │
│                                         │
│  ┌────────────┐ ┌────────────┐         │
│  │            │ │            │         │
│  │  Modern 1  │ │  Modern 2  │         │
│  │   ✓        │ │            │         │
│  │            │ │            │         │
│  └────────────┘ └────────────┘         │
│                                         │
│  ┌────────────┐ ┌────────────┐         │
│  │            │ │            │         │
│  │  Luxury 1  │ │  Luxury 2  │         │
│  │            │ │            │         │
│  │            │ │            │         │
│  └────────────┘ └────────────┘         │
│                                         │
│  ─────────────────────────────────────  │
│     [← Quay lại]    [Tiếp tục →]       │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 4: Create Landing Page - Step 3 (Tùy chỉnh)
```
┌─────────────────────────────────────────┐
│  ← Tạo Landing Page                     │
│  ─────────────────────────────────────  │
│  Step 3/4: Tùy chỉnh (Không bắt buộc) │
│  ●───●───●───○                          │
│  ─────────────────────────────────────  │
│                                         │
│  📝 TIÊU ĐỀ TÙY CHỈNH                   │
│  ┌─────────────────────────────────┐   │
│  │ Căn hộ view sông tuyệt đẹp      │   │
│  │ (Để trống = dùng tiêu đề BĐS)   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📋 MÔ TẢ TÙY CHỈNH                     │
│  ┌─────────────────────────────────┐   │
│  │ Cơ hội sở hữu căn hộ cao cấp...│   │
│  │                                 │   │
│  │ (Để trống = dùng mô tả BĐS)    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📞 NÚT LIÊN HỆ                         │
│  ┌─────────────────────────────────┐   │
│  │ Text: Liên hệ ngay              │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ SĐT: 0909 123 456               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│     [← Quay lại]    [Tiếp tục →]       │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 5: Create Landing Page - Step 4 (Preview & Publish)
```
┌─────────────────────────────────────────┐
│  ← Tạo Landing Page                     │
│  ─────────────────────────────────────  │
│  Step 4/4: Preview & Publish           │
│  ●───●───●───●                          │
│  ─────────────────────────────────────  │
│                                         │
│  📱 PREVIEW                             │
│  ┌─────────────────────────────────┐   │
│  │ ┌─────────────────────────────┐ │   │
│  │ │                             │ │   │
│  │ │    [Landing Page Preview]   │ │   │
│  │ │                             │ │   │
│  │ │                             │ │   │
│  │ │                             │ │   │
│  │ └─────────────────────────────┘ │   │
│  │   [📱 Mobile]  [💻 Desktop]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔗 ĐƯỜNG DẪN                           │
│  ┌─────────────────────────────────┐   │
│  │ postnha.vn/p/can-ho-vinhomes-q9│   │
│  │                        [✏️ Edit]│   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│     [← Quay lại]    [🚀 Publish]       │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 6: Success & Share
```
┌─────────────────────────────────────────┐
│                                         │
│              ✅                         │
│                                         │
│     Landing Page đã được tạo!          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         [QR CODE]               │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔗 postnha.vn/p/can-ho-vinhomes-q9    │
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
│       [Xem Landing Page]               │
│       [← Về danh sách]                 │
│                                         │
└─────────────────────────────────────────┘
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                      PHẦN 3: LANDING PAGE TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════

## 🎨 10+ TEMPLATES

### Template Data Structure
```javascript
const LANDING_TEMPLATES = [
  // MODERN MINIMAL
  {
    id: 'modern-minimal-1',
    name: 'Modern Clean',
    style: 'modern-minimal',
    thumbnail: '/templates/modern-1.jpg',
    description: 'Thiết kế tối giản, tập trung vào hình ảnh',
    isPremium: false,
  },
  {
    id: 'modern-minimal-2',
    name: 'Modern Card',
    style: 'modern-minimal',
    thumbnail: '/templates/modern-2.jpg',
    description: 'Bố cục card, dễ đọc trên mobile',
    isPremium: false,
  },
  
  // LUXURY GOLD
  {
    id: 'luxury-gold-1',
    name: 'Luxury Dark',
    style: 'luxury-gold',
    thumbnail: '/templates/luxury-1.jpg',
    description: 'Nền tối, điểm nhấn vàng sang trọng',
    isPremium: false,
  },
  {
    id: 'luxury-gold-2',
    name: 'Luxury Marble',
    style: 'luxury-gold',
    thumbnail: '/templates/luxury-2.jpg',
    description: 'Texture đá marble, cảm giác cao cấp',
    isPremium: true,
  },
  
  // COMPACT (Load nhanh)
  {
    id: 'compact-1',
    name: 'Compact Essential',
    style: 'compact',
    thumbnail: '/templates/compact-1.jpg',
    description: 'Tối ưu tốc độ, chỉ thông tin thiết yếu',
    isPremium: false,
  },
  {
    id: 'compact-2',
    name: 'Compact Accordion',
    style: 'compact',
    thumbnail: '/templates/compact-2.jpg',
    description: 'Các section thu gọn, mở rộng khi cần',
    isPremium: false,
  },
  
  // VIDEO HERO
  {
    id: 'video-hero-1',
    name: 'Video Fullscreen',
    style: 'video-hero',
    thumbnail: '/templates/video-1.jpg',
    description: 'Video background toàn màn hình',
    isPremium: true,
  },
  {
    id: 'video-hero-2',
    name: 'Video Split',
    style: 'video-hero',
    thumbnail: '/templates/video-2.jpg',
    description: 'Video bên trái, thông tin bên phải',
    isPremium: true,
  },
  
  // GALLERY FOCUS
  {
    id: 'gallery-focus-1',
    name: 'Gallery Masonry',
    style: 'gallery-focus',
    thumbnail: '/templates/gallery-1.jpg',
    description: 'Lưới hình ảnh kiểu Pinterest',
    isPremium: false,
  },
  {
    id: 'gallery-focus-2',
    name: 'Gallery Carousel',
    style: 'gallery-focus',
    thumbnail: '/templates/gallery-2.jpg',
    description: 'Carousel lớn với thumbnails',
    isPremium: false,
  },
];
```

---

## 📐 TEMPLATE LAYOUT SPECS

### Template: Modern Minimal 1
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [HERO IMAGE - Full width]  │   │
│  │                                 │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │ 🏷️ Căn hộ • Đang bán    │   │   │
│  │  └─────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💰 2.5 TỶ                              │
│  Căn hộ 2PN Vinhomes Grand Park        │
│  📍 Quận 9, TP. Hồ Chí Minh            │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │75m² │ │ 2PN │ │ 2WC │ │Đông │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📷 HÌNH ẢNH                            │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │    │ │    │ │    │ │    │          │
│  └────┘ └────┘ └────┘ └────┘          │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 MÔ TẢ                               │
│  Lorem ipsum dolor sit amet...         │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ✨ TIỆN ÍCH                            │
│  ✓ Nội thất cao cấp                    │
│  ✓ Hồ bơi, Gym                         │
│  ✓ An ninh 24/7                        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  👤 LIÊN HỆ                             │
│  ┌─────────────────────────────────┐   │
│  │  [Avatar] Nguyễn Văn A          │   │
│  │  Chuyên viên tư vấn BĐS         │   │
│  │  ⭐⭐⭐⭐⭐ (50 đánh giá)          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ═══════════════════════════════════   │
│  │      [📞 LIÊN HỆ NGAY]          │   │
│  ═══════════════════════════════════   │
│                                         │
│  ─────────────────────────────────────  │
│  Powered by PostNhà                    │
└─────────────────────────────────────────┘
```

### Template: Luxury Gold 1
```
┌─────────────────────────────────────────┐
│ ████████████████████████████████████████│ <- Dark bg
│ │                                     │ │
│ │  ┌─────────────────────────────┐   │ │
│ │  │                             │   │ │
│ │  │    [HERO IMAGE]             │   │ │
│ │  │     Gold border             │   │ │
│ │  └─────────────────────────────┘   │ │
│ │                                     │ │
│ │  ════════════════════════════════  │ │
│ │           ✦ ĐỘC QUYỀN ✦            │ │  <- Gold text
│ │  ════════════════════════════════  │ │
│ │                                     │ │
│ │  💰 2.5 TỶ                          │ │  <- Gold accent
│ │  Căn hộ 2PN Vinhomes Grand Park    │ │  <- White text
│ │                                     │ │
│ │  ┌──────────────────────────────┐  │ │
│ │  │  75m²  │  2PN  │  2WC  │ Đông│  │ │  <- Gold borders
│ │  └──────────────────────────────┘  │ │
│ │                                     │ │
│ │  📷 GALLERY                         │ │
│ │  [Elegant carousel with gold frame]│ │
│ │                                     │ │
│ │  ✦ TIỆN ÍCH CAO CẤP                │ │
│ │  • Nội thất nhập khẩu              │ │
│ │  • View sông thoáng mát            │ │
│ │                                     │ │
│ │  ┌──────────────────────────────┐  │ │
│ │  │    [📞 LIÊN HỆ TƯ VẤN]      │  │ │  <- Gold button
│ │  └──────────────────────────────┘  │ │
│ │                                     │ │
│ ████████████████████████████████████████│
└─────────────────────────────────────────┘
```

### Template: Compact 1
```
┌─────────────────────────────────────────┐
│  [IMG] Căn hộ 2PN            💰 2.5 TỶ │
│  📍 Quận 9 • 75m² • 2PN • Đông Nam     │
│  ─────────────────────────────────────  │
│  ✓ Nội thất  ✓ Hồ bơi  ✓ An ninh     │
│  ─────────────────────────────────────  │
│  📷 Xem 8 hình ảnh →                   │
│  ─────────────────────────────────────  │
│  📝 Căn hộ cao cấp view sông, full... │
│  [Xem thêm]                            │
│  ═══════════════════════════════════   │
│  │      [📞 0909 123 456]          │   │
│  ═══════════════════════════════════   │
└─────────────────────────────────────────┘
```

---

## 🎨 TEMPLATE STYLES

```javascript
const TEMPLATE_STYLES = {
  'modern-minimal': {
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#F59E0B',
    card: '#F9FAFB',
    border: '#E5E7EB',
    font: 'Be Vietnam Pro',
  },
  'luxury-gold': {
    background: '#0F0F0F',
    text: '#FFFFFF',
    accent: '#D4AF37',
    card: '#1A1A1A',
    border: '#D4AF37',
    font: 'Playfair Display, serif',
  },
  'compact': {
    background: '#FFFFFF',
    text: '#374151',
    accent: '#2563EB',
    card: '#F3F4F6',
    border: '#D1D5DB',
    font: 'Inter',
  },
  'video-hero': {
    background: '#000000',
    text: '#FFFFFF',
    accent: '#EF4444',
    overlay: 'rgba(0,0,0,0.5)',
    font: 'Montserrat',
  },
  'gallery-focus': {
    background: '#FAFAFA',
    text: '#111827',
    accent: '#10B981',
    card: '#FFFFFF',
    border: '#E5E7EB',
    font: 'Poppins',
  },
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 4: COMPONENT SPECS
# ═══════════════════════════════════════════════════════════════════════════════

## 📦 NEW COMPONENTS

```javascript
// Components cần tạo cho Phase 2

// 1. LandingPageBuilder - Multi-step wizard
const LandingPageBuilder = () => {
  // State: step (1-4), selectedProperty, selectedTemplate, customizations
  // Step 1: PropertySelector
  // Step 2: TemplateSelector
  // Step 3: CustomizationForm
  // Step 4: PreviewAndPublish
}

// 2. PropertySelector - Chọn BĐS từ kho
const PropertySelector = ({ properties, selected, onSelect }) => {
  // Search, filter, radio select
}

// 3. TemplateSelector - Grid templates với filter theo style
const TemplateSelector = ({ templates, selected, onSelect }) => {
  // Style tabs, template grid, preview on tap
}

// 4. TemplatePreview - Preview template với data
const TemplatePreview = ({ template, property, customizations }) => {
  // Render template component với data
}

// 5. LandingPageCard - Card trong list
const LandingPageCard = ({ landingPage, onCopyLink, onShare, onDelete }) => {
  // Thumbnail, title, stats, actions
}

// 6. ShareModal - Modal share với QR code
const ShareModal = ({ url, onClose }) => {
  // QR code, copy link, share buttons
}

// 7. Public Landing Page Templates
const ModernMinimal1Template = ({ property, customizations, agent }) => {}
const ModernMinimal2Template = ({ property, customizations, agent }) => {}
const LuxuryGold1Template = ({ property, customizations, agent }) => {}
const LuxuryGold2Template = ({ property, customizations, agent }) => {}
const Compact1Template = ({ property, customizations, agent }) => {}
const Compact2Template = ({ property, customizations, agent }) => {}
const VideoHero1Template = ({ property, customizations, agent }) => {}
const VideoHero2Template = ({ property, customizations, agent }) => {}
const GalleryFocus1Template = ({ property, customizations, agent }) => {}
const GalleryFocus2Template = ({ property, customizations, agent }) => {}
```

---

## 🔧 SUPABASE OPERATIONS

```javascript
// Landing Pages CRUD

// Create
const createLandingPage = async (data) => {
  const slug = generateSlug(data.property.title);
  const { data: lp, error } = await supabase
    .from('landing_pages')
    .insert({
      user_id: user.id,
      property_id: data.propertyId,
      template_id: data.templateId,
      slug: slug,
      custom_title: data.customTitle,
      custom_description: data.customDescription,
      custom_cta_text: data.ctaText,
      custom_cta_phone: data.ctaPhone,
      is_published: true,
    })
    .select()
    .single();
  return { lp, error };
};

// Read list
const getLandingPages = async (userId) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      property:properties(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Read single (public)
const getLandingPageBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      property:properties(*),
      agent:profiles(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  // Increment view count
  if (data) {
    await supabase
      .from('landing_pages')
      .update({ view_count: data.view_count + 1 })
      .eq('id', data.id);
  }
  
  return { data, error };
};

// Update
const updateLandingPage = async (id, updates) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Delete
const deleteLandingPage = async (id) => {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id);
  return { error };
};

// Generate unique slug
const generateSlug = (title) => {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
};
```

---

## ✅ PHASE 2 CHECKLIST

```
□ LandingPagesListScreen
□ CreateLandingPageScreen (4 steps)
□ PropertySelector component
□ TemplateSelector component (10+ templates)
□ Template style filters
□ CustomizationForm
□ TemplatePreview (mobile/desktop toggle)
□ Slug generator (Vietnamese friendly)
□ Slug editor
□ Publish function
□ Success screen with QR code
□ Copy link function
□ Share to Zalo/Facebook (web share API)
□ LandingPageCard component
□ View stats (view_count)
□ Edit landing page
□ Delete landing page (with confirm)
□ Public landing page route (/p/[slug])
□ 10 template components
□ Template responsive (mobile first)
□ CTA sticky footer on templates
□ Click-to-call on CTA
□ Loading states
□ Error handling
□ Empty states
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                              END OF CODER PACK
#                           PostNhà Platform v2.2
#                          Phase 2: Landing Page Builder
#                             Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
