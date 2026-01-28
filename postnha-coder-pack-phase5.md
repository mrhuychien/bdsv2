# ═══════════════════════════════════════════════════════════════════════════════
#                           🔧 CODER PACK - PHASE 5
#                        PostNhà Platform v2.5
#                              CRM System
#                         Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
#
#  📋 HƯỚNG DẪN:
#  1. Hoàn thành Phase 1, 2, 3, 4 trước
#  2. Copy TOÀN BỘ file này → Paste vào Claude Code / Cursor
#  3. Hoàn thiện PostNhà Platform!
#
# ═══════════════════════════════════════════════════════════════════════════════

---

## 🎭 VAI TRÒ

Bạn là **THỢ XÂY** trong hệ thống Vibecode Kit v4.0.

### QUY TẮC TUYỆT ĐỐI:
1. **KHÔNG** thay đổi code các Phase trước
2. **HOÀN THIỆN** module CRM theo Blueprint
3. **TÍCH HỢP** với Properties từ Phase 1
4. Gặp conflict → **BÁO CÁO**, không tự quyết định

---

## 📋 THÔNG TIN PHASE 5

| Field | Value |
|-------|-------|
| Dự án | PostNhà Platform v2.5 (FINAL) |
| Phase | 5 - CRM System |
| Depends on | All previous phases |
| Output | Complete CRM module |

---

## 🎯 MỤC TIÊU PHASE 5

```
Cho phép Sales:
1. Thêm khách hàng tiềm năng (leads) từ nhiều nguồn
2. Quản lý pipeline (Kanban drag & drop)
3. Tùy chỉnh các giai đoạn pipeline
4. Gắn khách hàng với BĐS quan tâm
5. Ghi nhận lịch sử tương tác
6. Đặt nhắc nhở follow-up
7. Tìm kiếm và lọc khách hàng
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 1: DATABASE (Đã có)
# ═══════════════════════════════════════════════════════════════════════════════

```sql
-- Tables đã tạo từ Phase 1:
-- • crm_leads
-- • crm_lead_properties
-- • crm_activities
-- • crm_pipeline_stages

-- Default pipeline stages (seed khi user đầu tiên vào CRM)
INSERT INTO crm_pipeline_stages (user_id, name, color, sort_order, is_default)
VALUES
  (USER_ID, 'Lead mới', '#6B7280', 0, true),
  (USER_ID, 'Quan tâm', '#3B82F6', 1, true),
  (USER_ID, 'Xem nhà', '#F59E0B', 2, true),
  (USER_ID, 'Đàm phán', '#8B5CF6', 3, true),
  (USER_ID, 'Chốt', '#22C55E', 4, true),
  (USER_ID, 'Mất', '#EF4444', 5, true);
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 2: APP STRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════

## 📱 SCREENS MỚI - PHASE 5

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 5 SCREENS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CRM TAB (Bottom Nav - Tab 5)                                      │
│  ├── CRMHomeScreen                                                 │
│  │   ├── Summary stats                                             │
│  │   ├── Today's follow-ups                                        │
│  │   └── Recent leads                                              │
│  │                                                                 │
│  ├── PipelineScreen (Kanban)                                       │
│  │   ├── Stage columns                                             │
│  │   ├── Lead cards (draggable)                                    │
│  │   └── Quick actions                                             │
│  │                                                                 │
│  ├── LeadsListScreen                                               │
│  │   ├── Search & filters                                          │
│  │   ├── Sort options                                              │
│  │   └── Lead cards                                                │
│  │                                                                 │
│  ├── LeadDetailScreen                                              │
│  │   ├── Contact info                                              │
│  │   ├── Status & source                                           │
│  │   ├── Interested properties                                     │
│  │   ├── Activity timeline                                         │
│  │   └── Actions (call, message, note)                            │
│  │                                                                 │
│  ├── AddLeadScreen                                                 │
│  │   ├── Contact form                                              │
│  │   ├── Source selector                                           │
│  │   ├── Budget range                                              │
│  │   └── Property interest                                         │
│  │                                                                 │
│  ├── AddActivityScreen                                             │
│  │   ├── Activity type                                             │
│  │   ├── Description                                               │
│  │   └── Schedule reminder                                         │
│  │                                                                 │
│  └── PipelineSettingsScreen                                        │
│      ├── Add/Edit/Delete stages                                    │
│      ├── Reorder stages                                            │
│      └── Stage colors                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 SCREEN DESIGNS

### Screen 1: CRM Home
```
┌─────────────────────────────────────────┐
│  👤 Khách hàng                  [⚙️]   │
│  ─────────────────────────────────────  │
│                                         │
│  📊 TỔNG QUAN                           │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │   28   │ │   5    │ │   3    │     │
│  │ Tổng   │ │ Tuần   │ │  Hôm   │     │
│  │ leads  │ │  này   │ │  nay   │     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📅 CẦN FOLLOW-UP HÔM NAY (3)          │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 Anh Minh - Quan tâm căn A1   │   │
│  │    📞 Hẹn gọi lại 10:00         │   │
│  │    [Gọi ngay] [Hoãn]            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🟡 Chị Hương - Xem nhà 14:00    │   │
│  │    🏠 Căn hộ Vinhomes Q9        │   │
│  │    [Xác nhận] [Đổi lịch]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🆕 LEADS MỚI                          │
│  ┌─────────────────────────────────┐   │
│  │ Anh Nam              📘 Facebook│   │
│  │ Quan tâm căn hộ Q7              │   │
│  │ 2-3 tỷ • Thêm 2 giờ trước       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│  ┌────────────┐ ┌────────────────┐     │
│  │ 📊 Pipeline│ │ 📋 Danh sách   │     │
│  └────────────┘ └────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
│  🏠    📦    ➕    📱    👤            │
└─────────────────────────────────────────┘
```

### Screen 2: Pipeline (Kanban)
```
┌─────────────────────────────────────────┐
│  ← Pipeline                    [⚙️]    │
│  ─────────────────────────────────────  │
│                                         │
│  ← Swipe để xem các cột →              │
│                                         │
│  ┌──────┬──────┬──────┬──────┬──────┐ │
│  │Lead  │Quan  │Xem   │Đàm   │Chốt  │ │
│  │mới   │tâm   │nhà   │phán  │      │ │
│  │(5)   │(3)   │(2)   │(1)   │(1)   │ │
│  ├──────┼──────┼──────┼──────┼──────┤ │
│  │┌────┐│┌────┐│┌────┐│┌────┐│┌────┐│ │
│  ││Anh ││Chị ││Anh ││Chị ││Anh ││ │
│  ││Nam ││Lan ││Tùng││Mai ││Hùng││ │
│  ││📘  ││💬  ││📄  ││📘  ││💬  ││ │
│  │└────┘│└────┘│└────┘│└────┘│└────┘│ │
│  │┌────┐│┌────┐│┌────┐│      │      │ │
│  ││Chị ││Anh ││Chị ││      │      │ │
│  ││Hoa ││Bình││Thảo││      │      │ │
│  ││🎵  ││📘  ││📄  ││      │      │ │
│  │└────┘│└────┘│└────┘│      │      │ │
│  │┌────┐│┌────┐│      │      │      │ │
│  ││... ││... ││      │      │      │ │
│  │└────┘│└────┘│      │      │      │ │
│  │      │      │      │      │      │ │
│  │      │      │      │      │      │ │
│  └──────┴──────┴──────┴──────┴──────┘ │
│                                         │
│  💡 Kéo thả card để chuyển trạng thái  │
│                                         │
│            [+ Thêm lead]               │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 3: Leads List
```
┌─────────────────────────────────────────┐
│  ← Danh sách khách hàng        [+ Add] │
│  ─────────────────────────────────────  │
│  🔍 Tìm theo tên, SĐT...               │
│  ─────────────────────────────────────  │
│  Nguồn: [Tất cả ▼]  Status: [Tất cả ▼]│
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Anh Minh              📘 FB  │   │
│  │ 📞 0909 123 456                 │   │
│  │ 💰 2-3 tỷ • Căn hộ, Nhà phố    │   │
│  │ 🏷️ Quan tâm                     │   │
│  │ 📅 Follow-up: Hôm nay 10:00     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Chị Hương             💬 Zalo│   │
│  │ 📞 0908 765 432                 │   │
│  │ 💰 5-8 tỷ • Nhà phố            │   │
│  │ 🏷️ Xem nhà                      │   │
│  │ 📅 Follow-up: Hôm nay 14:00     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Anh Nam               🎵 TikTok│  │
│  │ 📞 0907 111 222                 │   │
│  │ 💰 1-2 tỷ • Căn hộ             │   │
│  │ 🏷️ Lead mới                     │   │
│  │ 📅 Chưa có lịch follow-up       │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 4: Lead Detail
```
┌─────────────────────────────────────────┐
│  ←                        [✏️] [🗑️]    │
│  ─────────────────────────────────────  │
│                                         │
│           👤                            │
│        Anh Minh                         │
│     📞 0909 123 456                    │
│     ✉️ anhminh@email.com               │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ 📞    │ │ 💬    │ │ ✉️    │     │
│  │ Gọi   │ │ Zalo  │ │ Email │     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📋 THÔNG TIN                           │
│  ┌─────────────────────────────────┐   │
│  │ Nguồn:      📘 Facebook         │   │
│  │ Trạng thái: 🟡 Quan tâm         │   │
│  │ Ngân sách:  2-3 tỷ              │   │
│  │ Quan tâm:   Căn hộ, Nhà phố    │   │
│  │ Khu vực:    Quận 7, Quận 9     │   │
│  │ Ngày tạo:   25/01/2025          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 BĐS QUAN TÂM (2)        [+ Thêm]  │
│  ┌─────────────────────────────────┐   │
│  │ 🖼️ Căn hộ Vinhomes Q9          │   │
│  │    ⭐⭐⭐⭐⭐ Rất quan tâm         │   │
│  │    "Thích view sông"            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🖼️ Nhà phố Thảo Điền           │   │
│  │    ⭐⭐⭐ Đang xem xét            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 LỊCH SỬ TƯƠNG TÁC       [+ Thêm]  │
│  ┌─────────────────────────────────┐   │
│  │ 📞 Gọi điện          Hôm nay   │   │
│  │    Khách hẹn xem nhà cuối tuần │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 💬 Nhắn Zalo          Hôm qua  │   │
│  │    Gửi thông tin căn A1-2509   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 📝 Ghi chú            3 ngày   │   │
│  │    Khách từ quảng cáo FB       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📅 NHẮC NHỞ TIẾP THEO                 │
│  ┌─────────────────────────────────┐   │
│  │ ⏰ Hôm nay, 10:00               │   │
│  │ 📞 Gọi lại xác nhận lịch xem   │   │
│  │ [Hoàn thành] [Đổi lịch]        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 5: Add Lead
```
┌─────────────────────────────────────────┐
│  ← Thêm khách hàng                      │
│  ─────────────────────────────────────  │
│                                         │
│  👤 THÔNG TIN LIÊN HỆ                   │
│  ┌─────────────────────────────────┐   │
│  │ Họ tên *                        │   │
│  │ [Nguyễn Văn A]                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Số điện thoại *                 │   │
│  │ [0909 123 456]                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Email                           │   │
│  │ [email@example.com]             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📍 NGUỒN KHÁCH HÀNG                    │
│  [📘 FB] [💬 Zalo] [🎵 TikTok]        │
│  [📄 Landing] [👥 Giới thiệu] [Khác]  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Chi tiết nguồn (link post...)   │   │
│  │ [_________________________]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  💰 NGÂN SÁCH                           │
│  ┌──────────┐  đến  ┌──────────┐      │
│  │ Từ: 2   │       │ Đến: 5   │      │
│  └──────────┘       └──────────┘ tỷ   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🏠 QUAN TÂM LOẠI BĐS                   │
│  [✓ Căn hộ] [✓ Nhà phố] [Đất nền]    │
│  [Biệt thự] [Mặt bằng]                │
│                                         │
│  📍 KHU VỰC QUAN TÂM                    │
│  [Quận 7] [✓ Quận 9] [Thủ Đức]       │
│  [+ Thêm khu vực]                      │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 GHI CHÚ                             │
│  ┌─────────────────────────────────┐   │
│  │ [Ghi chú thêm về khách...]      │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [💾 Lưu khách hàng]              │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 6: Add Activity
```
┌─────────────────────────────────────────┐
│  ← Thêm hoạt động                       │
│  ─────────────────────────────────────  │
│                                         │
│  👤 Khách hàng: Anh Minh               │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📋 LOẠI HOẠT ĐỘNG                      │
│  ┌──────────┐ ┌──────────┐             │
│  │ 📞 Gọi  │ │ 💬 Nhắn │             │
│  │  điện ● │ │   tin   │             │
│  └──────────┘ └──────────┘             │
│  ┌──────────┐ ┌──────────┐             │
│  │ 🤝 Gặp  │ │ 📝 Ghi  │             │
│  │  mặt    │ │   chú   │             │
│  └──────────┘ └──────────┘             │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📝 NỘI DUNG                            │
│  ┌─────────────────────────────────┐   │
│  │ Mô tả hoạt động...              │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ⏰ ĐẶT NHẮC NHỞ TIẾP THEO             │
│  [✓] Có                                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Ngày: [28/01/2025]         📅  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Giờ:  [10:00]              🕐  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Nội dung nhắc nhở               │   │
│  │ [Gọi lại xác nhận lịch xem]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [💾 Lưu hoạt động]               │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 7: Pipeline Settings
```
┌─────────────────────────────────────────┐
│  ← Tùy chỉnh Pipeline                   │
│  ─────────────────────────────────────  │
│                                         │
│  💡 Kéo để sắp xếp thứ tự              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ≡ 🔵 Lead mới             [✏️] │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ≡ 🔷 Quan tâm             [✏️] │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ≡ 🟡 Xem nhà              [✏️] │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ≡ 🟣 Đàm phán             [✏️] │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ≡ 🟢 Chốt                 [✏️] │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ≡ 🔴 Mất                  [✏️] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [+ Thêm giai đoạn mới]           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│       [💾 Lưu thay đổi]                │
│                                         │
└─────────────────────────────────────────┘
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 3: DATA & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

## 📊 ENUMS & CONSTANTS

```javascript
const LEAD_SOURCES = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
  { id: 'zalo', name: 'Zalo', icon: '💬', color: '#0068FF' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
  { id: 'landing-page', name: 'Landing Page', icon: '📄', color: '#10B981' },
  { id: 'referral', name: 'Giới thiệu', icon: '👥', color: '#8B5CF6' },
  { id: 'other', name: 'Khác', icon: '📌', color: '#6B7280' },
];

const ACTIVITY_TYPES = [
  { id: 'call', name: 'Gọi điện', icon: '📞' },
  { id: 'message', name: 'Nhắn tin', icon: '💬' },
  { id: 'meeting', name: 'Gặp mặt', icon: '🤝' },
  { id: 'note', name: 'Ghi chú', icon: '📝' },
  { id: 'status-change', name: 'Đổi trạng thái', icon: '🔄' },
];

const DEFAULT_PIPELINE_STAGES = [
  { name: 'Lead mới', color: '#6B7280', sort_order: 0 },
  { name: 'Quan tâm', color: '#3B82F6', sort_order: 1 },
  { name: 'Xem nhà', color: '#F59E0B', sort_order: 2 },
  { name: 'Đàm phán', color: '#8B5CF6', sort_order: 3 },
  { name: 'Chốt', color: '#22C55E', sort_order: 4 },
  { name: 'Mất', color: '#EF4444', sort_order: 5 },
];

const INTEREST_LEVELS = [
  { value: 1, label: 'Rất thấp', stars: '⭐' },
  { value: 2, label: 'Thấp', stars: '⭐⭐' },
  { value: 3, label: 'Trung bình', stars: '⭐⭐⭐' },
  { value: 4, label: 'Cao', stars: '⭐⭐⭐⭐' },
  { value: 5, label: 'Rất cao', stars: '⭐⭐⭐⭐⭐' },
];
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                         PHẦN 4: SUPABASE OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

```javascript
// ═══════════════════════════════════════
// LEADS CRUD
// ═══════════════════════════════════════

// Create lead
const createLead = async (leadData) => {
  const { data, error } = await supabase
    .from('crm_leads')
    .insert({
      user_id: user.id,
      ...leadData,
    })
    .select()
    .single();
  return { data, error };
};

// Get all leads
const getLeads = async (userId, filters = {}) => {
  let query = supabase
    .from('crm_leads')
    .select('*')
    .eq('user_id', userId);
  
  if (filters.source) {
    query = query.eq('source', filters.source);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Get leads by status (for pipeline)
const getLeadsByStatus = async (userId) => {
  const { data, error } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  // Group by status
  const grouped = {};
  data?.forEach(lead => {
    if (!grouped[lead.status]) grouped[lead.status] = [];
    grouped[lead.status].push(lead);
  });
  
  return { data: grouped, error };
};

// Update lead status (for drag & drop)
const updateLeadStatus = async (leadId, newStatus) => {
  const { data, error } = await supabase
    .from('crm_leads')
    .update({ status: newStatus })
    .eq('id', leadId)
    .select()
    .single();
  
  // Auto-create activity for status change
  if (!error) {
    await createActivity({
      lead_id: leadId,
      activity_type: 'status-change',
      description: `Chuyển sang "${newStatus}"`,
    });
  }
  
  return { data, error };
};

// Get lead detail with properties and activities
const getLeadDetail = async (leadId) => {
  const { data: lead, error: leadError } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('id', leadId)
    .single();
  
  if (leadError) return { lead: null, properties: [], activities: [] };
  
  // Get interested properties
  const { data: leadProperties } = await supabase
    .from('crm_lead_properties')
    .select(`
      *,
      property:properties(*)
    `)
    .eq('lead_id', leadId);
  
  // Get activities
  const { data: activities } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  
  return {
    lead,
    properties: leadProperties || [],
    activities: activities || [],
  };
};

// Delete lead
const deleteLead = async (leadId) => {
  const { error } = await supabase
    .from('crm_leads')
    .delete()
    .eq('id', leadId);
  return { error };
};

// ═══════════════════════════════════════
// LEAD PROPERTIES (Interested properties)
// ═══════════════════════════════════════

// Link lead to property
const linkLeadToProperty = async (leadId, propertyId, interestLevel, notes) => {
  const { data, error } = await supabase
    .from('crm_lead_properties')
    .upsert({
      lead_id: leadId,
      property_id: propertyId,
      interest_level: interestLevel,
      notes: notes,
    })
    .select()
    .single();
  return { data, error };
};

// Remove link
const unlinkLeadFromProperty = async (leadId, propertyId) => {
  const { error } = await supabase
    .from('crm_lead_properties')
    .delete()
    .eq('lead_id', leadId)
    .eq('property_id', propertyId);
  return { error };
};

// ═══════════════════════════════════════
// ACTIVITIES
// ═══════════════════════════════════════

// Create activity
const createActivity = async (activityData) => {
  const { data, error } = await supabase
    .from('crm_activities')
    .insert({
      user_id: user.id,
      ...activityData,
    })
    .select()
    .single();
  return { data, error };
};

// Get today's follow-ups
const getTodayFollowUps = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const { data, error } = await supabase
    .from('crm_activities')
    .select(`
      *,
      lead:crm_leads(*)
    `)
    .eq('user_id', userId)
    .gte('scheduled_at', today.toISOString())
    .lt('scheduled_at', tomorrow.toISOString())
    .is('completed_at', null)
    .order('scheduled_at', { ascending: true });
  
  return { data, error };
};

// Complete activity
const completeActivity = async (activityId) => {
  const { data, error } = await supabase
    .from('crm_activities')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', activityId)
    .select()
    .single();
  return { data, error };
};

// ═══════════════════════════════════════
// PIPELINE STAGES
// ═══════════════════════════════════════

// Get user's pipeline stages
const getPipelineStages = async (userId) => {
  const { data, error } = await supabase
    .from('crm_pipeline_stages')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });
  
  // If no stages, create defaults
  if (!data || data.length === 0) {
    await initDefaultStages(userId);
    return getPipelineStages(userId);
  }
  
  return { data, error };
};

// Initialize default stages
const initDefaultStages = async (userId) => {
  const stages = DEFAULT_PIPELINE_STAGES.map(stage => ({
    user_id: userId,
    ...stage,
    is_default: true,
  }));
  
  await supabase.from('crm_pipeline_stages').insert(stages);
};

// Add custom stage
const addPipelineStage = async (userId, stageData) => {
  const { data, error } = await supabase
    .from('crm_pipeline_stages')
    .insert({
      user_id: userId,
      ...stageData,
      is_default: false,
    })
    .select()
    .single();
  return { data, error };
};

// Update stage
const updatePipelineStage = async (stageId, updates) => {
  const { data, error } = await supabase
    .from('crm_pipeline_stages')
    .update(updates)
    .eq('id', stageId)
    .select()
    .single();
  return { data, error };
};

// Delete stage (only non-default)
const deletePipelineStage = async (stageId) => {
  const { error } = await supabase
    .from('crm_pipeline_stages')
    .delete()
    .eq('id', stageId)
    .eq('is_default', false);
  return { error };
};

// Reorder stages
const reorderPipelineStages = async (userId, orderedIds) => {
  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index,
  }));
  
  for (const update of updates) {
    await supabase
      .from('crm_pipeline_stages')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id);
  }
};

// ═══════════════════════════════════════
// STATS
// ═══════════════════════════════════════

const getCRMStats = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  // Total leads
  const { count: total } = await supabase
    .from('crm_leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  // This week
  const { count: thisWeek } = await supabase
    .from('crm_leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', weekAgo.toISOString());
  
  // Today
  const { count: todayCount } = await supabase
    .from('crm_leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());
  
  return {
    total: total || 0,
    thisWeek: thisWeek || 0,
    today: todayCount || 0,
  };
};
```

---

## 📦 COMPONENTS

```javascript
// Components cần tạo cho Phase 5

// 1. CRMHomeScreen
const CRMHomeScreen = () => {
  // Stats cards
  // Today's follow-ups
  // Recent leads
  // Navigation to Pipeline/List
}

// 2. PipelineScreen (Kanban)
const PipelineScreen = () => {
  // Horizontal scroll columns
  // Draggable lead cards
  // Stage headers with count
}

// 3. PipelineColumn
const PipelineColumn = ({ stage, leads, onDrop }) => {
  // Column header
  // Lead cards
  // Drop zone
}

// 4. LeadCard (for pipeline)
const LeadCard = ({ lead, onPress, draggable }) => {
  // Avatar/initials
  // Name, source icon
  // Quick info
}

// 5. LeadsListScreen
const LeadsListScreen = () => {
  // Search bar
  // Filter dropdowns
  // Lead list
}

// 6. LeadDetailScreen
const LeadDetailScreen = () => {
  // Contact header with actions
  // Info section
  // Interested properties
  // Activity timeline
  // Next reminder
}

// 7. AddLeadScreen
const AddLeadScreen = () => {
  // Contact form
  // Source selector
  // Budget range
  // Interest multi-select
}

// 8. AddActivityScreen
const AddActivityScreen = () => {
  // Activity type selector
  // Description textarea
  // Reminder scheduler
}

// 9. PropertyInterestModal
const PropertyInterestModal = ({ onSelect }) => {
  // Property list from inventory
  // Interest level selector
  // Notes input
}

// 10. PipelineSettingsScreen
const PipelineSettingsScreen = () => {
  // Draggable stage list
  // Edit/delete stage
  // Add new stage
}

// 11. StageEditor
const StageEditor = ({ stage, onSave }) => {
  // Name input
  // Color picker
}

// 12. FollowUpCard
const FollowUpCard = ({ activity, onComplete, onReschedule }) => {
  // Lead info
  // Scheduled time
  // Description
  // Action buttons
}

// 13. ActivityTimeline
const ActivityTimeline = ({ activities }) => {
  // Timeline UI
  // Activity items
}
```

---

## ✅ PHASE 5 CHECKLIST

```
□ CRMHomeScreen
□ Stats cards (total, week, today)
□ Today's follow-ups list
□ Recent leads list
□ PipelineScreen (Kanban)
□ Horizontal scrollable columns
□ PipelineColumn component
□ LeadCard component (draggable)
□ Drag & drop to change status
□ Drop animation
□ LeadsListScreen
□ Search by name/phone
□ Filter by source
□ Filter by status
□ Sort options
□ LeadDetailScreen
□ Contact info header
□ Click-to-call, Zalo link
□ Info section
□ Interested properties list
□ Activity timeline
□ Next reminder display
□ AddLeadScreen
□ Contact form validation
□ Source selector (6 options)
□ Budget range inputs
□ Property type multi-select
□ Area multi-select
□ Notes textarea
□ AddActivityScreen
□ Activity type selector
□ Description textarea
□ Reminder toggle
□ Date/time picker
□ PropertyInterestModal
□ Property list from inventory
□ Interest level selector (1-5 stars)
□ Notes input
□ Link/unlink property
□ PipelineSettingsScreen
□ Default stages display
□ Edit stage (name, color)
□ Add custom stage
□ Delete custom stage
□ Reorder stages (drag)
□ FollowUpCard component
□ Complete action
□ Reschedule action
□ ActivityTimeline component
□ Auto-log status changes
□ Empty states
□ Loading states
□ Error handling
□ Stats refresh
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#                              END OF CODER PACK
#                           PostNhà Platform v2.5
#                            Phase 5: CRM System
#                             Vibecode Kit v4.0
# ═══════════════════════════════════════════════════════════════════════════════
#
#  🎉 CONGRATULATIONS!
#  
#  Sau khi hoàn thành Phase 5, bạn đã có một nền tảng PostNhà hoàn chỉnh với:
#  
#  ✅ Phase 1: Kho hàng BĐS (CRUD, Upload ảnh)
#  ✅ Phase 2: Landing Page Builder (10+ templates)
#  ✅ Phase 3: Social Content Manager (AI generation)
#  ✅ Phase 4: Trang môi giới cá nhân (5 templates)
#  ✅ Phase 5: CRM (Pipeline, Activities, Follow-ups)
#  
#  🚀 READY TO LAUNCH!
#
# ═══════════════════════════════════════════════════════════════════════════════
