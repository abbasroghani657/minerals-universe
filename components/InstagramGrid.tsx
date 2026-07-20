'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaYoutube, FaEbay, FaWhatsapp } from 'react-icons/fa';

const photos = [
  { src: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80', alt: 'Gem 1' },
  { src: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=400&q=80', alt: 'Gem 2' },
  { src: 'https://images.unsplash.com/photo-1625750331870-624de6fd3452?w=400&q=80', alt: 'Gem 3' },
  { src: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&q=80', alt: 'Gem 4' },
  { src: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', alt: 'Gem 5' },
  { src: 'https://images.unsplash.com/photo-1551868041-3bfcabc0a86c?w=400&q=80', alt: 'Gem 6' },
];

export default function InstagramGrid() {
  const [socials, setSocials] = useState<any>({
    instagramUrl: 'https://www.instagram.com/mineralsuniverse_',
    tiktokUrl: 'https://www.tiktok.com/@mineralsuniverse1?_r=1&_t=ZN-95hIvZ38Z30',
    youtubeUrl: 'https://youtube.com/@mineralsuniverse?si=8xemeeSlWzqPvsAA',
    ebayUrl: 'https://www.ebay.com/usr/mineralsuniverse',
    whatsappNumber: '923001581210',
  });

  useEffect(() => {
    async function loadSocials() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSocials((prev: any) => ({
            ...prev,
            ...data.settings
          }));
        }
      } catch (err) {
        console.error('Failed to load social settings:', err);
      }
    }
    loadSocials();
  }, []);

  return (
    <>
      <section style={{ background: 'var(--bg)' }}>
        <div className="section-inner">
          <div className="text-center" style={{ marginBottom: '36px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Connect With Us</p>
            <h2 className="section-title">Follow Our <span>Journey</span></h2>
            <div className="teal-line"></div>
          </div>
          <div className="insta-grid">
            {photos.map((photo, i) => (
              <div key={i} className="insta-item">
                <Image src={photo.src} alt={photo.alt} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
                <div className="insta-overlay">❤️ 👁️</div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginTop: '10px' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--teal-dark)', fontFamily: "'Cormorant Garamond', serif" }}>Follow Us On</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
              <a href={socials.instagramUrl} className="btn-teal" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E1306C', borderColor: '#E1306C', padding: '12px 24px', textTransform: 'none', letterSpacing: '0.5px' }}><FaInstagram size={18} /> Instagram</a>
              <a href={socials.tiktokUrl} className="btn-teal" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000000', borderColor: '#000000', padding: '12px 24px', textTransform: 'none', letterSpacing: '0.5px' }}><FaTiktok size={18} /> TikTok</a>
              <a href={socials.youtubeUrl} className="btn-teal" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FF0000', borderColor: '#FF0000', padding: '12px 24px', textTransform: 'none', letterSpacing: '0.5px' }}><FaYoutube size={18} /> YouTube</a>
              <a href={socials.ebayUrl} className="btn-teal" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#333333', borderColor: '#333333', padding: '12px 24px', textTransform: 'none', letterSpacing: '0.5px' }}><FaEbay size={24} /> eBay</a>
              <a href={`https://wa.me/${socials.whatsappNumber}`} className="btn-teal" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', borderColor: '#25D366', padding: '12px 24px', textTransform: 'none', letterSpacing: '0.5px' }}><FaWhatsapp size={18} /> WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
