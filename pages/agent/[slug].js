// ═══════════════════════════════════════════════════════════════════════════════
//                    BATDONGSAN.DIGITAL - AGENT PAGE
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

export default function AgentPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch agent profile by slug
        const { data: agentData, error: agentError } = await supabase
          .from('profiles')
          .select('*')
          .eq('agent_page_slug', slug)
          .single();

        if (agentError) throw agentError;
        setAgent(agentData);

        // Fetch agent's properties (only published ones)
        const { data: propsData } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', agentData.id)
          .eq('status', 'dang-ban')
          .order('created_at', { ascending: false })
          .limit(6);

        setProperties(propsData || []);
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

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-white mb-2">Không tìm thấy</h1>
          <p className="text-slate-400">Trang này không tồn tại hoặc đã bị xóa</p>
        </div>
      </div>
    );
  }

  const handleCall = () => {
    if (agent.phone) {
      window.location.href = `tel:${agent.phone}`;
    }
  };

  const handleZalo = () => {
    if (agent.phone) {
      window.open(`https://zalo.me/${agent.phone}`, '_blank');
    }
  };

  return (
    <>
      <Head>
        <title>{agent.full_name || 'Agent'} | Batdongsan.Digital</title>
        <meta name="description" content={agent.bio || `Môi giới BĐS chuyên nghiệp - ${agent.full_name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content={`${agent.full_name} - Môi giới BĐS`} />
        <meta property="og:description" content={agent.bio || 'Môi giới BĐS chuyên nghiệp'} />
        {agent.avatar_url && <meta property="og:image" content={agent.avatar_url} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-amber-500/20 to-slate-900 pt-12 pb-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-amber-500 mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold overflow-hidden border-4 border-white/20">
              {agent.avatar_url ? (
                <img src={agent.avatar_url} alt={agent.full_name} className="w-full h-full object-cover" />
              ) : (
                agent.full_name?.charAt(0) || 'A'
              )}
            </div>

            {/* Name & Title */}
            <h1 className="text-2xl font-bold text-white mb-1">{agent.full_name}</h1>
            <p className="text-amber-500 font-medium mb-2">{agent.title || 'Môi giới BĐS'}</p>

            {/* Location */}
            {agent.location && (
              <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
                <span>📍</span> {agent.location}
              </p>
            )}

            {/* Bio */}
            {agent.bio && (
              <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-md mx-auto">
                {agent.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{properties.length}</p>
                <p className="text-slate-400 text-sm">BĐS đang bán</p>
              </div>
              {agent.experience_years && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{agent.experience_years}</p>
                  <p className="text-slate-400 text-sm">Năm kinh nghiệm</p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mt-6 max-w-xs mx-auto">
              <button
                onClick={handleCall}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                📞 Gọi ngay
              </button>
              <button
                onClick={handleZalo}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                💬 Zalo
              </button>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        {properties.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold text-white mb-4">BĐS đang bán</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                  onClick={() => {
                    if (property.landing_page_url) {
                      window.open(property.landing_page_url, '_blank');
                    }
                  }}
                >
                  <div className="h-36 bg-slate-700">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">{property.title}</h3>
                    <p className="text-slate-400 text-xs mt-1">{property.district}</p>
                    <p className="text-amber-500 font-bold mt-2">{formatPrice(property.price, property.price_unit)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-3">Thông tin liên hệ</h2>
            <div className="space-y-2 text-sm">
              {agent.phone && (
                <p className="text-slate-300 flex items-center gap-2">
                  <span>📞</span> {agent.phone}
                </p>
              )}
              {agent.email && (
                <p className="text-slate-300 flex items-center gap-2">
                  <span>✉️</span> {agent.email}
                </p>
              )}
              {agent.facebook && (
                <a
                  href={agent.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 flex items-center gap-2 hover:underline"
                >
                  <span>📘</span> Facebook
                </a>
              )}
              {agent.zalo && (
                <a
                  href={`https://zalo.me/${agent.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 flex items-center gap-2 hover:underline"
                >
                  <span>💬</span> Zalo
                </a>
              )}
            </div>
          </div>
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
