# ═══════════════════════════════════════════════════════════════════════════════
#                           🔧 CODER PACK - PHASE 3
#                        PostNhà Platform v2.3
#                      Social Content Manager
#                         Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
#
#  📋 HƯỚNG DẪN:
#  1. Hoàn thành Phase 1 & 2 trước
#  2. Copy TOÀN BỘ file này → Paste vào Claude Code / Cursor
#  3. Tiếp tục build trên codebase đã có
#
# ═══════════════════════════════════════════════════════════════════════════════

---

## 🎭 VAI TRÒ

Bạn là **THỢ XÂY** trong hệ thống Vibecode Kit v4.0.

### QUY TẮC TUYỆT ĐỐI:
1. **KHÔNG** thay đổi code Phase 1 & 2 đã hoạt động
2. **THÊM** modules mới theo Blueprint
3. **SỬ DỤNG** Anthropic API trong Artifact cho AI generation
4. Gặp conflict → **BÁO CÁO**, không tự quyết định

---

## 📋 THÔNG TIN PHASE 3

| Field | Value |
|-------|-------|
| Dự án | PostNhà Platform v2.3 |
| Phase | 3 - Social Content Manager |
| Depends on | Phase 1 & 2 |
| AI | Anthropic API (trong Artifact) |

---

## 🎯 MỤC TIÊU PHASE 3

```
Cho phép Sales:
1. Chọn BĐS từ kho (hoặc nhập thủ công)
2. Chọn nền tảng (Facebook, Zalo, TikTok)
3. Chọn loại content (Bài đăng, Story, Script TikTok)
4. AI tự động generate content phù hợp
5. Chỉnh sửa, copy, lưu draft
6. Lên lịch đăng bài (local reminder)
7. Xem lịch sử content đã tạo
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 1: APP STRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════

## 📱 SCREENS MỚI - PHASE 3

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 3 SCREENS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SOCIAL CONTENT TAB (Bottom Nav - Tab 4)                           │
│  ├── ContentHomeScreen                                             │
│  │   ├── Quick Actions (Tạo nhanh cho FB/Zalo/TikTok)            │
│  │   ├── Recent Posts (drafts & generated)                        │
│  │   └── Scheduled Posts                                          │
│  │                                                                 │
│  ├── CreateContentScreen                                          │
│  │   ├── Platform Selector                                        │
│  │   ├── Content Type Selector                                    │
│  │   ├── Property Selector (optional)                             │
│  │   ├── Manual Input (if no property)                            │
│  │   ├── AI Generate Button                                       │
│  │   ├── Generated Content Editor                                 │
│  │   └── Actions: Copy / Save Draft / Schedule                   │
│  │                                                                 │
│  ├── ContentHistoryScreen                                         │
│  │   ├── Filter by platform                                       │
│  │   ├── Filter by status (draft/scheduled/posted)               │
│  │   └── Content cards with actions                              │
│  │                                                                 │
│  └── ScheduledPostsScreen                                         │
│      ├── Calendar view (optional)                                 │
│      └── List view with dates                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 SCREEN DESIGNS

### Screen 1: Content Home
```
┌─────────────────────────────────────────┐
│  📱 Social Content                      │
│  ─────────────────────────────────────  │
│                                         │
│  ⚡ TẠO NHANH                           │
│  ┌──────────┐┌──────────┐┌──────────┐  │
│  │    📘    ││    💬    ││    🎵    │  │
│  │ Facebook ││   Zalo   ││  TikTok  │  │
│  └──────────┘└──────────┘└──────────┘  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 DRAFTS GẦN ĐÂY                      │
│  ┌─────────────────────────────────┐   │
│  │ 📘 Bài đăng căn hộ Vinhomes     │   │
│  │ "🏠 CĂN HỘ CAO CẤP - Cơ hội..." │   │
│  │ 📅 Lưu 2 giờ trước              │   │
│  │ [Chỉnh sửa] [Copy] [Xóa]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📅 ĐÃ LÊN LỊCH (2)                    │
│  ┌─────────────────────────────────┐   │
│  │ 🎵 Script TikTok - Nhà phố Q7   │   │
│  │ 📅 Hôm nay, 18:00               │   │
│  │ [Xem] [Hủy lịch]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│       [📋 Xem tất cả lịch sử]          │
│                                         │
└─────────────────────────────────────────┘
│  🏠    📦    ➕    📱    👤            │
└─────────────────────────────────────────┘
```

### Screen 2: Create Content
```
┌─────────────────────────────────────────┐
│  ← Tạo Content                          │
│  ─────────────────────────────────────  │
│                                         │
│  📱 NỀN TẢNG                            │
│  ┌──────────┐┌──────────┐┌──────────┐  │
│  │ ● 📘    ││ ○ 💬    ││ ○ 🎵    │  │
│  │ Facebook ││   Zalo   ││  TikTok  │  │
│  └──────────┘└──────────┘└──────────┘  │
│                                         │
│  📝 LOẠI CONTENT                        │
│  [Bài đăng] [Story] [Carousel]         │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 CHỌN BĐS (không bắt buộc)          │
│  ┌─────────────────────────────────┐   │
│  │ [▼ Chọn từ kho hàng...]         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─── HOẶC NHẬP THỦ CÔNG ───            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Loại BĐS: [Căn hộ ▼]            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Vị trí: Quận 9, TP.HCM          │   │
│  └─────────────────────────────────┘   │
│  ┌──────────┐ ┌────────────────────┐   │
│  │ Giá: 2.5 │ │ Đơn vị: [Tỷ ▼]    │   │
│  └──────────┘ └────────────────────┘   │
│  ┌──────────┐ ┌──────────┐             │
│  │ DT: 75m² │ │ PN: 2    │             │
│  └──────────┘ └──────────┘             │
│  ┌─────────────────────────────────┐   │
│  │ Điểm nổi bật (mỗi dòng 1 điểm) │   │
│  │ View sông thoáng mát            │   │
│  │ Nội thất cao cấp                │   │
│  │ Gần Metro                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [✨ Tạo Content bằng AI]         │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 3: Generated Content
```
┌─────────────────────────────────────────┐
│  ← Tạo Content                          │
│  ─────────────────────────────────────  │
│                                         │
│  📘 Facebook • Bài đăng                 │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏠 𝗖Ă𝗡 𝗛Ộ 𝗖𝗔𝗢 𝗖Ấ𝗣 - Cơ hội    │   │
│  │ vàng cho gia đình trẻ!          │   │
│  │                                 │   │
│  │ 📍 Vị trí: Quận 9, TP.HCM      │   │
│  │ 💰 Giá chỉ từ: 2.5 tỷ          │   │
│  │ 📐 Diện tích: 75m²             │   │
│  │ 🛏️ 2 phòng ngủ                  │   │
│  │                                 │   │
│  │ ✨ ĐIỂM NỔI BẬT:                │   │
│  │ • View sông thoáng mát          │   │
│  │ • Nội thất cao cấp              │   │
│  │ • Gần Metro, tiện di chuyển     │   │
│  │                                 │   │
│  │ 🔥 Ưu đãi đặc biệt tháng này!  │   │
│  │                                 │   │
│  │ 📞 Liên hệ ngay: 0909.xxx.xxx  │   │
│  │                                 │   │
│  │ #CanHo #BatDongSan #Quan9      │   │
│  │                          [✏️]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 🔄  │ │ 📋  │ │ 💾  │ │ 📅  │  │
│  │Tạo  │ │Copy │ │Save │ │Lịch │  │
│  │ lại │ │     │ │Draft│ │     │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 4: Schedule Modal
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         📅 Lên lịch đăng        │   │
│  │  ───────────────────────────── │   │
│  │                                 │   │
│  │  Ngày:                          │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │ 28/01/2025          📅 │   │   │
│  │  └─────────────────────────┘   │   │
│  │                                 │   │
│  │  Giờ:                           │   │
│  │  ┌───────┐ : ┌───────┐         │   │
│  │  │  18   │   │  00   │         │   │
│  │  └───────┘   └───────┘         │   │
│  │                                 │   │
│  │  💡 Khung giờ vàng:            │   │
│  │  • Facebook: 11h-13h, 19h-21h  │   │
│  │  • TikTok: 12h, 19h-22h        │   │
│  │                                 │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │    [✓ Đặt nhắc nhở]     │   │   │
│  │  └─────────────────────────┘   │   │
│  │                                 │   │
│  │  [Hủy]          [Xác nhận]     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 2: AI CONTENT GENERATION
# ═══════════════════════════════════════════════════════════════════════════════

## 🤖 ANTHROPIC API INTEGRATION

```javascript
// Sử dụng Anthropic API trong Artifact
// API endpoint: https://api.anthropic.com/v1/messages

const generateContent = async (platform, contentType, propertyData) => {
  const systemPrompt = getSystemPrompt(platform, contentType);
  const userPrompt = buildUserPrompt(propertyData);
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt }
      ],
    })
  });

  const data = await response.json();
  return data.content[0].text;
};
```

## 📝 SYSTEM PROMPTS

### Facebook Post
```javascript
const FACEBOOK_POST_PROMPT = `
Bạn là chuyên gia viết content bất động sản cho Facebook tại Việt Nam.

QUY TẮC:
1. Sử dụng emoji phù hợp, không quá nhiều
2. Viết bằng tiếng Việt tự nhiên, dễ đọc
3. Format với bold text (𝗧𝗲𝘅𝘁) cho tiêu đề
4. Độ dài: 150-300 từ
5. Có CTA rõ ràng cuối bài
6. Thêm hashtags phù hợp (5-10 tags)

CẤU TRÚC:
1. Hook mạnh (câu đầu gây chú ý)
2. Thông tin chính (giá, diện tích, vị trí)
3. Điểm nổi bật (3-5 bullets)
4. Ưu đãi/Urgency (nếu có)
5. CTA + SĐT
6. Hashtags

TONE: Chuyên nghiệp nhưng thân thiện, tạo cảm giác tin cậy.
`;
```

### Zalo Message
```javascript
const ZALO_MESSAGE_PROMPT = `
Bạn là môi giới BĐS chuyên nghiệp viết tin nhắn Zalo cho khách hàng tiềm năng.

QUY TẮC:
1. Ngắn gọn, thân thiện như chat với bạn
2. Sử dụng emoji vừa phải
3. Không formal quá
4. Độ dài: 50-100 từ
5. Kết thúc bằng câu hỏi mở để tạo tương tác

CẤU TRÚC:
1. Chào hỏi thân thiện
2. Giới thiệu ngắn BĐS
3. 2-3 điểm nổi bật
4. Câu hỏi/CTA nhẹ nhàng

TONE: Như nhắn tin cho người quen, không quá sale.
`;
```

### TikTok Script
```javascript
const TIKTOK_SCRIPT_PROMPT = `
Bạn là creator BĐS trên TikTok Việt Nam.

QUY TẮC:
1. Hook 3 giây đầu cực mạnh
2. Ngôn ngữ Gen Z, trending
3. Có nhịp điệu, dễ quay theo
4. Độ dài script: 30-60 giây
5. Gợi ý nhạc trending
6. Gợi ý góc quay

CẤU TRÚC:
[HOOK - 3s]
Câu gây sốc/tò mò

[NỘI DUNG - 20-40s]
- Cảnh 1: ...
- Cảnh 2: ...
- Cảnh 3: ...

[CTA - 5s]
Kêu gọi tương tác

[GỢI Ý]
🎵 Nhạc: ...
📸 Góc quay: ...
#hashtags

TONE: Năng động, vui vẻ, authentic.
`;
```

## 🔧 BUILD USER PROMPT

```javascript
const buildUserPrompt = (data) => {
  return `
Tạo content cho BĐS với thông tin sau:

LOẠI BĐS: ${data.propertyType}
VỊ TRÍ: ${data.location}
GIÁ: ${data.price} ${data.priceUnit}
DIỆN TÍCH: ${data.area}m²
SỐ PHÒNG NGỦ: ${data.bedrooms}
HƯỚNG: ${data.direction || 'Không xác định'}

ĐIỂM NỔI BẬT:
${data.highlights?.join('\n') || 'Không có'}

MÔ TẢ THÊM:
${data.description || 'Không có'}

SĐT LIÊN HỆ: ${data.phone || '0909.xxx.xxx'}

Hãy tạo content hấp dẫn, phù hợp với nền tảng.
`;
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 3: DATA & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

## 📊 CONTENT TYPES

```javascript
const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
  { id: 'zalo', name: 'Zalo', icon: '💬', color: '#0068FF' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
];

const CONTENT_TYPES = {
  facebook: [
    { id: 'post', name: 'Bài đăng', icon: '📝' },
    { id: 'story', name: 'Story', icon: '📱' },
    { id: 'carousel', name: 'Carousel', icon: '🎠' },
  ],
  zalo: [
    { id: 'message', name: 'Tin nhắn', icon: '💬' },
    { id: 'post', name: 'Bài đăng', icon: '📝' },
  ],
  tiktok: [
    { id: 'script', name: 'Script Video', icon: '🎬' },
    { id: 'caption', name: 'Caption', icon: '📝' },
  ],
};

const GOLDEN_HOURS = {
  facebook: ['11:00', '12:00', '13:00', '19:00', '20:00', '21:00'],
  zalo: ['08:00', '12:00', '18:00', '21:00'],
  tiktok: ['12:00', '19:00', '20:00', '21:00', '22:00'],
};
```

---

## 🔧 SUPABASE OPERATIONS

```javascript
// Social Posts CRUD

// Create draft
const saveDraft = async (postData) => {
  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      user_id: user.id,
      property_id: postData.propertyId,
      platform: postData.platform,
      content: postData.content,
      media_urls: postData.mediaUrls,
      status: 'draft',
    })
    .select()
    .single();
  return { data, error };
};

// Schedule post
const schedulePost = async (postId, scheduledAt) => {
  const { data, error } = await supabase
    .from('social_posts')
    .update({
      scheduled_at: scheduledAt,
      status: 'scheduled',
    })
    .eq('id', postId)
    .select()
    .single();
  return { data, error };
};

// Get posts by status
const getPostsByStatus = async (userId, status) => {
  const { data, error } = await supabase
    .from('social_posts')
    .select(`
      *,
      property:properties(title, images)
    `)
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Get scheduled posts
const getScheduledPosts = async (userId) => {
  const { data, error } = await supabase
    .from('social_posts')
    .select(`
      *,
      property:properties(title, images)
    `)
    .eq('user_id', userId)
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true });
  return { data, error };
};

// Mark as posted
const markAsPosted = async (postId) => {
  const { data, error } = await supabase
    .from('social_posts')
    .update({
      posted_at: new Date().toISOString(),
      status: 'posted',
    })
    .eq('id', postId)
    .select()
    .single();
  return { data, error };
};

// Delete post
const deletePost = async (postId) => {
  const { error } = await supabase
    .from('social_posts')
    .delete()
    .eq('id', postId);
  return { error };
};
```

---

## 📦 COMPONENTS

```javascript
// Components cần tạo cho Phase 3

// 1. ContentHomeScreen
const ContentHomeScreen = () => {
  // Quick action buttons
  // Recent drafts
  // Scheduled posts
}

// 2. CreateContentScreen
const CreateContentScreen = () => {
  // Platform selector
  // Content type selector
  // Property selector or manual input
  // AI generate button
  // Content editor
  // Action buttons
}

// 3. PlatformSelector
const PlatformSelector = ({ selected, onChange }) => {
  // 3 platform buttons with icons
}

// 4. ContentTypeSelector
const ContentTypeSelector = ({ platform, selected, onChange }) => {
  // Dynamic based on platform
}

// 5. ContentEditor
const ContentEditor = ({ content, onChange, platform }) => {
  // Textarea with character count
  // Preview formatting
}

// 6. ScheduleModal
const ScheduleModal = ({ onSchedule, onClose, platform }) => {
  // Date picker
  // Time picker
  // Golden hours suggestion
}

// 7. PostCard
const PostCard = ({ post, onEdit, onCopy, onDelete }) => {
  // Platform icon
  // Content preview
  // Status badge
  // Actions
}

// 8. ContentHistoryScreen
const ContentHistoryScreen = () => {
  // Filters
  // Post list
}
```

---

## ✅ PHASE 3 CHECKLIST

```
□ ContentHomeScreen
□ Quick action buttons (3 platforms)
□ CreateContentScreen
□ PlatformSelector component
□ ContentTypeSelector component
□ PropertySelector integration (from Phase 1)
□ Manual input form
□ AI content generation (Anthropic API)
□ Loading state during generation
□ ContentEditor component
□ Character count
□ Regenerate button
□ Copy to clipboard
□ Save as draft
□ ScheduleModal component
□ Date/time picker
□ Golden hours suggestions
□ Local notification reminder
□ PostCard component
□ ContentHistoryScreen
□ Filter by platform
□ Filter by status
□ Edit draft
□ Delete post
□ Mark as posted
□ Empty states
□ Error handling
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                              END OF CODER PACK
#                           PostNhà Platform v2.3
#                        Phase 3: Social Content Manager
#                             Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
