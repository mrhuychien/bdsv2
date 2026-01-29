// ═══════════════════════════════════════════════════════════════════════════════
//                           BATDONGSAN.DIGITAL v2.5
//                        Nền tảng BĐS cho Môi giới
//                           Vibecode Kit v4.0
//                      Tác giả: Nguyễn Huy Chiến (1nguoi.com)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
//                         SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://ikkmumdaqbopacoxklzp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra211bWRhcWJvcGFjb3hrbHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDQ5NzEsImV4cCI6MjA4NTE4MDk3MX0.M2S7nBZneZgI4nsDKv4ctDE6FpMzFzc0eM7RlmG9mac';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════════════════════════════════════════
//                         DATA CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PROPERTY_TYPES = [
  { value: 'can-ho', label: 'Căn hộ', icon: '🏢' },
  { value: 'dat-nen', label: 'Đất nền', icon: '🌳' },
  { value: 'nha-pho', label: 'Nhà phố', icon: '🏠' },
  { value: 'biet-thu', label: 'Biệt thự', icon: '🏰' },
  { value: 'mat-bang', label: 'Mặt bằng', icon: '🏪' },
  { value: 'phong-tro', label: 'Phòng trọ', icon: '🚪' },
];

const PROPERTY_STATUS = [
  { value: 'dang-ban', label: 'Đang bán', color: '#22C55E' },
  { value: 'da-coc', label: 'Đã cọc', color: '#F59E0B' },
  { value: 'da-ban', label: 'Đã bán', color: '#6B7280' },
  { value: 'tam-ngung', label: 'Tạm ngưng', color: '#EF4444' },
];

const PRICE_UNITS = [
  { value: 'ty', label: 'Tỷ' },
  { value: 'trieu', label: 'Triệu' },
  { value: 'trieu-m2', label: 'Triệu/m²' },
];

const DIRECTIONS = [
  { value: 'dong', label: 'Đông' },
  { value: 'tay', label: 'Tây' },
  { value: 'nam', label: 'Nam' },
  { value: 'bac', label: 'Bắc' },
  { value: 'dong-nam', label: 'Đông Nam' },
  { value: 'dong-bac', label: 'Đông Bắc' },
  { value: 'tay-nam', label: 'Tây Nam' },
  { value: 'tay-bac', label: 'Tây Bắc' },
];

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
];

const DISTRICTS_HCM = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
  'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
  'Quận 11', 'Quận 12', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận',
  'Tân Bình', 'Tân Phú', 'Thủ Đức', 'Bình Tân', 'Nhà Bè',
  'Hóc Môn', 'Củ Chi', 'Cần Giờ', 'Bình Chánh',
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 2: LANDING PAGE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const LANDING_TEMPLATES = [
  { id: 'modern-minimal-1', name: 'Modern Minimal', category: 'modern', color: '#F59E0B' },
  { id: 'modern-minimal-2', name: 'Modern Clean', category: 'modern', color: '#3B82F6' },
  { id: 'luxury-gold-1', name: 'Luxury Gold', category: 'luxury', color: '#D4AF37' },
  { id: 'luxury-gold-2', name: 'Luxury Dark', category: 'luxury', color: '#1F2937' },
  { id: 'compact-1', name: 'Compact Card', category: 'compact', color: '#10B981' },
  { id: 'compact-2', name: 'Compact Info', category: 'compact', color: '#6366F1' },
  { id: 'video-hero-1', name: 'Video Hero', category: 'video', color: '#EF4444' },
  { id: 'video-hero-2', name: 'Video Scroll', category: 'video', color: '#8B5CF6' },
  { id: 'gallery-focus-1', name: 'Gallery Grid', category: 'gallery', color: '#EC4899' },
  { id: 'gallery-focus-2', name: 'Gallery Slide', category: 'gallery', color: '#14B8A6' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 3: CONTENT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2', maxLength: 63206 },
  { id: 'zalo', name: 'Zalo', icon: '💬', color: '#0068FF', maxLength: 2000 },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', maxLength: 2200 },
];

const CONTENT_TYPES = {
  facebook: [
    { id: 'post', name: 'Bài đăng', icon: '📝' },
    { id: 'story', name: 'Story', icon: '📱' },
    { id: 'carousel', name: 'Carousel', icon: '🖼️' },
  ],
  zalo: [
    { id: 'post', name: 'Bài đăng', icon: '📝' },
    { id: 'story', name: 'Nhật ký', icon: '📱' },
  ],
  tiktok: [
    { id: 'script', name: 'Script video', icon: '🎬' },
    { id: 'caption', name: 'Caption', icon: '📝' },
  ],
};

const GOLDEN_HOURS = [
  { time: '07:00', label: '7:00 - Sáng sớm' },
  { time: '12:00', label: '12:00 - Giờ nghỉ trưa' },
  { time: '18:00', label: '18:00 - Tan làm' },
  { time: '21:00', label: '21:00 - Tối' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 4: AGENT PAGE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_TEMPLATES = [
  { id: 'card-style', name: 'Card Style', description: 'Gọn gàng như danh thiếp' },
  { id: 'full-page', name: 'Full Page', description: 'Trang đầy đủ với form liên hệ' },
  { id: 'portfolio-style', name: 'Portfolio', description: 'Tập trung vào hình ảnh BĐS' },
  { id: 'modern-dark', name: 'Modern Dark', description: 'Nền tối sang trọng' },
  { id: 'professional-light', name: 'Professional', description: 'Sáng sủa, chuyên nghiệp' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 5: CRM CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

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
];

const DEFAULT_PIPELINE_STAGES = [
  { id: 'lead', name: 'Lead mới', color: '#6B7280' },
  { id: 'quan-tam', name: 'Quan tâm', color: '#3B82F6' },
  { id: 'xem-nha', name: 'Xem nhà', color: '#F59E0B' },
  { id: 'dam-phan', name: 'Đàm phán', color: '#8B5CF6' },
  { id: 'chot', name: 'Chốt', color: '#22C55E' },
  { id: 'mat', name: 'Mất', color: '#EF4444' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://batdongsan.digital'
      }
    });
    return { data, error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      signInWithGoogle,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ═══════════════════════════════════════════════════════════════════════════════
//                         UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const formatPrice = (price, unit) => {
  if (!price) return 'Liên hệ';
  const unitLabel = PRICE_UNITS.find(u => u.value === unit)?.label || 'Tỷ';
  return `${price} ${unitLabel}`;
};

const getStatusInfo = (status) => {
  return PROPERTY_STATUS.find(s => s.value === status) || PROPERTY_STATUS[0];
};

const getPropertyTypeInfo = (type) => {
  return PROPERTY_TYPES.find(t => t.value === type) || PROPERTY_TYPES[0];
};

const getDirectionLabel = (direction) => {
  return DIRECTIONS.find(d => d.value === direction)?.label || '';
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Loading Spinner
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  return (
    <div className={`${sizeClass} border-2 border-amber-500 border-t-transparent rounded-full animate-spin`}></div>
  );
};

// Button Component
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  const baseClass = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};

// Input Component
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Select Component
const Select = ({ label, value, onChange, options, required = false, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
      >
        <option value="">Chọn...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.icon ? `${opt.icon} ` : ''}{opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Textarea Component
const Textarea = ({ label, value, onChange, placeholder, rows = 4, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
      />
    </div>
  );
};

// Badge Component
const Badge = ({ children, color = '#22C55E' }) => {
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: color + '20', color: color }}
    >
      {children}
    </span>
  );
};

// Card Component
const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 border border-slate-700 rounded-2xl p-4 ${onClick ? 'cursor-pointer hover:border-slate-600 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      {action}
    </div>
  );
};

// Confirm Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-amber-500';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`}>
      {message}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         IMAGE UPLOADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ImageUploader = ({ images = [], onChange, userId }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        newImages.push(publicUrl);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    onChange(newImages);
    setUploading(false);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="mb-6">
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Hình ảnh
      </label>
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden group">
            <img src={url} alt={`Hình ảnh BĐS ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </div>
        ))}
        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors">
          {uploading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <span className="text-2xl text-slate-500">+</span>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         FEATURES SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const FeaturesSelector = ({ selected = [], onChange }) => {
  const toggleFeature = (feature) => {
    if (selected.includes(feature)) {
      onChange(selected.filter(f => f !== feature));
    } else {
      onChange([...selected, feature]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Tiện ích
      </label>
      <div className="flex flex-wrap gap-2">
        {FEATURES.map(feature => (
          <button
            key={feature}
            type="button"
            onClick={() => toggleFeature(feature)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selected.includes(feature)
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PROPERTY CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const PropertyCard = ({ property, onClick, onCreateLP, onCreateContent }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const statusInfo = getStatusInfo(property.status);
  const typeInfo = getPropertyTypeInfo(property.property_type);
  const images = property.images || [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="mb-4" onClick={onClick}>
      {/* Image Carousel */}
      <div className="relative h-48 -mx-4 -mt-4 mb-4 rounded-t-2xl overflow-hidden bg-slate-700">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-500">
            {typeInfo.icon}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
        {property.title}
      </h3>

      <p className="text-slate-400 text-sm mb-3 flex items-center gap-1">
        <span>📍</span>
        {property.district}, {property.city}
      </p>

      <div className="flex items-center gap-3 text-sm text-slate-300 mb-4">
        <span className="text-amber-500 font-semibold">
          💰 {formatPrice(property.price, property.price_unit)}
        </span>
        {property.area && <span>• {property.area}m²</span>}
        {property.bedrooms && <span>• {property.bedrooms} PN</span>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onCreateLP?.(property); }}
          className="flex-1"
        >
          🔗 Tạo LP
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onCreateContent?.(property); }}
          className="flex-1"
        >
          📱 MXH
        </Button>
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Header = ({ title, showProfile = true, onBack, onNavigate }) => {
  const { profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
  };

  const handleMenuClick = (screen) => {
    setShowMenu(false);
    onNavigate?.(screen);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-slate-400 hover:text-white">
              ←
            </button>
          )}
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        {showProfile && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold"
            >
              {profile?.full_name?.charAt(0) || 'U'}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 min-w-[200px] z-50">
                <div className="px-4 py-2 border-b border-slate-700">
                  <p className="font-semibold text-white">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-slate-400">{profile?.email}</p>
                </div>
                {onNavigate && (
                  <>
                    <button
                      onClick={() => handleMenuClick('profile-settings')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <span>👤</span> Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => handleMenuClick('agent-page-builder')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <span>🌐</span> Trang cá nhân
                    </button>
                    <button
                      onClick={() => handleMenuClick('landing-pages')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <span>🔗</span> Landing Pages
                    </button>
                    <div className="border-t border-slate-700 my-1"></div>
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <span>🚪</span> Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         BOTTOM NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: '🏠' },
    { id: 'properties', label: 'Kho hàng', icon: '📦' },
    { id: 'create', label: 'Tạo mới', icon: '➕' },
    { id: 'content', label: 'Content', icon: '📱' },
    { id: 'crm', label: 'CRM', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[64px] py-2 transition-colors ${
              activeTab === tab.id ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         SEARCH BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SearchBar = ({ value, onChange, placeholder = 'Tìm kiếm...' }) => {
  return (
    <div className="relative mb-4">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         FILTER TABS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'Tất cả' },
    ...PROPERTY_STATUS
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-hide">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter.value
              ? 'bg-amber-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         AUTH SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const LoginScreen = ({ onNavigate }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email hoặc mật khẩu không đúng'
        : error.message
      );
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-white">Batdongsan.Digital</h1>
          <p className="text-slate-400 mt-2">Nền tảng BĐS cho môi giới</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full mb-4">
            Đăng nhập
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-700"></div>
          <span className="px-4 text-slate-500 text-sm">Hoặc</span>
          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 mb-4"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Đăng nhập với Google
        </button>

        <div className="text-center">
          <button
            onClick={() => onNavigate('forgot-password')}
            className="text-amber-500 text-sm hover:underline mb-4 block"
          >
            Quên mật khẩu?
          </button>

          <p className="text-slate-400 text-sm">
            Chưa có tài khoản?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-amber-500 font-semibold hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterScreen = ({ onNavigate }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Đăng ký thành công!</h2>
          <p className="text-slate-400 mb-6">
            Vui lòng kiểm tra email để xác nhận tài khoản.
          </p>
          <Button onClick={() => onNavigate('login')}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Tạo tài khoản</h1>
          <p className="text-slate-400 mt-2">Bắt đầu miễn phí với Batdongsan.Digital</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            required
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full mb-4">
            Đăng ký
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-700"></div>
          <span className="px-4 text-slate-500 text-sm">Hoặc</span>
          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 mb-4"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Đăng ký với Google
        </button>

        <p className="text-slate-400 text-sm text-center">
          Đã có tài khoản?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-amber-500 font-semibold hover:underline"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

const ForgotPasswordScreen = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-2">Kiểm tra email</h2>
          <p className="text-slate-400 mb-6">
            Chúng tôi đã gửi link đặt lại mật khẩu đến {email}
          </p>
          <Button onClick={() => onNavigate('login')}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Quên mật khẩu</h1>
          <p className="text-slate-400 mt-2">Nhập email để lấy lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full mb-4">
            Gửi link đặt lại mật khẩu
          </Button>
        </form>

        <p className="text-slate-400 text-sm text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-amber-500 hover:underline"
          >
            ← Quay lại đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PROPERTY SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const PropertiesScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchProperties = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="📦 Kho hàng" />

      <div className="p-4">
        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <Button onClick={() => onNavigate('add-property')}>
            + Thêm BĐS
          </Button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm BĐS..."
        />

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Property List */}
        {filteredProperties.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Chưa có BĐS nào"
            description="Thêm BĐS đầu tiên vào kho hàng của bạn"
            action={
              <Button onClick={() => onNavigate('add-property')}>
                + Thêm BĐS mới
              </Button>
            }
          />
        ) : (
          filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => onNavigate('property-detail', property.id)}
              onCreateLP={() => onNavigate('create-landing-page', { propertyId: property.id })}
              onCreateContent={() => onNavigate('create-content', { propertyId: property.id })}
            />
          ))
        )}
      </div>
    </div>
  );
};

const PropertyDetailScreen = ({ propertyId, onNavigate, onBack }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      onBack();
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <EmptyState
          icon="❌"
          title="Không tìm thấy BĐS"
          description="BĐS này không tồn tại hoặc đã bị xóa"
          action={<Button onClick={onBack}>Quay lại</Button>}
        />
      </div>
    );
  }

  const statusInfo = getStatusInfo(property.status);
  const images = property.images || [];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white text-xl">
            ←
          </button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('edit-property', property.id)}
            >
              ✏️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-64 bg-slate-800">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white text-xl"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white text-xl"
                >
                  ›
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full cursor-pointer ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-slate-600">
            {getPropertyTypeInfo(property.property_type).icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Badge color={statusInfo.color}>{statusInfo.label}</Badge>

        <h1 className="text-2xl font-bold text-white mt-3 mb-2">
          {property.title}
        </h1>

        <p className="text-slate-400 mb-4 flex items-center gap-2">
          <span>📍</span>
          {property.address && `${property.address}, `}
          {property.district}, {property.city}
        </p>

        {/* Stats */}
        <Card className="mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-amber-500 font-bold text-lg">
                {formatPrice(property.price, property.price_unit)}
              </p>
              <p className="text-slate-400 text-sm">Giá</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{property.area || '-'}m²</p>
              <p className="text-slate-400 text-sm">Diện tích</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{property.bedrooms || '-'} PN</p>
              <p className="text-slate-400 text-sm">Phòng ngủ</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700 text-center">
            <div>
              <p className="text-white font-semibold">{property.bathrooms || '-'} WC</p>
              <p className="text-slate-400 text-sm">Phòng tắm</p>
            </div>
            <div>
              <p className="text-white font-semibold">{getDirectionLabel(property.direction) || '-'}</p>
              <p className="text-slate-400 text-sm">Hướng</p>
            </div>
          </div>
        </Card>

        {/* Description */}
        {property.description && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">📝 Mô tả</h3>
            <p className="text-slate-300 whitespace-pre-line">{property.description}</p>
          </div>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">✨ Tiện ích</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                  • {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Owner Info */}
        <Card className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">👤 Thông tin chủ nhà</h3>
          <div className="space-y-2 text-slate-300">
            {property.owner_name && (
              <p><span className="text-slate-500">Tên:</span> {property.owner_name}</p>
            )}
            {property.owner_phone && (
              <p><span className="text-slate-500">SĐT:</span> {property.owner_phone}</p>
            )}
            {property.commission_rate && (
              <p><span className="text-slate-500">Hoa hồng:</span> {property.commission_rate}%</p>
            )}
            {property.notes && (
              <p><span className="text-slate-500">Ghi chú:</span> {property.notes}</p>
            )}
          </div>
        </Card>

        {/* Landing Page URL */}
        {property.landing_page_url && (
          <Card className="mb-4 border-amber-500/30">
            <h3 className="text-lg font-semibold text-white mb-3">🔗 Landing Page</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={property.landing_page_url}
                readOnly
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-amber-400 text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(property.landing_page_url);
                }}
              >
                📋
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(property.landing_page_url, '_blank')}
              >
                🔗
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onNavigate('create-landing-page', { propertyId: property.id })}
          >
            🔗 Tạo Landing Page
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onNavigate('create-content', { propertyId: property.id })}
          >
            📱 Tạo Content
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa BĐS?"
        message="Bạn có chắc muốn xóa BĐS này? Hành động này không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
};

const PropertyFormScreen = ({ propertyId, onBack }) => {
  const { user } = useAuth();
  const isEdit = !!propertyId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    property_type: '',
    status: 'dang-ban',
    price: '',
    price_unit: 'ty',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    direction: '',
    address: '',
    ward: '',
    district: '',
    city: 'Hồ Chí Minh',
    description: '',
    features: [],
    images: [],
    owner_name: '',
    owner_phone: '',
    commission_rate: '',
    notes: '',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        try {
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();

          if (error) throw error;

          setFormData({
            title: data.title || '',
            property_type: data.property_type || '',
            status: data.status || 'dang-ban',
            price: data.price || '',
            price_unit: data.price_unit || 'ty',
            area: data.area || '',
            bedrooms: data.bedrooms || '',
            bathrooms: data.bathrooms || '',
            floors: data.floors || '',
            direction: data.direction || '',
            address: data.address || '',
            ward: data.ward || '',
            district: data.district || '',
            city: data.city || 'Hồ Chí Minh',
            description: data.description || '',
            features: data.features || [],
            images: data.images || [],
            owner_name: data.owner_name || '',
            owner_phone: data.owner_phone || '',
            commission_rate: data.commission_rate || '',
            notes: data.notes || '',
          });
        } catch (error) {
          console.error('Error fetching property:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [isEdit, propertyId]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.property_type) {
      setToast({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc', type: 'error' });
      return;
    }

    setSaving(true);

    try {
      const propertyData = {
        user_id: user.id,
        title: formData.title,
        property_type: formData.property_type,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : null,
        price_unit: formData.price_unit,
        area: formData.area ? parseFloat(formData.area) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        floors: formData.floors ? parseInt(formData.floors) : null,
        direction: formData.direction || null,
        address: formData.address || null,
        ward: formData.ward || null,
        district: formData.district || null,
        city: formData.city,
        description: formData.description || null,
        features: formData.features,
        images: formData.images,
        owner_name: formData.owner_name || null,
        owner_phone: formData.owner_phone || null,
        commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
        notes: formData.notes || null,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);

        if (error) throw error;
        setToast({ message: 'Cập nhật BĐS thành công!', type: 'success' });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        setToast({ message: 'Thêm BĐS thành công!', type: 'success' });
      }

      setTimeout(() => onBack(), 1500);
    } catch (error) {
      console.error('Error saving property:', error);
      setToast({ message: 'Có lỗi xảy ra, vui lòng thử lại', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header
        title={isEdit ? '✏️ Sửa BĐS' : '➕ Thêm BĐS mới'}
        showProfile={false}
        onBack={onBack}
      />

      <form onSubmit={handleSubmit} className="p-4">
        {/* Images */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">📷 Hình ảnh</h3>
          <ImageUploader
            images={formData.images}
            onChange={(images) => setFormData({ ...formData, images })}
            userId={user.id}
          />
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">📋 Thông tin cơ bản</h3>

          <Input
            label="Tiêu đề"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="VD: Căn hộ 2PN view sông Sài Gòn"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Loại BĐS"
              value={formData.property_type}
              onChange={handleChange('property_type')}
              options={PROPERTY_TYPES}
              required
            />

            <Select
              label="Trạng thái"
              value={formData.status}
              onChange={handleChange('status')}
              options={PROPERTY_STATUS}
            />
          </div>
        </div>

        {/* Price & Area */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">💰 Giá & Diện tích</h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá"
              type="number"
              value={formData.price}
              onChange={handleChange('price')}
              placeholder="VD: 2.5"
            />

            <Select
              label="Đơn vị"
              value={formData.price_unit}
              onChange={handleChange('price_unit')}
              options={PRICE_UNITS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Diện tích (m²)"
              type="number"
              value={formData.area}
              onChange={handleChange('area')}
              placeholder="VD: 75"
            />

            <Select
              label="Hướng"
              value={formData.direction}
              onChange={handleChange('direction')}
              options={DIRECTIONS}
            />
          </div>
        </div>

        {/* Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">🏠 Chi tiết</h3>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Phòng ngủ"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange('bedrooms')}
              placeholder="2"
            />

            <Input
              label="Phòng tắm"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange('bathrooms')}
              placeholder="2"
            />

            <Input
              label="Số tầng"
              type="number"
              value={formData.floors}
              onChange={handleChange('floors')}
              placeholder="1"
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">📍 Vị trí</h3>

          <Input
            label="Địa chỉ"
            value={formData.address}
            onChange={handleChange('address')}
            placeholder="Số nhà, tên đường..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Quận/Huyện"
              value={formData.district}
              onChange={handleChange('district')}
              options={DISTRICTS_HCM.map(d => ({ value: d, label: d }))}
            />

            <Input
              label="Tỉnh/TP"
              value={formData.city}
              onChange={handleChange('city')}
              placeholder="Hồ Chí Minh"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">📝 Mô tả</h3>
          <Textarea
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Mô tả chi tiết về BĐS..."
            rows={4}
          />
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">✨ Tiện ích</h3>
          <FeaturesSelector
            selected={formData.features}
            onChange={(features) => setFormData({ ...formData, features })}
          />
        </div>

        {/* Owner Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">👤 Thông tin chủ nhà (Riêng tư)</h3>

          <Input
            label="Tên chủ nhà"
            value={formData.owner_name}
            onChange={handleChange('owner_name')}
            placeholder="Anh/Chị..."
          />

          <Input
            label="SĐT chủ nhà"
            value={formData.owner_phone}
            onChange={handleChange('owner_phone')}
            placeholder="0909..."
          />

          <Input
            label="Hoa hồng (%)"
            type="number"
            value={formData.commission_rate}
            onChange={handleChange('commission_rate')}
            placeholder="2"
          />

          <Textarea
            label="Ghi chú riêng"
            value={formData.notes}
            onChange={handleChange('notes')}
            placeholder="Ghi chú về chủ nhà, lịch xem nhà..."
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" loading={saving} className="w-full">
          💾 {isEdit ? 'Cập nhật BĐS' : 'Lưu BĐS'}
        </Button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PLACEHOLDER SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const HomeScreen = ({ onNavigate }) => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="🏠 Trang chủ" onNavigate={onNavigate} />

      <div className="p-4">
        <Card className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">
            Xin chào, {profile?.full_name || 'Môi giới'}! 👋
          </h2>
          <p className="text-slate-400">
            Chào mừng đến với Batdongsan.Digital
          </p>
        </Card>

        {/* Quick Actions */}
        <h3 className="text-lg font-semibold text-white mb-3">⚡ Truy cập nhanh</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="text-center py-4" onClick={() => onNavigate('add-property')}>
            <div className="text-2xl mb-1">🏠</div>
            <p className="text-white text-sm">Thêm BĐS</p>
          </Card>
          <Card className="text-center py-4" onClick={() => onNavigate('create-landing-page')}>
            <div className="text-2xl mb-1">🔗</div>
            <p className="text-white text-sm">Tạo LP</p>
          </Card>
          <Card className="text-center py-4" onClick={() => onNavigate('create-content')}>
            <div className="text-2xl mb-1">📱</div>
            <p className="text-white text-sm">Tạo Content</p>
          </Card>
          <Card className="text-center py-4" onClick={() => onNavigate('add-lead')}>
            <div className="text-2xl mb-1">👤</div>
            <p className="text-white text-sm">Thêm Lead</p>
          </Card>
        </div>

        {/* Profile & Agent Page */}
        <h3 className="text-lg font-semibold text-white mb-3">👤 Hồ sơ của bạn</h3>
        <Card className="mb-3" onClick={() => onNavigate('profile-settings')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl text-white font-bold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{profile?.full_name || 'Cập nhật hồ sơ'}</p>
              <p className="text-slate-400 text-sm">{profile?.phone || 'Thêm thông tin cá nhân'}</p>
            </div>
            <span className="text-slate-500">→</span>
          </div>
        </Card>

        <Card onClick={() => onNavigate('agent-page-builder')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl">🌐</div>
            <div className="flex-1">
              <p className="text-white font-medium">Trang cá nhân</p>
              <p className="text-slate-400 text-sm">
                {profile?.agent_page_slug ? `batdongsan.digital/agent/${profile.agent_page_slug}` : 'Tạo trang giới thiệu của bạn'}
              </p>
            </div>
            <span className="text-slate-500">→</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 2: LANDING PAGE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const CreateScreen = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="➕ Tạo mới" />
      <div className="p-4">
        <Card className="mb-4" onClick={() => onNavigate('create-landing-page')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-2xl">🔗</div>
            <div>
              <h3 className="text-lg font-semibold text-white">Tạo Landing Page</h3>
              <p className="text-slate-400 text-sm">Tạo trang giới thiệu BĐS chuyên nghiệp</p>
            </div>
          </div>
        </Card>
        <Card className="mb-4" onClick={() => onNavigate('create-content')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">📱</div>
            <div>
              <h3 className="text-lg font-semibold text-white">Tạo Content MXH</h3>
              <p className="text-slate-400 text-sm">AI viết content cho Facebook, Zalo, TikTok</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => onNavigate('add-property')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">🏠</div>
            <div>
              <h3 className="text-lg font-semibold text-white">Thêm BĐS mới</h3>
              <p className="text-slate-400 text-sm">Thêm BĐS vào kho hàng</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const LandingPagesListScreen = ({ onNavigate, onBack }) => {
  const { user } = useAuth();
  const [landingPages, setLandingPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPages = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*, property:properties(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setLandingPages(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingPages();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="🔗 Landing Pages" onBack={onBack} />
      <div className="p-4">
        <Button onClick={() => onNavigate('create-landing-page')} className="w-full mb-4">
          + Tạo Landing Page mới
        </Button>
        {landingPages.length === 0 ? (
          <EmptyState
            icon="🔗"
            title="Chưa có Landing Page"
            description="Tạo landing page đầu tiên để quảng bá BĐS"
          />
        ) : (
          landingPages.map(lp => (
            <Card key={lp.id} className="mb-3" onClick={() => onNavigate('landing-page-detail', lp.id)}>
              <div className="flex gap-3">
                {lp.property?.images?.[0] ? (
                  <img src={lp.property.images[0]} alt={lp.property.title || 'Hình BĐS'} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">🏠</div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-semibold line-clamp-1">{lp.custom_title || lp.property?.title}</h3>
                  <p className="text-slate-400 text-sm">/{lp.slug}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-slate-500">👁 {lp.view_count || 0}</span>
                    <span className="text-xs text-slate-500">📞 {lp.lead_count || 0}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const CreateLandingPageScreen = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal-1');
  const [formData, setFormData] = useState({
    custom_title: '',
    custom_description: '',
    custom_cta_text: 'Liên hệ ngay',
    custom_cta_phone: '',
    slug: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'dang-ban')
        .order('created_at', { ascending: false });
      setProperties(data || []);
    };
    fetchProperties();
  }, [user]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 30) + '-' + Math.random().toString(36).substring(2, 6);
  };

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    setFormData({
      ...formData,
      custom_title: property.title,
      custom_cta_phone: property.owner_phone || '',
      slug: generateSlug(property.title),
    });
    setStep(2);
  };

  const handleSave = async () => {
    if (!selectedProperty || !formData.slug) return;
    setSaving(true);
    try {
      // Tạo landing page
      const { error } = await supabase.from('landing_pages').insert({
        user_id: user.id,
        property_id: selectedProperty.id,
        template_id: selectedTemplate,
        slug: formData.slug,
        custom_title: formData.custom_title,
        custom_description: formData.custom_description,
        custom_cta_text: formData.custom_cta_text,
        custom_cta_phone: formData.custom_cta_phone,
      });
      if (error) throw error;

      // Lưu link landing page vào property
      const landingPageUrl = `https://batdongsan.digital/p/${formData.slug}`;
      await supabase
        .from('properties')
        .update({ landing_page_url: landingPageUrl })
        .eq('id', selectedProperty.id);

      setToast({ message: 'Tạo Landing Page thành công!', type: 'success' });
      setTimeout(() => onBack(), 1500);
    } catch (error) {
      setToast({ message: 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title={`Tạo Landing Page (${step}/4)`} onBack={onBack} showProfile={false} />
      <div className="p-4">
        {/* Step indicators */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 h-1 rounded ${s <= step ? 'bg-amber-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Chọn BĐS</h2>
            {properties.length === 0 ? (
              <EmptyState icon="📦" title="Chưa có BĐS" description="Thêm BĐS trước khi tạo Landing Page" />
            ) : (
              properties.map(p => (
                <Card key={p.id} className="mb-3" onClick={() => handleSelectProperty(p)}>
                  <div className="flex gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title || 'Hình BĐS'} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">🏠</div>
                    )}
                    <div>
                      <h3 className="text-white font-semibold line-clamp-1">{p.title}</h3>
                      <p className="text-amber-500 text-sm">{formatPrice(p.price, p.price_unit)}</p>
                      <p className="text-slate-400 text-xs">{p.district}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Chọn Template</h2>
            <div className="grid grid-cols-2 gap-3">
              {LANDING_TEMPLATES.map(t => (
                <Card
                  key={t.id}
                  className={`text-center py-4 ${selectedTemplate === t.id ? 'border-amber-500' : ''}`}
                  onClick={() => setSelectedTemplate(t.id)}
                >
                  <div className="w-10 h-10 rounded-lg mx-auto mb-2" style={{ backgroundColor: t.color }} />
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  {selectedTemplate === t.id && <span className="text-amber-500 text-xs">✓ Đã chọn</span>}
                </Card>
              ))}
            </div>
            <Button onClick={() => setStep(3)} className="w-full mt-4">Tiếp tục</Button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Tùy chỉnh nội dung</h2>
            <Input
              label="Tiêu đề"
              value={formData.custom_title}
              onChange={(e) => setFormData({ ...formData, custom_title: e.target.value })}
              placeholder="Tiêu đề landing page"
            />
            <Textarea
              label="Mô tả ngắn"
              value={formData.custom_description}
              onChange={(e) => setFormData({ ...formData, custom_description: e.target.value })}
              placeholder="Mô tả hấp dẫn về BĐS..."
              rows={3}
            />
            <Input
              label="Nút CTA"
              value={formData.custom_cta_text}
              onChange={(e) => setFormData({ ...formData, custom_cta_text: e.target.value })}
              placeholder="Liên hệ ngay"
            />
            <Input
              label="SĐT liên hệ"
              value={formData.custom_cta_phone}
              onChange={(e) => setFormData({ ...formData, custom_cta_phone: e.target.value })}
              placeholder="0909..."
            />
            <Button onClick={() => setStep(4)} className="w-full mt-4">Tiếp tục</Button>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Đường dẫn & Xuất bản</h2>
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-medium mb-2">Đường dẫn</label>
              <div className="flex items-center bg-slate-800 border border-slate-600 rounded-xl overflow-hidden">
                <span className="px-3 text-slate-500 text-sm">batdongsan.digital/p/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="flex-1 bg-transparent px-2 py-3 text-white focus:outline-none"
                />
              </div>
            </div>
            <Card className="mb-4">
              <h3 className="text-white font-semibold mb-2">Xem trước</h3>
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <p className="text-amber-500 font-semibold">{formData.custom_title}</p>
                <p className="text-slate-400 text-sm mt-1">{selectedProperty?.district}</p>
                <p className="text-white mt-2">{formatPrice(selectedProperty?.price, selectedProperty?.price_unit)}</p>
              </div>
            </Card>
            <Button onClick={handleSave} loading={saving} className="w-full">
              🚀 Xuất bản Landing Page
            </Button>
          </>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 3: CONTENT MANAGER SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const ContentScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: props } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'dang-ban')
        .limit(5);
      setProperties(props || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="📱 Content Factory" />
      <div className="p-4">
        {/* Quick Actions */}
        <h3 className="text-lg font-semibold text-white mb-3">Tạo content nhanh</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {PLATFORMS.map(p => (
            <Card key={p.id} className="text-center py-4" onClick={() => onNavigate('create-content', { platform: p.id })}>
              <div className="text-2xl mb-1">{p.icon}</div>
              <p className="text-white text-sm">{p.name}</p>
            </Card>
          ))}
        </div>

        {/* Recent Properties */}
        <h3 className="text-lg font-semibold text-white mb-3">BĐS có thể tạo content</h3>
        {properties.length === 0 ? (
          <Card className="text-center py-6">
            <p className="text-slate-400">Thêm BĐS để bắt đầu tạo content</p>
          </Card>
        ) : (
          properties.map(p => (
            <Card key={p.id} className="mb-3" onClick={() => onNavigate('create-content', { propertyId: p.id })}>
              <div className="flex gap-3">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title || 'Hình BĐS'} className="w-14 h-14 rounded-lg object-cover" />
                ) : (
                  <div className="w-14 h-14 bg-slate-700 rounded-lg flex items-center justify-center">🏠</div>
                )}
                <div className="flex-1">
                  <h4 className="text-white font-medium line-clamp-1">{p.title}</h4>
                  <p className="text-amber-500 text-sm">{formatPrice(p.price, p.price_unit)}</p>
                </div>
                <Button variant="ghost" size="sm">Tạo →</Button>
              </div>
            </Card>
          ))
        )}

        <Button onClick={() => onNavigate('create-content')} className="w-full mt-4">
          ✨ Tạo content mới với AI
        </Button>
      </div>
    </div>
  );
};

const CreateContentScreen = ({ onBack, params }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState(params?.platform || 'facebook');
  const [contentType, setContentType] = useState('post');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setProperties(data || []);
      if (params?.propertyId) {
        setSelectedProperty(data?.find(p => p.id === params.propertyId) || null);
        setStep(2);
      }
    };
    fetchProperties();
  }, [user, params]);

  const generateContent = async () => {
    if (!selectedProperty) return;
    setGenerating(true);

    // Simulate AI generation with template-based content
    const templates = {
      facebook: {
        post: `🏠 ${selectedProperty.title}\n\n📍 Vị trí: ${selectedProperty.district}, ${selectedProperty.city}\n💰 Giá: ${formatPrice(selectedProperty.price, selectedProperty.price_unit)}\n📐 Diện tích: ${selectedProperty.area || 'Liên hệ'}m²\n🛏️ Phòng ngủ: ${selectedProperty.bedrooms || 'Liên hệ'}\n\n${selectedProperty.description || 'BĐS đẹp, vị trí thuận tiện, giá tốt!'}\n\n✨ Tiện ích: ${selectedProperty.features?.join(', ') || 'Đầy đủ tiện nghi'}\n\n📞 Liên hệ ngay để được tư vấn!\n\n#bds #batdongsan #${selectedProperty.district?.replace(/\s/g, '').toLowerCase() || 'hcm'}`,
        story: `🔥 HOT! ${selectedProperty.title}\n💰 ${formatPrice(selectedProperty.price, selectedProperty.price_unit)}\n📍 ${selectedProperty.district}\n\nSwipe up để xem chi tiết! 👆`,
        carousel: `Slide 1: 🏠 ${selectedProperty.title}\n\nSlide 2: 📍 ${selectedProperty.district}, ${selectedProperty.city}\n\nSlide 3: 💰 ${formatPrice(selectedProperty.price, selectedProperty.price_unit)} - ${selectedProperty.area}m²\n\nSlide 4: ✨ ${selectedProperty.features?.slice(0, 3).join(' • ') || 'Tiện ích đầy đủ'}\n\nSlide 5: 📞 Liên hệ ngay!`,
      },
      zalo: {
        post: `🏠 ${selectedProperty.title}\n\n📍 ${selectedProperty.district}\n💰 ${formatPrice(selectedProperty.price, selectedProperty.price_unit)}\n📐 ${selectedProperty.area}m² | 🛏️ ${selectedProperty.bedrooms} PN\n\nLiên hệ em để xem nhà ạ! 🙏`,
        story: `${selectedProperty.title}\n${formatPrice(selectedProperty.price, selectedProperty.price_unit)}\nChat ngay! 💬`,
      },
      tiktok: {
        script: `[HOOK - 3s]\n"Căn nhà ${formatPrice(selectedProperty.price, selectedProperty.price_unit)} ở ${selectedProperty.district} có gì hot?"\n\n[CONTENT - 15s]\n- Diện tích ${selectedProperty.area}m²\n- ${selectedProperty.bedrooms} phòng ngủ rộng rãi\n- ${selectedProperty.features?.[0] || 'Nội thất cao cấp'}\n- Vị trí đắc địa\n\n[CTA - 3s]\n"Comment SĐT để được tư vấn FREE!"\n\n#batdongsan #nhadep #${selectedProperty.district?.replace(/\s/g, '').toLowerCase() || 'hcm'}`,
        caption: `${selectedProperty.title} 🏠\n💰 ${formatPrice(selectedProperty.price, selectedProperty.price_unit)}\n📍 ${selectedProperty.district}\n\nComment "QUAN TÂM" để nhận thông tin chi tiết! 👇\n\n#fyp #batdongsan #nhadep #review`,
      },
    };

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    setGeneratedContent(templates[platform]?.[contentType] || 'Nội dung được tạo bởi AI...');
    setGenerating(false);
    setStep(3);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setToast({ message: 'Đã copy nội dung!', type: 'success' });
  };

  const platformInfo = PLATFORMS.find(p => p.id === platform);
  const types = CONTENT_TYPES[platform] || [];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="✨ Tạo Content AI" onBack={onBack} showProfile={false} />
      <div className="p-4">
        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1 rounded ${s <= step ? 'bg-amber-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Chọn nền tảng & loại content</h2>

            <h3 className="text-slate-300 text-sm mb-2">Nền tảng</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PLATFORMS.map(p => (
                <Card
                  key={p.id}
                  className={`text-center py-3 ${platform === p.id ? 'border-amber-500' : ''}`}
                  onClick={() => { setPlatform(p.id); setContentType(CONTENT_TYPES[p.id]?.[0]?.id || 'post'); }}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <p className="text-white text-xs">{p.name}</p>
                </Card>
              ))}
            </div>

            <h3 className="text-slate-300 text-sm mb-2">Loại content</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {types.map(t => (
                <button
                  key={t.id}
                  onClick={() => setContentType(t.id)}
                  className={`px-4 py-2 rounded-xl text-sm ${contentType === t.id ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>

            <h3 className="text-slate-300 text-sm mb-2">Chọn BĐS</h3>
            {properties.map(p => (
              <Card
                key={p.id}
                className={`mb-2 ${selectedProperty?.id === p.id ? 'border-amber-500' : ''}`}
                onClick={() => setSelectedProperty(p)}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.title || 'Hình BĐS'} className="w-full h-full object-cover" /> : '🏠'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium line-clamp-1">{p.title}</p>
                    <p className="text-slate-400 text-sm">{formatPrice(p.price, p.price_unit)}</p>
                  </div>
                  {selectedProperty?.id === p.id && <span className="text-amber-500">✓</span>}
                </div>
              </Card>
            ))}

            <Button onClick={() => setStep(2)} disabled={!selectedProperty} className="w-full mt-4">
              Tiếp tục
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Tạo nội dung với AI</h2>

            <Card className="mb-4">
              <div className="flex gap-3 items-center">
                <div className="text-2xl">{platformInfo?.icon}</div>
                <div>
                  <p className="text-white font-medium">{platformInfo?.name} - {types.find(t => t.id === contentType)?.name}</p>
                  <p className="text-slate-400 text-sm">{selectedProperty?.title}</p>
                </div>
              </div>
            </Card>

            <Card className="mb-4 text-center py-8">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-white font-medium mb-2">AI sẽ viết content cho bạn</p>
              <p className="text-slate-400 text-sm mb-4">
                Dựa trên thông tin BĐS: {selectedProperty?.title}
              </p>
            </Card>

            <Button onClick={generateContent} loading={generating} className="w-full">
              ✨ Tạo content với AI
            </Button>
            <Button variant="ghost" onClick={() => setStep(1)} className="w-full mt-2">
              ← Quay lại
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Nội dung đã tạo</h2>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{platformInfo?.icon}</span>
              <span className="text-white">{platformInfo?.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-sm">{generatedContent.length} ký tự</span>
            </div>

            <Card className="mb-4">
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="w-full bg-transparent text-white text-sm resize-none focus:outline-none"
                rows={12}
              />
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={copyToClipboard}>
                📋 Copy
              </Button>
              <Button onClick={() => { setStep(2); setGeneratedContent(''); }}>
                🔄 Tạo lại
              </Button>
            </div>

            <Card className="mt-4 text-center py-4">
              <p className="text-slate-400 text-sm mb-2">Giờ vàng đăng bài</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {GOLDEN_HOURS.map(h => (
                  <span key={h.time} className="bg-slate-700 px-3 py-1 rounded-full text-xs text-white">
                    {h.label}
                  </span>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 4: AGENT PROFILE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const ProfileSettingsScreen = ({ onBack }) => {
  const { user, profile, fetchProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    bio: profile?.bio || '',
    experience_years: profile?.experience_years || 0,
    specialization: profile?.specialization || [],
    areas: profile?.areas || [],
    social_links: profile?.social_links || {},
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
      if (error) throw error;
      await fetchProfile(user.id);
      setToast({ message: 'Đã lưu thông tin!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialization = (type) => {
    const specs = formData.specialization || [];
    if (specs.includes(type)) {
      setFormData({ ...formData, specialization: specs.filter(s => s !== type) });
    } else {
      setFormData({ ...formData, specialization: [...specs, type] });
    }
  };

  const toggleArea = (area) => {
    const areas = formData.areas || [];
    if (areas.includes(area)) {
      setFormData({ ...formData, areas: areas.filter(a => a !== area) });
    } else {
      setFormData({ ...formData, areas: [...areas, area] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="👤 Hồ sơ cá nhân" onBack={onBack} showProfile={false} />
      <div className="p-4">
        {/* Avatar */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-amber-500 rounded-full flex items-center justify-center text-3xl text-white font-bold mb-2">
            {formData.full_name?.charAt(0) || 'U'}
          </div>
          <p className="text-slate-400 text-sm">Ảnh đại diện</p>
        </div>

        {/* Basic Info */}
        <h3 className="text-lg font-semibold text-white mb-3">📋 Thông tin cơ bản</h3>
        <Input
          label="Họ và tên"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Nguyễn Văn A"
        />
        <Input
          label="Số điện thoại"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="0909..."
        />
        <Input
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
        />
        <Input
          label="Số năm kinh nghiệm"
          type="number"
          value={formData.experience_years}
          onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
          placeholder="5"
        />

        {/* Bio */}
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">📝 Giới thiệu bản thân</h3>
        <Textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tôi là chuyên viên tư vấn BĐS với nhiều năm kinh nghiệm..."
          rows={4}
        />

        {/* Specialization */}
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">🏠 Chuyên môn</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {PROPERTY_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => toggleSpecialization(t.value)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                formData.specialization?.includes(t.value)
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Areas */}
        <h3 className="text-lg font-semibold text-white mb-3">📍 Khu vực hoạt động</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {DISTRICTS_HCM.slice(0, 12).map(d => (
            <button
              key={d}
              onClick={() => toggleArea(d)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                formData.areas?.includes(d)
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Social Links */}
        <h3 className="text-lg font-semibold text-white mb-3">🔗 Mạng xã hội</h3>
        <Input
          label="Facebook"
          value={formData.social_links?.facebook || ''}
          onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, facebook: e.target.value } })}
          placeholder="https://fb.com/..."
        />
        <Input
          label="Zalo"
          value={formData.social_links?.zalo || ''}
          onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, zalo: e.target.value } })}
          placeholder="SĐT Zalo"
        />
        <Input
          label="TikTok"
          value={formData.social_links?.tiktok || ''}
          onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, tiktok: e.target.value } })}
          placeholder="@username"
        />

        <Button onClick={handleSave} loading={saving} className="w-full mt-4">
          💾 Lưu thông tin
        </Button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const AgentPageBuilderScreen = ({ onBack }) => {
  const { user, profile, fetchProfile } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(profile?.agent_page_template || 'card-style');
  const [slug, setSlug] = useState(profile?.agent_page_slug || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [published, setPublished] = useState(!!profile?.agent_page_slug);

  const generateSlug = () => {
    const base = (profile?.full_name || 'agent')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return base + '-' + Math.random().toString(36).substring(2, 6);
  };

  const handlePublish = async () => {
    if (!slug) {
      setSlug(generateSlug());
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          agent_page_slug: slug,
          agent_page_template: selectedTemplate,
        })
        .eq('id', user.id);
      if (error) throw error;
      await fetchProfile(user.id);
      setPublished(true);
      setToast({ message: 'Đã xuất bản trang cá nhân!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`batdongsan.digital/agent/${slug}`);
    setToast({ message: 'Đã copy link!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="🌐 Trang cá nhân" onBack={onBack} showProfile={false} />
      <div className="p-4">
        {/* Template Selection */}
        <h3 className="text-lg font-semibold text-white mb-3">🎨 Chọn template</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {AGENT_TEMPLATES.map(t => (
            <Card
              key={t.id}
              className={`text-center py-4 ${selectedTemplate === t.id ? 'border-amber-500' : ''}`}
              onClick={() => setSelectedTemplate(t.id)}
            >
              <div className="text-2xl mb-2">
                {t.id === 'card-style' ? '💳' : t.id === 'full-page' ? '📄' : t.id === 'portfolio-style' ? '🖼️' : t.id === 'modern-dark' ? '🌙' : '☀️'}
              </div>
              <p className="text-white text-sm font-medium">{t.name}</p>
              <p className="text-slate-400 text-xs mt-1">{t.description}</p>
              {selectedTemplate === t.id && <span className="text-amber-500 text-xs">✓</span>}
            </Card>
          ))}
        </div>

        {/* Slug */}
        <h3 className="text-lg font-semibold text-white mb-3">🔗 Đường dẫn</h3>
        <div className="flex items-center bg-slate-800 border border-slate-600 rounded-xl overflow-hidden mb-2">
          <span className="px-3 text-slate-500 text-sm">batdongsan.digital/agent/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="ten-cua-ban"
            className="flex-1 bg-transparent px-2 py-3 text-white focus:outline-none"
          />
        </div>
        {!slug && (
          <button onClick={() => setSlug(generateSlug())} className="text-amber-500 text-sm mb-4">
            ✨ Tạo tự động
          </button>
        )}

        {/* Preview Card */}
        <Card className="mb-4 text-center py-6">
          <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center text-2xl text-white font-bold mb-3">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <h4 className="text-white font-semibold">{profile?.full_name || 'Tên của bạn'}</h4>
          <p className="text-slate-400 text-sm">Chuyên viên tư vấn BĐS</p>
          {profile?.experience_years > 0 && (
            <p className="text-amber-500 text-sm mt-1">⭐ {profile.experience_years} năm kinh nghiệm</p>
          )}
        </Card>

        {/* Actions */}
        {published ? (
          <>
            <Card className="mb-4 text-center py-4 bg-green-900/30 border-green-500">
              <p className="text-green-400 font-medium">✅ Trang đã được xuất bản</p>
              <p className="text-slate-400 text-sm mt-1">batdongsan.digital/agent/{slug}</p>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={copyLink}>📋 Copy link</Button>
              <Button onClick={handlePublish} loading={saving}>🔄 Cập nhật</Button>
            </div>
          </>
        ) : (
          <Button onClick={handlePublish} loading={saving} className="w-full">
            🚀 Xuất bản trang cá nhân
          </Button>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         PHASE 5: CRM SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

const CRMScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, today: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: total } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: thisWeek } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      const { count: todayCount } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      setStats({ total: total || 0, thisWeek: thisWeek || 0, today: todayCount || 0 });

      // Get recent leads
      const { data: leads } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentLeads(leads || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getSourceInfo = (source) => LEAD_SOURCES.find(s => s.id === source) || LEAD_SOURCES[5];
  const getStageInfo = (status) => DEFAULT_PIPELINE_STAGES.find(s => s.id === status) || DEFAULT_PIPELINE_STAGES[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="👤 CRM" />
      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-slate-400 text-xs">Tổng leads</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-amber-500">{stats.thisWeek}</p>
            <p className="text-slate-400 text-xs">Tuần này</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-green-500">{stats.today}</p>
            <p className="text-slate-400 text-xs">Hôm nay</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="secondary" onClick={() => onNavigate('pipeline')} className="py-4">
            📊 Pipeline
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('leads-list')} className="py-4">
            📋 Danh sách
          </Button>
        </div>

        {/* Recent Leads */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">🆕 Leads gần đây</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('add-lead')}>
            + Thêm
          </Button>
        </div>

        {recentLeads.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-4xl mb-2">👤</div>
            <p className="text-slate-400">Chưa có lead nào</p>
            <Button onClick={() => onNavigate('add-lead')} className="mt-4">
              + Thêm lead đầu tiên
            </Button>
          </Card>
        ) : (
          recentLeads.map(lead => {
            const source = getSourceInfo(lead.source);
            const stage = getStageInfo(lead.status);
            return (
              <Card key={lead.id} className="mb-3" onClick={() => onNavigate('lead-detail', lead.id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{lead.name}</h4>
                      <span className="text-sm">{source.icon}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{lead.phone}</p>
                    {lead.budget_min && (
                      <p className="text-amber-500 text-sm">{lead.budget_min}-{lead.budget_max} tỷ</p>
                    )}
                  </div>
                  <Badge color={stage.color}>{stage.name}</Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

const PipelineScreen = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      const grouped = {};
      DEFAULT_PIPELINE_STAGES.forEach(stage => {
        grouped[stage.id] = [];
      });
      data?.forEach(lead => {
        if (grouped[lead.status]) {
          grouped[lead.status].push(lead);
        } else {
          grouped['lead'] = grouped['lead'] || [];
          grouped['lead'].push(lead);
        }
      });
      setLeads(grouped);
      setLoading(false);
    };
    fetchLeads();
  }, [user]);

  const moveLeadToStage = async (leadId, newStage) => {
    await supabase
      .from('crm_leads')
      .update({ status: newStage })
      .eq('id', leadId);

    // Refresh
    const updatedLeads = { ...leads };
    let movedLead = null;

    for (const stage in updatedLeads) {
      const idx = updatedLeads[stage].findIndex(l => l.id === leadId);
      if (idx !== -1) {
        movedLead = updatedLeads[stage].splice(idx, 1)[0];
        break;
      }
    }

    if (movedLead) {
      movedLead.status = newStage;
      updatedLeads[newStage] = updatedLeads[newStage] || [];
      updatedLeads[newStage].unshift(movedLead);
      setLeads(updatedLeads);
    }
  };

  const getSourceInfo = (source) => LEAD_SOURCES.find(s => s.id === source) || LEAD_SOURCES[5];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="📊 Pipeline" onBack={onBack} showProfile={false} />
      <div className="p-4">
        <p className="text-slate-400 text-sm mb-4">← Vuốt để xem các cột →</p>
      </div>
      <div className="overflow-x-auto pb-20">
        <div className="flex gap-3 px-4" style={{ minWidth: 'max-content' }}>
          {DEFAULT_PIPELINE_STAGES.map(stage => (
            <div key={stage.id} className="w-64 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-white font-medium">{stage.name}</span>
                <span className="text-slate-500 text-sm">({leads[stage.id]?.length || 0})</span>
              </div>
              <div className="space-y-2 min-h-[200px] bg-slate-800/50 rounded-xl p-2">
                {leads[stage.id]?.map(lead => {
                  const source = getSourceInfo(lead.source);
                  return (
                    <Card
                      key={lead.id}
                      className="cursor-pointer"
                      onClick={() => onNavigate('lead-detail', lead.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">{lead.name}</p>
                          <p className="text-slate-400 text-xs">{lead.phone}</p>
                        </div>
                        <span>{source.icon}</span>
                      </div>
                      {/* Quick move buttons */}
                      <div className="flex gap-1 mt-2 overflow-x-auto">
                        {DEFAULT_PIPELINE_STAGES.filter(s => s.id !== stage.id).slice(0, 3).map(s => (
                          <button
                            key={s.id}
                            onClick={(e) => { e.stopPropagation(); moveLeadToStage(lead.id, s.id); }}
                            className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 whitespace-nowrap"
                          >
                            → {s.name}
                          </button>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LeadsListScreen = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, [user]);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         l.phone?.includes(searchQuery);
    const matchesFilter = filterSource === 'all' || l.source === filterSource;
    return matchesSearch && matchesFilter;
  });

  const getSourceInfo = (source) => LEAD_SOURCES.find(s => s.id === source) || LEAD_SOURCES[5];
  const getStageInfo = (status) => DEFAULT_PIPELINE_STAGES.find(s => s.id === status) || DEFAULT_PIPELINE_STAGES[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="📋 Danh sách leads" onBack={onBack} showProfile={false} />
      <div className="p-4">
        <Button onClick={() => onNavigate('add-lead')} className="w-full mb-4">
          + Thêm lead mới
        </Button>

        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Tìm theo tên, SĐT..." />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setFilterSource('all')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filterSource === 'all' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Tất cả
          </button>
          {LEAD_SOURCES.map(s => (
            <button
              key={s.id}
              onClick={() => setFilterSource(s.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filterSource === s.id ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        {filteredLeads.length === 0 ? (
          <EmptyState icon="👤" title="Không có lead" description="Thêm lead mới hoặc thay đổi bộ lọc" />
        ) : (
          filteredLeads.map(lead => {
            const source = getSourceInfo(lead.source);
            const stage = getStageInfo(lead.status);
            return (
              <Card key={lead.id} className="mb-3" onClick={() => onNavigate('lead-detail', lead.id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{lead.name}</h4>
                      <span>{source.icon}</span>
                    </div>
                    <p className="text-slate-400 text-sm">📞 {lead.phone}</p>
                    {lead.budget_min && (
                      <p className="text-amber-500 text-sm">💰 {lead.budget_min}-{lead.budget_max} tỷ</p>
                    )}
                    {lead.property_types_interest?.length > 0 && (
                      <p className="text-slate-500 text-xs mt-1">
                        {lead.property_types_interest.map(t => PROPERTY_TYPES.find(pt => pt.value === t)?.label).join(', ')}
                      </p>
                    )}
                  </div>
                  <Badge color={stage.color}>{stage.name}</Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

const AddLeadScreen = ({ onBack }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'facebook',
    source_detail: '',
    budget_min: '',
    budget_max: '',
    property_types_interest: [],
    areas_interest: [],
    notes: '',
  });

  const togglePropertyType = (type) => {
    const types = formData.property_types_interest || [];
    if (types.includes(type)) {
      setFormData({ ...formData, property_types_interest: types.filter(t => t !== type) });
    } else {
      setFormData({ ...formData, property_types_interest: [...types, type] });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      setToast({ message: 'Vui lòng điền họ tên và SĐT', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_leads').insert({
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        source: formData.source,
        source_detail: formData.source_detail || null,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        property_types_interest: formData.property_types_interest,
        areas_interest: formData.areas_interest,
        notes: formData.notes || null,
        status: 'lead',
      });
      if (error) throw error;
      setToast({ message: 'Thêm lead thành công!', type: 'success' });
      setTimeout(onBack, 1500);
    } catch (error) {
      setToast({ message: 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="➕ Thêm lead" onBack={onBack} showProfile={false} />
      <div className="p-4">
        {/* Contact */}
        <h3 className="text-lg font-semibold text-white mb-3">👤 Thông tin liên hệ</h3>
        <Input
          label="Họ tên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nguyễn Văn A"
          required
        />
        <Input
          label="Số điện thoại"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="0909..."
          required
        />
        <Input
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
        />

        {/* Source */}
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">📍 Nguồn khách hàng</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {LEAD_SOURCES.map(s => (
            <button
              key={s.id}
              onClick={() => setFormData({ ...formData, source: s.id })}
              className={`px-3 py-2 rounded-xl text-sm ${
                formData.source === s.id ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <Input
          label="Chi tiết nguồn"
          value={formData.source_detail}
          onChange={(e) => setFormData({ ...formData, source_detail: e.target.value })}
          placeholder="Link post, chiến dịch..."
        />

        {/* Budget */}
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">💰 Ngân sách</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Từ (tỷ)"
            type="number"
            value={formData.budget_min}
            onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
            placeholder="2"
          />
          <Input
            label="Đến (tỷ)"
            type="number"
            value={formData.budget_max}
            onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
            placeholder="5"
          />
        </div>

        {/* Interest */}
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">🏠 Quan tâm loại BĐS</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {PROPERTY_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => togglePropertyType(t.value)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                formData.property_types_interest?.includes(t.value)
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Notes */}
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">📝 Ghi chú</h3>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Ghi chú về khách..."
          rows={3}
        />

        <Button onClick={handleSave} loading={saving} className="w-full mt-6">
          💾 Lưu lead
        </Button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const LeadDetailScreen = ({ leadId, onBack, onNavigate }) => {
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: leadData } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      setLead(leadData);

      const { data: activitiesData } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      setActivities(activitiesData || []);
      setLoading(false);
    };
    fetchData();
  }, [leadId]);

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from('crm_leads').delete().eq('id', leadId);
    onBack();
  };

  const updateStatus = async (newStatus) => {
    await supabase
      .from('crm_leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    setLead({ ...lead, status: newStatus });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <EmptyState icon="❌" title="Không tìm thấy" description="Lead không tồn tại" action={<Button onClick={onBack}>Quay lại</Button>} />
      </div>
    );
  }

  const source = LEAD_SOURCES.find(s => s.id === lead.source) || LEAD_SOURCES[5];
  const stage = DEFAULT_PIPELINE_STAGES.find(s => s.id === lead.status) || DEFAULT_PIPELINE_STAGES[0];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white text-xl">←</button>
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(true)}>🗑️</Button>
        </div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full flex items-center justify-center text-3xl mb-3">
            👤
          </div>
          <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span>{source.icon}</span>
            <span className="text-slate-400">{source.name}</span>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button variant="secondary" onClick={() => window.open(`tel:${lead.phone}`)}>📞 Gọi</Button>
          <Button variant="secondary" onClick={() => window.open(`https://zalo.me/${lead.phone}`)}>💬 Zalo</Button>
          <Button variant="secondary" onClick={() => lead.email && window.open(`mailto:${lead.email}`)}>✉️ Email</Button>
        </div>

        {/* Info */}
        <Card className="mb-4">
          <h3 className="text-white font-semibold mb-3">📋 Thông tin</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">SĐT</span>
              <span className="text-white">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-white">{lead.email}</span>
              </div>
            )}
            {lead.budget_min && (
              <div className="flex justify-between">
                <span className="text-slate-400">Ngân sách</span>
                <span className="text-amber-500">{lead.budget_min}-{lead.budget_max} tỷ</span>
              </div>
            )}
            {lead.property_types_interest?.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Quan tâm</span>
                <span className="text-white">
                  {lead.property_types_interest.map(t => PROPERTY_TYPES.find(pt => pt.value === t)?.label).join(', ')}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Status */}
        <Card className="mb-4">
          <h3 className="text-white font-semibold mb-3">🏷️ Trạng thái</h3>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_PIPELINE_STAGES.map(s => (
              <button
                key={s.id}
                onClick={() => updateStatus(s.id)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  lead.status === s.id
                    ? 'text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
                style={lead.status === s.id ? { backgroundColor: s.color } : {}}
              >
                {s.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Notes */}
        {lead.notes && (
          <Card className="mb-4">
            <h3 className="text-white font-semibold mb-2">📝 Ghi chú</h3>
            <p className="text-slate-300 text-sm">{lead.notes}</p>
          </Card>
        )}

        {/* Activities */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold">📅 Hoạt động</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('add-activity', leadId)}>
              + Thêm
            </Button>
          </div>
          {activities.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Chưa có hoạt động</p>
          ) : (
            <div className="space-y-3">
              {activities.map(a => {
                const type = ACTIVITY_TYPES.find(t => t.id === a.activity_type) || ACTIVITY_TYPES[3];
                return (
                  <div key={a.id} className="flex gap-3 pb-3 border-b border-slate-700 last:border-0">
                    <div className="text-xl">{type.icon}</div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{a.description}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(a.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa lead?"
        message="Bạn có chắc muốn xóa lead này?"
        loading={deleting}
      />
    </div>
  );
};

const AddActivityScreen = ({ leadId, onBack }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    activity_type: 'call',
    description: '',
    scheduled_at: '',
  });

  const handleSave = async () => {
    if (!formData.description) {
      setToast({ message: 'Vui lòng nhập nội dung', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_activities').insert({
        user_id: user.id,
        lead_id: leadId,
        activity_type: formData.activity_type,
        description: formData.description,
        scheduled_at: formData.scheduled_at || null,
      });
      if (error) throw error;
      setToast({ message: 'Đã thêm hoạt động!', type: 'success' });
      setTimeout(onBack, 1500);
    } catch (error) {
      setToast({ message: 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="➕ Thêm hoạt động" onBack={onBack} showProfile={false} />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-3">📋 Loại hoạt động</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ACTIVITY_TYPES.map(t => (
            <Card
              key={t.id}
              className={`text-center py-4 ${formData.activity_type === t.id ? 'border-amber-500' : ''}`}
              onClick={() => setFormData({ ...formData, activity_type: t.id })}
            >
              <div className="text-2xl mb-1">{t.icon}</div>
              <p className="text-white text-sm">{t.name}</p>
            </Card>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mb-3">📝 Nội dung</h3>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Mô tả hoạt động..."
          rows={4}
        />

        <h3 className="text-lg font-semibold text-white mb-3 mt-6">⏰ Nhắc nhở (tùy chọn)</h3>
        <Input
          type="datetime-local"
          value={formData.scheduled_at}
          onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
        />

        <Button onClick={handleSave} loading={saving} className="w-full mt-6">
          💾 Lưu hoạt động
        </Button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('properties');
  const [screen, setScreen] = useState({ name: 'list', params: null });

  // Handle navigation
  const navigate = (screenName, params = null) => {
    setScreen({ name: screenName, params });
  };

  const goBack = () => {
    setScreen({ name: 'list', params: null });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏠</div>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Auth screens
  if (!user) {
    switch (authScreen) {
      case 'register':
        return <RegisterScreen onNavigate={setAuthScreen} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onNavigate={setAuthScreen} />;
      default:
        return <LoginScreen onNavigate={setAuthScreen} />;
    }
  }

  // Main app - render screens
  const renderScreen = () => {
    // Property screens
    if (screen.name === 'property-detail') {
      return <PropertyDetailScreen propertyId={screen.params} onNavigate={navigate} onBack={goBack} />;
    }
    if (screen.name === 'add-property') {
      return <PropertyFormScreen onBack={goBack} />;
    }
    if (screen.name === 'edit-property') {
      return <PropertyFormScreen propertyId={screen.params} onBack={goBack} />;
    }

    // Phase 2: Landing Page screens
    if (screen.name === 'landing-pages') {
      return <LandingPagesListScreen onNavigate={navigate} onBack={goBack} />;
    }
    if (screen.name === 'create-landing-page') {
      return <CreateLandingPageScreen onBack={goBack} onNavigate={navigate} />;
    }

    // Phase 3: Content screens
    if (screen.name === 'create-content') {
      return <CreateContentScreen onBack={goBack} params={screen.params} />;
    }

    // Phase 4: Agent Profile screens
    if (screen.name === 'profile-settings') {
      return <ProfileSettingsScreen onBack={goBack} />;
    }
    if (screen.name === 'agent-page-builder') {
      return <AgentPageBuilderScreen onBack={goBack} />;
    }

    // Phase 5: CRM screens
    if (screen.name === 'pipeline') {
      return <PipelineScreen onBack={goBack} onNavigate={navigate} />;
    }
    if (screen.name === 'leads-list') {
      return <LeadsListScreen onBack={goBack} onNavigate={navigate} />;
    }
    if (screen.name === 'add-lead') {
      return <AddLeadScreen onBack={goBack} />;
    }
    if (screen.name === 'lead-detail') {
      return <LeadDetailScreen leadId={screen.params} onBack={goBack} onNavigate={navigate} />;
    }
    if (screen.name === 'add-activity') {
      return <AddActivityScreen leadId={screen.params} onBack={goBack} />;
    }

    // Tab screens
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={navigate} />;
      case 'properties':
        return <PropertiesScreen onNavigate={navigate} />;
      case 'create':
        return <CreateScreen onNavigate={navigate} />;
      case 'content':
        return <ContentScreen onNavigate={navigate} />;
      case 'crm':
        return <CRMScreen onNavigate={navigate} />;
      default:
        return <PropertiesScreen onNavigate={navigate} />;
    }
  };

  // Check if we should show bottom nav
  const showBottomNav = screen.name === 'list';

  return (
    <div className="min-h-screen bg-slate-900">
      {renderScreen()}
      {showBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         ROOT APP EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  return (
    <>
      <Head>
        <title>Batdongsan.Digital - Nền tảng BĐS cho Môi giới</title>
        <meta name="description" content="Batdongsan.Digital - Nền tảng quản lý bất động sản toàn diện cho môi giới. Kho hàng BĐS, Landing Page, Content Marketing, CRM." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://batdongsan.digital/" />
        <meta property="og:title" content="Batdongsan.Digital - Nền tảng BĐS cho Môi giới" />
        <meta property="og:description" content="Nền tảng quản lý bất động sản toàn diện. Kho hàng BĐS, Landing Page, Content Marketing, CRM." />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <AuthProvider>
        <div className="font-sans antialiased">
          <AppContent />
        </div>
      </AuthProvider>
    </>
  );
}
