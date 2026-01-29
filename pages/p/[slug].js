// ═══════════════════════════════════════════════════════════════════════════════
//                    BATDONGSAN.DIGITAL - LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ikkmumdaqbopacoxklzp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra211bWRhcWJvcGFjb3hrbHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDQ5NzEsImV4cCI6MjA4NTE4MDk3MX0.M2S7nBZneZgI4nsDKv4ctDE6FpMzFzc0eM7RlmG9mac';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PRICE_UNITS = [
  { value: 'ty', label: 'Tỷ' },
  { value: 'trieu', label: 'Triệu' },
  { value: 'trieu-m2', label: 'Triệu/m²' },
];

const formatPrice = (price, unit) => {
  if (!price) return 'Liên hệ';
  const unitLabel = PRICE_UNITS.find(u => u.value === unit)?.label || 'Tỷ';
  return `${price} ${unitLabel}`;
};

export default function LandingPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [landingPage, setLandingPage] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch landing page
        const { data: lpData, error: lpError } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (lpError) throw lpError;
        setLandingPage(lpData);

        // Fetch property
        const { data: propData, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', lpData.property_id)
          .single();

        if (propError) throw propError;
        setProperty(propData);
      } catch (err) {
        console.error('Error:', err);
        setError('Không tìm thấy trang');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !landingPage || !property) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-white mb-2">Không tìm thấy</h1>
          <p className="text-slate-400">Trang này không tồn tại hoặc đã bị xóa</p>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const title = landingPage.custom_title || property.title;
  const description = landingPage.custom_description || property.description;
  const ctaText = landingPage.custom_cta_text || 'Liên hệ ngay';
  const ctaPhone = landingPage.custom_cta_phone || property.owner_phone;

  const handleCall = () => {
    if (ctaPhone) {
      window.location.href = `tel:${ctaPhone}`;
    }
  };

  const handleZalo = () => {
    if (ctaPhone) {
      window.open(`https://zalo.me/${ctaPhone}`, '_blank');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Head>
        <title>{title} | Batdongsan.Digital</title>
        <meta name="description" content={description?.substring(0, 160)} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description?.substring(0, 160)} />
        {images[0] && <meta property="og:image" content={images[0]} />}
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-slate-900">
        {/* Hero Image Gallery */}
        <div className="relative h-72 md:h-96 bg-slate-800">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white text-xl hover:bg-black/70 transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white text-xl hover:bg-black/70 transition"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {formatPrice(property.price, property.price_unit)}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🏠</div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Title & Location */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-400 flex items-center gap-2 mb-4">
            <span>📍</span>
            {property.address && `${property.address}, `}
            {property.district}, {property.city}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 bg-slate-800 rounded-2xl p-4 mb-6">
            <div className="text-center">
              <p className="text-amber-500 font-bold text-xl">{formatPrice(property.price, property.price_unit)}</p>
              <p className="text-slate-400 text-sm">Giá</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">{property.area || '-'}m²</p>
              <p className="text-slate-400 text-sm">Diện tích</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">{property.bedrooms || '-'} PN</p>
              <p className="text-slate-400 text-sm">Phòng ngủ</p>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-3">Mô tả</h2>
              <p className="text-slate-300 whitespace-pre-line leading-relaxed">{description}</p>
            </div>
          )}

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-3">Tiện ích</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-slate-800 rounded-2xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Chi tiết</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Loại BĐS:</span>
                <span className="text-white">{property.property_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phòng tắm:</span>
                <span className="text-white">{property.bathrooms || '-'} WC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hướng:</span>
                <span className="text-white">{property.direction || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quận/Huyện:</span>
                <span className="text-white">{property.district}</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-4">
            <div className="max-w-2xl mx-auto flex gap-3">
              <button
                onClick={handleCall}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition"
              >
                📞 {ctaText}
              </button>
              <button
                onClick={handleZalo}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition"
              >
                💬 Zalo
              </button>
            </div>
          </div>

          {/* Spacer for fixed CTA */}
          <div className="h-20"></div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Powered by <span className="text-amber-500">Batdongsan.Digital</span>
          </p>
        </div>
      </div>
    </>
  );
}
