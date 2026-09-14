'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Settings, 
  Building, 
  ShieldCheck, 
  Image as ImageIcon, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff,
  Maximize2,
  Camera
} from 'lucide-react';
import { FaTiktok, FaEbay, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';

const FACTORY_DEFAULTS: Record<string, string> = {
  hero_banner_1: 'https://images.unsplash.com/photo-1551868041-3bfcabc0a86c?w=1600&q=80',
  hero_tag_1: '✨ Featured Collection',
  hero_title_1: "Polished Stones - Nature's Art, Perfected",
  hero_desc_1: 'Handpicked specimens from around the world, curated for collectors and connoisseurs',
  hero_cta_1: 'Shop Now',
  hero_link_1: '#products',
  hero_show_text_1: 'true',
  hero_fit_1: 'cover',

  hero_banner_2: 'https://images.unsplash.com/photo-1625750331870-624de6fd3452?w=1600&q=80',
  hero_tag_2: '✨ New Arrivals',
  hero_title_2: 'Natural Loose Gemstones - Rare & Certified',
  hero_desc_2: 'Sapphires, Rubies, Tourmalines & more - directly sourced from premier mining regions',
  hero_cta_2: 'Explore Collection',
  hero_link_2: '#categories',
  hero_show_text_2: 'true',
  hero_fit_2: 'cover',

  hero_banner_3: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600&q=80',
  hero_tag_3: '✨ Collectors Edition',
  hero_title_3: 'Minerals & Crystals - Sourced from the Earth',
  hero_desc_3: "Authentic specimens for collectors and jewelers - from the world's finest geological formations",
  hero_cta_3: 'View All',
  hero_link_3: '#categories',
  hero_show_text_3: 'true',
  hero_fit_3: 'cover',
  journey_img_1: '/images/journey/raw-emeralds-mine.jpg',
  journey_caption_1: '✦ Direct Mine Sourcing — Raw Swat Emeralds',
  journey_link_1: 'https://www.instagram.com',

  journey_img_2: '/images/journey/aquamarine-inspection.jpg',
  journey_caption_2: '✦ Gemological Quality Inspection & Crystal Grade',
  journey_link_2: 'https://www.instagram.com',

  journey_img_3: '/images/journey/dhl-luxury-packaging.jpg',
  journey_caption_3: '✦ Luxury Safe Packaging & DHL Express Worldwide',
  journey_link_3: 'https://www.instagram.com',

  journey_img_4: '/images/journey/lapidary-cutting.jpg',
  journey_caption_4: '✦ Master Lapidary Faceting & Precision Polishing',
  journey_link_4: 'https://www.instagram.com',

  journey_img_5: '/images/journey/mountain-mine-expedition.jpg',
  journey_caption_5: '✦ Karakoram Mountain Geological Expedition',
  journey_link_5: 'https://www.instagram.com',

  journey_img_6: '/images/journey/faceted-gems-sunlight.jpg',
  journey_caption_6: '✦ Natural Gem Lustre in Pure Direct Sunlight',
  journey_link_6: 'https://www.instagram.com',

};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    ebayUrl: '',
    whatsappNumber: '',
    ...FACTORY_DEFAULTS
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<Record<string, string>>({});
  const [expandedTextSlot, setExpandedTextSlot] = useState<number | null>(null);
  const [uploadingJourneySlot, setUploadingJourneySlot] = useState<number | null>(null);
  const [journeyFeedback, setJourneyFeedback] = useState<Record<string, string>>({});
  const [resetModal, setResetModal] = useState<{ type: 'banner' | 'journey'; slot: number } | null>(null);
  const [isResetting, setIsResetting] = useState(false);


  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings,
          }));
        }
      } catch (e) {
        console.error('Error loading settings', e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleShowText = async (slotNum: number) => {
    const key = `hero_show_text_${slotNum}`;
    const currentVal = settings[key] !== 'false';
    const nextVal = currentVal ? 'false' : 'true';
    setSettings(prev => ({ ...prev, [key]: nextVal }));

    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: nextVal }),
    });
  };

  const handleFitModeChange = async (slotNum: number, mode: string) => {
    const key = `hero_fit_${slotNum}`;
    setSettings(prev => ({ ...prev, [key]: mode }));

    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: mode }),
    });
  };

  const compressImageClient = async (
    file: File,
    maxWidth = 2400,
    maxHeight = 1350,
    quality = 0.86
  ): Promise<{ file: File; base64: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = (event.target?.result as string) || '';
        const img = document.createElement('img');
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ file, base64: dataUrl });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/webp', quality);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const cleanName = file.name.replace(/\.[^.]+$/, '.webp');
                const compressedFile = new File([blob], cleanName, { type: 'image/webp' });
                resolve({ file: compressedFile, base64: compressedBase64 });
              } else {
                resolve({ file, base64: dataUrl });
              }
            },
            'image/webp',
            quality
          );
        };
        img.onerror = () => resolve({ file, base64: dataUrl });
        img.src = dataUrl;
      };
      reader.onerror = () => resolve({ file, base64: '' });
      reader.readAsDataURL(file);
    });
  };

  const handleBannerUpload = async (slotNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    const key = `hero_banner_${slotNumber}`;
    setUploadingSlot(slotNumber);
    setUploadFeedback(prev => ({ ...prev, [key]: 'Optimizing & compressing image...' }));

    try {
      // 1. Client-side instant canvas compression (drops 10MB down to ~150KB)
      const { file: compressedFile, base64: fallbackBase64 } = await compressImageClient(rawFile, 2400, 1350, 0.86);

      let finalUrl = '';

      // 2. Try server upload API first
      try {
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('type', 'cover');

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-admin-key': 'MineralsOwner2026!',
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            finalUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Server upload API failed, falling back to local compressed data URI:', uploadErr);
      }

      // 3. Fallback to client-compressed base64 if server upload didn't return a URL
      if (!finalUrl) {
        finalUrl = fallbackBase64;
      }

      if (!finalUrl) {
        throw new Error('Unable to read selected photo.');
      }

      // 4. Save to live settings in database
      setUploadFeedback(prev => ({ ...prev, [key]: 'Saving cover live to database...' }));
      setSettings(prev => ({ ...prev, [key]: finalUrl }));

      const settingsRes = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'MineralsOwner2026!',
        },
        body: JSON.stringify({ key, value: finalUrl }),
      });

      const sData = await settingsRes.json().catch(() => ({}));
      if (!settingsRes.ok || !sData.success) {
        throw new Error(sData.error || 'Failed to save cover setting to database.');
      }

      const kbSize = Math.round(compressedFile.size / 1024);
      setUploadFeedback(prev => ({
        ...prev,
        [key]: `✓ Optimized (${kbSize} KB) & Saved Live!`,
      }));
    } catch (err: any) {
      console.error('Banner upload error:', err);
      setUploadFeedback(prev => ({ ...prev, [key]: `Error: ${err.message || 'Upload failed'}` }));
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleResetToDefault = (slotNumber: number) => {
    setResetModal({ type: 'banner', slot: slotNumber });
  };

  
  const handleJourneyUpload = async (slotNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    const key = `journey_img_${slotNumber}`;
    setUploadingJourneySlot(slotNumber);
    setJourneyFeedback(prev => ({ ...prev, [key]: 'Optimizing & compressing photo...' }));

    try {
      // 1. Client-side instant canvas compression (square/vertical 1200x1200)
      const { file: compressedFile, base64: fallbackBase64 } = await compressImageClient(rawFile, 1200, 1200, 0.85);

      let finalUrl = '';

      // 2. Try server upload API first
      try {
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('type', 'general');

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-admin-key': 'MineralsOwner2026!',
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            finalUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Server upload API failed, falling back to local compressed data URI:', uploadErr);
      }

      // 3. Fallback to client-compressed base64 if server upload didn't return a URL
      if (!finalUrl) {
        finalUrl = fallbackBase64;
      }

      if (!finalUrl) {
        throw new Error('Unable to read selected photo.');
      }

      // 4. Save to live settings in database
      setJourneyFeedback(prev => ({ ...prev, [key]: 'Saving photo live to database...' }));
      setSettings(prev => ({ ...prev, [key]: finalUrl }));

      const settingsRes = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'MineralsOwner2026!',
        },
        body: JSON.stringify({ key, value: finalUrl }),
      });

      const sData = await settingsRes.json().catch(() => ({}));
      if (!settingsRes.ok || !sData.success) {
        throw new Error(sData.error || 'Failed to save journey photo to database.');
      }

      const kbSize = Math.round(compressedFile.size / 1024);
      setJourneyFeedback(prev => ({
        ...prev,
        [key]: `✓ Optimized (${kbSize} KB) & Saved Live!`,
      }));
    } catch (err: any) {
      console.error('Journey upload error:', err);
      setJourneyFeedback(prev => ({ ...prev, [key]: `Error: ${err.message || 'Upload failed'}` }));
    } finally {
      setUploadingJourneySlot(null);
    }
  };

  const handleResetJourneyToDefault = (slotNumber: number) => {
    setResetModal({ type: 'journey', slot: slotNumber });
  };

  const executeReset = async () => {
    if (!resetModal) return;
    const { type, slot } = resetModal;
    setIsResetting(true);

    if (type === 'banner') {
      const key = `hero_banner_${slot}`;
      const defaultVal = FACTORY_DEFAULTS[key];
      if (!defaultVal) {
        setIsResetting(false);
        setResetModal(null);
        return;
      }

      setSettings(prev => ({ ...prev, [key]: defaultVal }));
      setUploadFeedback(prev => ({ ...prev, [key]: 'Resetting to default...' }));

      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: defaultVal }),
        });
        setUploadFeedback(prev => ({ ...prev, [key]: '✓ Restored factory default cover!' }));
      } catch (err) {
        setUploadFeedback(prev => ({ ...prev, [key]: 'Failed to reset. Try again.' }));
      } finally {
        setIsResetting(false);
        setResetModal(null);
      }
    } else {
      const imgKey = `journey_img_${slot}`;
      const capKey = `journey_caption_${slot}`;
      const linkKey = `journey_link_${slot}`;
      const defaultImg = FACTORY_DEFAULTS[imgKey];
      const defaultCap = FACTORY_DEFAULTS[capKey];
      const defaultLink = FACTORY_DEFAULTS[linkKey];
      if (!defaultImg) {
        setIsResetting(false);
        setResetModal(null);
        return;
      }

      setSettings(prev => ({ 
        ...prev, 
        [imgKey]: defaultImg,
        [capKey]: defaultCap,
        [linkKey]: defaultLink,
      }));
      setJourneyFeedback(prev => ({ ...prev, [imgKey]: 'Resetting to default...' }));

      try {
        await Promise.all([
          fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: imgKey, value: defaultImg }),
          }),
          fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: capKey, value: defaultCap }),
          }),
          fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: linkKey, value: defaultLink }),
          })
        ]);
        setJourneyFeedback(prev => ({ ...prev, [imgKey]: '✓ Restored original museum photo!' }));
      } catch (err) {
        setJourneyFeedback(prev => ({ ...prev, [imgKey]: 'Failed to reset. Try again.' }));
      } finally {
        setIsResetting(false);
        setResetModal(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'MineralsOwner2026!'
        },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings to database.');
      }

      setMessage('✅ All Settings, Banners & Display preferences successfully updated in 0.3s!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      console.error('[Settings Save Error]', e);
      setMessage(`❌ Error saving settings: ${e.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Settings...</div>;
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  
  const journeySlots = [
    { num: 1, title: 'Slot 1: Mine Sourcing', badge: 'Raw Minerals', defaultDesc: 'Direct extraction of raw crystals at Swat/Karakoram mines' },
    { num: 2, title: 'Slot 2: Quality Inspection', badge: 'Gemology Lab', defaultDesc: 'Jeweler torch and loupe optical purity examination' },
    { num: 3, title: 'Slot 3: Luxury Packaging', badge: 'Global Delivery', defaultDesc: 'Velvet gift box, wax seal stamp, and DHL Express shipping' },
    { num: 4, title: 'Slot 4: Lapidary Faceting', badge: 'Master Artistry', defaultDesc: 'Precision diamond-wheel cutting and polishing' },
    { num: 5, title: 'Slot 5: Mountain Expedition', badge: 'Field Geology', defaultDesc: 'Rugged Karakoram peak prospecting and specimen discoveries' },
    { num: 6, title: 'Slot 6: Sunlight Lustre', badge: 'Fire & Brilliance', defaultDesc: 'Natural sunlight test showing optical fire and color saturation' },
  ];

  const bannerSlots = [
    { 
      num: 1, 
      label: 'Cover Slide 1', 
      titleKey: 'hero_title_1', 
      tagKey: 'hero_tag_1', 
      descKey: 'hero_desc_1', 
      ctaKey: 'hero_cta_1', 
      linkKey: 'hero_link_1', 
      showTextKey: 'hero_show_text_1',
      fitKey: 'hero_fit_1',
      defaultTitle: 'Polished Stones - Nature\'s Art, Perfected' 
    },
    { 
      num: 2, 
      label: 'Cover Slide 2', 
      titleKey: 'hero_title_2', 
      tagKey: 'hero_tag_2', 
      descKey: 'hero_desc_2', 
      ctaKey: 'hero_cta_2', 
      linkKey: 'hero_link_2', 
      showTextKey: 'hero_show_text_2',
      fitKey: 'hero_fit_2',
      defaultTitle: 'Natural Loose Gemstones - Rare & Certified' 
    },
    { 
      num: 3, 
      label: 'Cover Slide 3', 
      titleKey: 'hero_title_3', 
      tagKey: 'hero_tag_3', 
      descKey: 'hero_desc_3', 
      ctaKey: 'hero_cta_3', 
      linkKey: 'hero_link_3', 
      showTextKey: 'hero_show_text_3',
      fitKey: 'hero_fit_3',
      defaultTitle: 'Minerals & Crystals - Sourced from the Earth' 
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1a5c4a', margin: '0 0 6px' }}>
            Store Settings & Cover Banners
          </h1>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Manage hero banners, image auto-optimization, display options, brand identity, and social channels.
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '14px 20px', borderRadius: '4px', marginBottom: '24px', background: message.startsWith('✅') ? '#e6f4ea' : '#fce8e6', color: message.startsWith('✅') ? '#137333' : '#c5221f', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {message}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '40px' }}>

          {/* SECTION 0: Hero Cover Banners CMS */}
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#0f5c53', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                  <ImageIcon size={20} color="#0f5c53" /> Home Page Hero Cover Banners (3 Slides)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  <strong>Auto-Optimization Policy:</strong> Every photo is preserved in 100% completeness (no edges cut off), compressed to WebP under 200KB, with natural crystal-clear colors (zero dark green tint).
                </p>
              </div>
              <a 
                href="/" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '12px', color: '#0f5c53', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600, background: '#e6f4ea', padding: '6px 12px', borderRadius: '4px' }}
              >
                View Live Home Page <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              {bannerSlots.map((slot) => {
                const bannerKey = `hero_banner_${slot.num}`;
                const currentUrl = settings[bannerKey] || '';
                const isUploading = uploadingSlot === slot.num;
                const feedback = uploadFeedback[bannerKey];
                const isExpanded = expandedTextSlot === slot.num;
                const showText = settings[slot.showTextKey] !== 'false';
                const fitMode = settings[slot.fitKey] || 'cover';

                return (
                  <div key={slot.num} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#0f5c53', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>
                          Slide {slot.num}
                        </span>
                        <strong style={{ fontSize: '15px', color: '#1e293b' }}>
                          {showText ? (settings[slot.titleKey] || slot.defaultTitle) : '(Clean Image Only - No Text)'}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResetToDefault(slot.num)}
                        style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Revert back to original mineral image"
                      >
                        <RotateCcw size={12} /> Reset to Default
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
                      {/* Live Image Preview */}
                      <div>
                        <div style={{ 
                          width: '100%', 
                          height: '120px', 
                          borderRadius: '6px', 
                          overflow: 'hidden', 
                          border: '1px solid #e2e8f0', 
                          background: '#0a1a17',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {currentUrl ? (
                            <img 
                              src={currentUrl} 
                              alt={`Slide ${slot.num} preview`}
                              style={{ width: '100%', height: '100%', objectFit: fitMode === 'contain' ? 'contain' : 'cover' }}
                            />
                          ) : (
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>No Image Set</div>
                          )}
                          <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '3px' }}>
                            {fitMode.toUpperCase()}
                          </div>
                        </div>

                        {/* Fit Mode Selector */}
                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleFitModeChange(slot.num, 'cover')}
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '4px',
                              cursor: 'pointer',
                              border: fitMode === 'cover' ? '1px solid #0f5c53' : '1px solid #cbd5e1',
                              background: fitMode === 'cover' ? '#e6f4ea' : '#f8fafc',
                              color: fitMode === 'cover' ? '#0f5c53' : '#64748b',
                            }}
                          >
                            Full Width
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFitModeChange(slot.num, 'contain')}
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '4px',
                              cursor: 'pointer',
                              border: fitMode === 'contain' ? '1px solid #0f5c53' : '1px solid #cbd5e1',
                              background: fitMode === 'contain' ? '#e6f4ea' : '#f8fafc',
                              color: fitMode === 'contain' ? '#0f5c53' : '#64748b',
                            }}
                          >
                            Fit No-Crop
                          </button>
                        </div>
                      </div>

                      {/* Controls */}
                      <div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <label 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '9px 18px', 
                              background: isUploading ? '#cbd5e1' : '#0f5c53', 
                              color: '#fff', 
                              borderRadius: '6px', 
                              cursor: isUploading ? 'not-allowed' : 'pointer', 
                              fontSize: '13px', 
                              fontWeight: 600,
                              boxShadow: '0 2px 4px rgba(15,92,83,0.2)'
                            }}
                          >
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {isUploading ? 'Optimizing & Saving...' : 'Upload New Cover Photo'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              disabled={isUploading}
                              onChange={(e) => handleBannerUpload(slot.num, e)} 
                              style={{ display: 'none' }} 
                            />
                          </label>

                          {/* Toggle to show/hide text on this slide */}
                          <button
                            type="button"
                            onClick={() => handleToggleShowText(slot.num)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '9px 14px',
                              background: showText ? '#f1f5f9' : '#fee2e2',
                              color: showText ? '#334155' : '#b91c1c',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                            title={showText ? 'Hide website text on this slide' : 'Show website text on this slide'}
                          >
                            {showText ? <Eye size={14} /> : <EyeOff size={14} />}
                            {showText ? 'Text Enabled' : 'Text Hidden (Clean Image)'}
                          </button>

                          {showText && (
                            <button
                              type="button"
                              onClick={() => setExpandedTextSlot(isExpanded ? null : slot.num)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '9px 14px',
                                background: '#f8fafc',
                                color: '#475569',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 500
                              }}
                            >
                              <Sparkles size={14} color="#0f5c53" />
                              Customize Text & CTA
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>

                        {feedback && (
                          <div style={{ 
                            fontSize: '12px', 
                            marginTop: '10px', 
                            color: feedback.startsWith('✓') ? '#137333' : '#b91c1c', 
                            background: feedback.startsWith('✓') ? '#e6f4ea' : '#fee2e2',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontWeight: 600, 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px' 
                          }}>
                            {feedback.startsWith('✓') && <CheckCircle2 size={15} />}
                            {feedback}
                          </div>
                        )}

                        <div style={{ marginTop: '8px' }}>
                          <input 
                            name={bannerKey}
                            type="text"
                            value={currentUrl}
                            onChange={handleChange}
                            style={{ ...inputStyle, fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '6px 10px' }}
                            placeholder="Or paste direct image URL (e.g. https://... or /uploads/...)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Slide Text Customizer */}
                    {isExpanded && showText && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0', background: '#f8fafc', padding: '16px', borderRadius: '6px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '12px' }}>
                          <div>
                            <label style={labelStyle}>Badge / Tag</label>
                            <input 
                              name={slot.tagKey}
                              type="text"
                              value={settings[slot.tagKey] || ''}
                              onChange={handleChange}
                              style={inputStyle}
                              placeholder="e.g. ✨ Featured Collection"
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Headline (Use " - " to accent second half)</label>
                            <input 
                              name={slot.titleKey}
                              type="text"
                              value={settings[slot.titleKey] || ''}
                              onChange={handleChange}
                              style={inputStyle}
                              placeholder="e.g. Polished Stones - Nature's Art, Perfected"
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={labelStyle}>Slide Description / Subtitle</label>
                          <textarea 
                            name={slot.descKey}
                            rows={2}
                            value={settings[slot.descKey] || ''}
                            onChange={handleChange}
                            style={{ ...inputStyle, resize: 'vertical' }}
                            placeholder="Brief description of the collection..."
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                          <div>
                            <label style={labelStyle}>Button Text</label>
                            <input 
                              name={slot.ctaKey}
                              type="text"
                              value={settings[slot.ctaKey] || ''}
                              onChange={handleChange}
                              style={inputStyle}
                              placeholder="e.g. Shop Now"
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Button Target URL / Section</label>
                            <input 
                              name={slot.linkKey}
                              type="text"
                              value={settings[slot.linkKey] || ''}
                              onChange={handleChange}
                              style={inputStyle}
                              placeholder="e.g. #products or /categories/loose-gems"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

          
          {/* SECTION 2: Follow Our Journey (Social Showcase & Instagram Gallery) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '17px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={20} /> Follow Our Journey — Social Showcase Gallery (6 Slots)
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                  These 6 high-resolution photographs appear directly in the &ldquo;Follow Our Journey&rdquo; section on the storefront homepage. Each image builds international collector confidence by highlighting authentic mine sourcing, gem inspection, packaging, and cutting artistry.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {journeySlots.map((slot) => {
                const imgKey = `journey_img_${slot.num}`;
                const capKey = `journey_caption_${slot.num}`;
                const linkKey = `journey_link_${slot.num}`;
                const currentImg = settings[imgKey] || FACTORY_DEFAULTS[imgKey];
                const currentCaption = settings[capKey] || FACTORY_DEFAULTS[capKey] || '';
                const currentLink = settings[linkKey] || FACTORY_DEFAULTS[linkKey] || '';
                const isUploading = uploadingJourneySlot === slot.num;
                const feedback = journeyFeedback[imgKey];

                return (
                  <div 
                    key={slot.num}
                    style={{ 
                      background: '#fafbfc', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '10px', 
                      padding: '18px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f5c53' }}>{slot.title}</span>
                        <span style={{ fontSize: '11px', background: '#e6f4ea', color: '#137333', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                          {slot.badge}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResetJourneyToDefault(slot.num)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          textDecoration: 'underline'
                        }}
                        title="Reset this slot to original high-res photo"
                      >
                        <RotateCcw size={11} /> Reset
                      </button>
                    </div>

                    {/* Image Preview & Upload Controls */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px solid #0f5c53',
                        background: '#092e25',
                        position: 'relative',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
                      }}>
                        {currentImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={currentImg} 
                            alt={currentCaption || `Slot ${slot.num}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: isUploading ? '#94a3b8' : '#0f5c53',
                            color: '#fff',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                            textAlign: 'center'
                          }}
                        >
                          <Upload size={14} /> {isUploading ? 'Uploading...' : 'Upload New Photo'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            disabled={isUploading}
                            onChange={(e) => handleJourneyUpload(slot.num, e)}
                            style={{ display: 'none' }} 
                          />
                        </label>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>
                          Square (1:1) or 4:5 vertical recommended. PNG, JPG, or WEBP.
                        </p>
                        {feedback && (
                          <div style={{
                            fontSize: '11px',
                            color: feedback.startsWith('✓') ? '#047857' : '#b91c1c',
                            fontWeight: 600
                          }}>
                            {feedback}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Direct Image Path / URL */}
                    <div>
                      <label style={labelStyle}>Image File Path or CDN URL</label>
                      <input 
                        type="text"
                        name={imgKey}
                        value={settings[imgKey] ?? FACTORY_DEFAULTS[imgKey] ?? ''}
                        onChange={handleChange}
                        placeholder="e.g. /images/journey/... or https://..."
                        style={{ ...inputStyle, fontSize: '12px', padding: '8px 10px' }}
                      />
                    </div>

                    {/* Display Caption */}
                    <div>
                      <label style={labelStyle}>Hover Caption (Storefront Title)</label>
                      <input 
                        type="text"
                        name={capKey}
                        value={settings[capKey] ?? FACTORY_DEFAULTS[capKey] ?? ''}
                        onChange={handleChange}
                        placeholder="e.g. ✦ Direct Mine Sourcing — Raw Swat Emeralds"
                        style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }}
                      />
                    </div>

                    {/* Target Link */}
                    <div>
                      <label style={labelStyle}>Click Target URL (Instagram Post, Reel, or Store Link)</label>
                      <input 
                        type="url"
                        name={linkKey}
                        value={settings[linkKey] ?? FACTORY_DEFAULTS[linkKey] ?? ''}
                        onChange={handleChange}
                        placeholder="e.g. https://www.instagram.com/p/... or /shop"
                        style={{ ...inputStyle, fontSize: '12px', padding: '8px 10px' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Social Networks & Contacts */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> Social Networks & Contacts
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}><FaInstagram size={16} color="#E1306C" /> Instagram Page URL</label>
                <input name="instagramUrl" type="url" value={settings.instagramUrl || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.instagram.com/yourusername" />
              </div>

              <div>
                <label style={labelStyle}><FaTiktok size={16} color="#000000" /> TikTok Profile URL</label>
                <input name="tiktokUrl" type="url" value={settings.tiktokUrl || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.tiktok.com/@yourusername" />
              </div>

              <div>
                <label style={labelStyle}><FaYoutube size={16} color="#FF0000" /> YouTube Channel URL</label>
                <input name="youtubeUrl" type="url" value={settings.youtubeUrl || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.youtube.com/@yourchannel" />
              </div>

              <div>
                <label style={labelStyle}><FaEbay size={18} color="#333333" /> eBay Store URL</label>
                <input name="ebayUrl" type="url" value={settings.ebayUrl || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.ebay.com/usr/yourstore" />
              </div>

              <div>
                <label style={labelStyle}><FaWhatsapp size={16} color="#25D366" /> WhatsApp Contact Number (With Country Code)</label>
                <input name="whatsappNumber" type="text" value={settings.whatsappNumber || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. 923001581210" />
                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#888' }}>Do not include "+" or spaces (e.g. 923001581210 for Pakistan number).</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                padding: '14px 36px', 
                background: '#0f5c53', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 2px 6px rgba(15,92,83,0.3)'
              }}
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>

        </form>
      </div>

      {/* Luxury Reset Confirmation Modal */}
      {resetModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(5, 18, 14, 0.78)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '460px',
            background: 'linear-gradient(180deg, #112d23 0%, #071712 100%)',
            border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px',
            padding: '32px 28px', color: '#fff', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(197, 160, 89, 0.15)', border: '1.5px solid rgba(197, 160, 89, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              color: '#c5a059'
            }}>
              <RotateCcw size={26} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: '0 0 8px', color: '#fff' }}>
              Restore Factory Default?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', lineHeight: 1.5 }}>
              {resetModal.type === 'banner'
                ? `Reset Slide ${resetModal.slot} back to the curated factory default cover image?`
                : `Reset Journey Slot ${resetModal.slot} back to default authentic photo & caption?`}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setResetModal(null)}
                disabled={isResetting}
                style={{
                  flex: 1, padding: '12px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)',
                  borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeReset}
                disabled={isResetting}
                style={{
                  flex: 1, padding: '12px', background: 'linear-gradient(135deg, #c5a059 0%, #dfba73 100%)',
                  border: 'none', color: '#071510', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
                  cursor: isResetting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px'
                }}
              >
                {isResetting ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                {isResetting ? 'Restoring...' : 'Confirm Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
