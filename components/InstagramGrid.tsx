'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaYoutube, FaEbay, FaWhatsapp } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';

interface JourneyItem {
  src: string;
  alt: string;
  caption: string;
  link: string;
}

const DEFAULT_JOURNEY_ITEMS: JourneyItem[] = [
  {
    src: '/images/journey/raw-emeralds-mine.jpg',
    alt: 'Fresh Swat Emeralds',
    caption: 'Fresh Swat Emeralds Sourced Direct from Mines',
    link: 'https://www.instagram.com/mineralsuniverse_',
  },
  {
    src: '/images/journey/aquamarine-inspection.jpg',
    alt: 'Hexagonal Aquamarine Crystal Inspection',
    caption: 'Precision Penlight Inspection of Hexagonal Aquamarine',
    link: 'https://www.instagram.com/mineralsuniverse_',
  },
  {
    src: '/images/journey/dhl-luxury-packaging.jpg',
    alt: 'Luxury Packaging & Dispatch',
    caption: 'Collector-Grade Luxury Velvet Box & Wax Seal Dispatch',
    link: 'https://www.instagram.com/mineralsuniverse_',
  },
  {
    src: '/images/journey/lapidary-cutting.jpg',
    alt: 'Master Lapidary Faceting',
    caption: 'Master Gemologist Faceting Raw Crystals on Diamond Wheel',
    link: 'https://www.instagram.com/mineralsuniverse_',
  },
  {
    src: '/images/journey/mountain-mine-expedition.jpg',
    alt: 'Karakoram Mineral Expedition',
    caption: 'Karakoram Mountain Mineral Expedition & Extraction',
    link: 'https://www.instagram.com/mineralsuniverse_',
  },
  {
    src: '/images/journey/faceted-gems-sunlight.jpg',
    alt: 'Certified Gemstones in Sunlight',
    caption: 'Natural Sunlight Luster on Certified Gemstones',
    link: 'https://www.instagram.com/mineralsuniverse_',
  },
];

export default function InstagramGrid() {
  const [socials, setSocials] = useState<any>({
    instagramUrl: 'https://www.instagram.com/mineralsuniverse_',
    tiktokUrl: 'https://www.tiktok.com/@mineralsuniverse1?_r=1&_t=ZN-95hIvZ38Z30',
    youtubeUrl: 'https://youtube.com/@mineralsuniverse?si=8xemeeSlWzqPvsAA',
    ebayUrl: 'https://www.ebay.com/usr/mineralsuniverse',
    whatsappNumber: '923001581210',
  });

  const [items, setItems] = useState<JourneyItem[]>(DEFAULT_JOURNEY_ITEMS);

  useEffect(() => {
    async function loadSocialSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSocials((prev: any) => ({
            ...prev,
            ...data.settings,
          }));

          // Dynamically read the 6 slots configured by admin
          const dynamicItems: JourneyItem[] = [];
          for (let i = 1; i <= 6; i++) {
            const fallback = DEFAULT_JOURNEY_ITEMS[i - 1];
            const src = data.settings[`journey_img_${i}`] || fallback.src;
            const caption = data.settings[`journey_caption_${i}`] || fallback.caption;
            const link = data.settings[`journey_link_${i}`] || data.settings.instagramUrl || fallback.link;
            dynamicItems.push({
              src,
              alt: caption,
              caption,
              link,
            });
          }
          setItems(dynamicItems);
        }
      } catch (err) {
        console.warn('Using default journey gallery:', err);
      }
    }
    loadSocialSettings();
  }, []);

  return (
    <>
      <section style={{ background: 'var(--bg)', padding: '70px 0' }}>
        <div className="section-inner">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              ✦ Connect With Us
            </p>
            <h2 className="section-title">Follow Our <span>Journey</span></h2>
            <div className="teal-line"></div>
            <p style={{ color: '#666', fontSize: '15px', maxWidth: '640px', margin: '14px auto 0' }}>
              From the high-altitude mines of northern Pakistan to our precision gemological laboratory, explore authentic behind-the-scenes moments.
            </p>
          </div>

          {/* 6-Photo Responsive Grid */}
          <div className="insta-grid" style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            {items.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="insta-item"
                title={item.caption}
                style={{ position: 'relative', display: 'block', textDecoration: 'none', cursor: 'pointer', overflow: 'hidden' }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={400}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  unoptimized
                />
                {/* Luxury Hover Overlay */}
                <div
                  className="insta-overlay"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, rgba(17,59,49,0.3) 0%, rgba(9,46,37,0.92) 100%)',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FaInstagram size={28} color="#e5c07b" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.4px', lineHeight: 1.3, maxWidth: '240px' }}>
                    {item.caption}
                  </span>
                  <span style={{ fontSize: '11px', color: '#c5a059', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    View on Instagram <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Social Follow Links */}
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '36px' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--teal-dark)', fontFamily: "'Cormorant Garamond', serif" }}>
              Follow Us on Social Media
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
              <a
                href={socials.instagramUrl}
                className="btn-teal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E1306C', borderColor: '#E1306C', padding: '10px 22px', textTransform: 'none', letterSpacing: '0.5px', borderRadius: '6px', fontSize: '14px' }}
              >
                <FaInstagram size={17} /> Instagram
              </a>
              <a
                href={socials.tiktokUrl}
                className="btn-teal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000000', borderColor: '#000000', padding: '10px 22px', textTransform: 'none', letterSpacing: '0.5px', borderRadius: '6px', fontSize: '14px' }}
              >
                <FaTiktok size={17} /> TikTok
              </a>
              <a
                href={socials.youtubeUrl}
                className="btn-teal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FF0000', borderColor: '#FF0000', padding: '10px 22px', textTransform: 'none', letterSpacing: '0.5px', borderRadius: '6px', fontSize: '14px' }}
              >
                <FaYoutube size={17} /> YouTube
              </a>
              <a
                href={socials.ebayUrl}
                className="btn-teal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#333333', borderColor: '#333333', padding: '10px 22px', textTransform: 'none', letterSpacing: '0.5px', borderRadius: '6px', fontSize: '14px' }}
              >
                <FaEbay size={22} /> eBay
              </a>
              <a
                href={`https://wa.me/${socials.whatsappNumber}`}
                className="btn-teal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', borderColor: '#25D366', padding: '10px 22px', textTransform: 'none', letterSpacing: '0.5px', borderRadius: '6px', fontSize: '14px' }}
              >
                <FaWhatsapp size={17} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}