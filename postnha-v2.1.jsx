// ═══════════════════════════════════════════════════════════════════════════════
//                           POSTNHÀ PLATFORM v2.1
//                        Phase 1: Foundation + Kho Hàng
//                           Vibecode Kit v4.0
//                      Tác giả: Nguyễn Huy Chiến (1nguoi.com)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
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

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
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
            <img src={url} alt="" className="w-full h-full object-cover" />
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

const Header = ({ title, showProfile = true, onBack }) => {
  const { profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
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
              <div className="absolute right-0 top-12 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 min-w-[180px]">
                <div className="px-4 py-2 border-b border-slate-700">
                  <p className="font-semibold text-white">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-slate-400">{profile?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 transition-colors"
                >
                  Đăng xuất
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
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-white">PostNhà</h1>
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
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
          <p className="text-slate-400 mt-2">Bắt đầu miễn phí với PostNhà</p>
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
              onCreateLP={() => alert('Tính năng Tạo Landing Page sẽ có ở Phase 2')}
              onCreateContent={() => alert('Tính năng Tạo Content sẽ có ở Phase 3')}
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => alert('Tính năng Tạo Landing Page sẽ có ở Phase 2')}
          >
            🔗 Tạo Landing Page
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => alert('Tính năng Tạo Content sẽ có ở Phase 3')}
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

const HomeScreen = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="🏠 Trang chủ" />

      <div className="p-4">
        <Card className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">
            Xin chào, {profile?.full_name || 'Môi giới'}! 👋
          </h2>
          <p className="text-slate-400">
            Chào mừng đến với PostNhà Platform v2.1
          </p>
        </Card>

        <Card className="text-center py-8">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Dashboard đang xây dựng</h3>
          <p className="text-slate-400">
            Thống kê và báo cáo sẽ có ở các Phase tiếp theo
          </p>
        </Card>
      </div>
    </div>
  );
};

const CreateScreen = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="➕ Tạo mới" />

      <div className="p-4">
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Tính năng đang xây dựng</h3>
          <p className="text-slate-400">
            Tạo Landing Page và Content sẽ có ở Phase 2 & 3
          </p>
        </Card>
      </div>
    </div>
  );
};

const ContentScreen = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="📱 Content" />

      <div className="p-4">
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Tính năng đang xây dựng</h3>
          <p className="text-slate-400">
            Content Factory sẽ có ở Phase 3
          </p>
        </Card>
      </div>
    </div>
  );
};

const CRMScreen = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header title="👤 CRM" />

      <div className="p-4">
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Tính năng đang xây dựng</h3>
          <p className="text-slate-400">
            Quản lý khách hàng (CRM) sẽ có ở Phase 5
          </p>
        </Card>
      </div>
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

  // Main app
  const renderScreen = () => {
    // Handle property-related screens
    if (screen.name === 'property-detail') {
      return (
        <PropertyDetailScreen
          propertyId={screen.params}
          onNavigate={navigate}
          onBack={goBack}
        />
      );
    }

    if (screen.name === 'add-property') {
      return <PropertyFormScreen onBack={goBack} />;
    }

    if (screen.name === 'edit-property') {
      return <PropertyFormScreen propertyId={screen.params} onBack={goBack} />;
    }

    // Tab screens
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'properties':
        return <PropertiesScreen onNavigate={navigate} />;
      case 'create':
        return <CreateScreen />;
      case 'content':
        return <ContentScreen />;
      case 'crm':
        return <CRMScreen />;
      default:
        return <PropertiesScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderScreen()}
      {screen.name === 'list' && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         ROOT APP EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  return (
    <AuthProvider>
      <div className="font-sans antialiased">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

          * {
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .line-clamp-1 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        `}</style>
        <AppContent />
      </div>
    </AuthProvider>
  );
}
