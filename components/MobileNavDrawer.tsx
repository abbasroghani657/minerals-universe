'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, Search, ChevronDown, ChevronRight, Heart, 
  ShoppingCart, Sparkles, User, ExternalLink 
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  wishlistCount: number;
  currency: string;
  setCurrency: (c: string) => void;
  isSignedIn: boolean | undefined;
  isAdmin?: boolean;
}

const CATEGORIES = [
  {
    name: 'Natural Loose Gemstones',
    href: '/category/loose-gemstones',
    badge: 'Certified',
    items: [
      { name: 'Aquamarine', href: '/category/aquamarine' },
      { name: 'Emerald', href: '/category/emerald' },
      { name: 'Tourmaline', href: '/category/tourmaline' },
      { name: 'Sapphire', href: '/category/sapphire' },
      { name: 'Ruby', href: '/category/ruby' },
      { name: 'Topaz', href: '/category/topaz' },
      { name: 'Garnet', href: '/category/garnet' },
      { name: 'Spinel', href: '/category/spinel' },
      { name: 'Kunzite', href: '/category/kunzite' },
      { name: 'Peridot', href: '/category/peridot' },
      { name: 'Zircon', href: '/category/zircon' },
      { name: 'Morganite', href: '/category/morganite' },
    ]
  },
  {
    name: 'Minerals & Crystals',
    href: '/category/minerals-and-crystals',
    badge: 'Specimens',
    items: [
      { name: 'Quartz', href: '/category/quartz' },
      { name: 'Fluorite', href: '/category/fluorite' },
      { name: 'Pyrite', href: '/category/pyrite' },
      { name: 'Kyanite', href: '/category/kyanite' },
      { name: 'Selenite', href: '/category/selenite' },
      { name: 'Amethyst', href: '/category/amethyst' },
    ]
  },
  {
    name: 'Polished Stones',
    href: '/category/polished-stones',
    badge: 'Handcrafted',
    items: [
      { name: 'Lapis Lazuli', href: '/category/lapis-lazuli' },
      { name: 'Rhodonite', href: '/category/rhodonite' },
      { name: 'Tremolite', href: '/category/tremolite' },
      { name: 'Hackmanite', href: '/category/hackmanite' },
      { name: 'Calcite', href: '/category/calcite' },
      { name: 'Afghanite', href: '/category/afghanite' },
    ]
  }
];

export default function MobileNavDrawer({
  isOpen,
  onClose,
  cartCount,
  wishlistCount,
  currency,
  setCurrency,
  isSignedIn,
  isAdmin = false
}: Props) {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(CATEGORIES[0].name);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleLinkClick = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      if (window.location.pathname !== '/') {
        router.push(`/${href}`);
      } else {
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        background: 'rgba(10, 36, 30, 0.65)',
        backdropFilter: 'blur(6px)',
        transition: 'opacity 0.25s ease'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '85%',
          maxWidth: '360px',
          background: '#ffffff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 25px rgba(0,0,0,0.2)',
          animation: 'slideInLeft 0.25s ease-out'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 20px 16px',
          background: '#1a5c4a',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 700, color: '#fff' }}>
              Minerals <span style={{ color: '#c5a059' }}>Universe</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Namak Mandi, Peshawar
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0eee9' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search gems & minerals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 38px 10px 14px',
                borderRadius: '6px',
                border: '1px solid #dcd7ce',
                fontSize: '13.5px',
                outline: 'none',
                background: '#faf9f7',
                fontFamily: "'DM Sans', sans-serif"
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#1a5c4a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Scrollable Navigation Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', gap: '8px', padding: '0 20px 14px', borderBottom: '1px solid #f0eee9' }}>
            <button
              onClick={() => handleLinkClick('/shop')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #1a5c4a',
                background: '#eaf3f0',
                color: '#1a5c4a',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Gems
            </button>
            <button
              onClick={() => handleLinkClick('#products')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #dcd7ce',
                background: '#fff',
                color: '#444',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Featured
            </button>
            <button
              onClick={() => handleLinkClick('/wishlist')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #f2d8d5',
                background: wishlistCount > 0 ? '#fff0ee' : '#fff',
                color: wishlistCount > 0 ? '#c94438' : '#666',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Heart size={13} fill={wishlistCount > 0 ? '#c94438' : 'none'} color={wishlistCount > 0 ? '#c94438' : 'currentColor'} />
              <span>Saved ({wishlistCount})</span>
            </button>
          </div>

          {/* Categories Accordion */}
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '8px 20px', fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Collections &amp; Categories
            </div>

            {CATEGORIES.map(cat => {
              const isOpen = openSection === cat.name;
              return (
                <div key={cat.name} style={{ borderBottom: '1px solid #f7f6f4' }}>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : cat.name)}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: isOpen ? '#fbfaf8' : 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      color: isOpen ? '#1a5c4a' : '#222'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={14} color="#c5a059" />
                      {cat.name}
                    </span>
                    <ChevronDown
                      size={16}
                      color="#888"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ background: '#faf9f7', padding: '8px 20px 14px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px'
                      }}>
                        {cat.items.map(item => (
                          <button
                            key={item.name}
                            onClick={() => handleLinkClick(item.href)}
                            style={{
                              padding: '8px 10px',
                              background: '#fff',
                              border: '1px solid #e8e6e1',
                              borderRadius: '4px',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              color: '#333',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{item.name}</span>
                            <ChevronRight size={12} color="#aaa" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Informational Pages */}
          <div style={{ padding: '8px 0', borderTop: '1px solid #f0eee9' }}>
            <div style={{ padding: '8px 20px', fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Information
            </div>
            {[
              { name: 'Private Wishlist / Saved Gems', href: '/wishlist' },
              { name: 'About Our Heritage', href: '/#about' },
              { name: 'Shipping & Delivery Policy', href: '/shipping-policy' },
              { name: '30-Day Returns & Authenticity', href: '/returns-refunds' },
              { name: 'Frequently Asked Questions', href: '/#faq' },
              { name: 'Contact & Showroom', href: '/#contact' }
            ].map(link => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#444',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {link.name}
                <ChevronRight size={14} color="#ccc" />
              </button>
            ))}
          </div>

          {/* Currency Switcher */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0eee9' }}>
            <div style={{ fontSize: '12px', color: '#777', marginBottom: '8px', fontWeight: 600 }}>
              Select Currency:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['USD $', 'EUR €', 'GBP £', 'AED د.إ', 'PKR ₨'].map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: currency === curr ? '1px solid #1a5c4a' : '1px solid #dcd7ce',
                    background: currency === curr ? '#1a5c4a' : '#fff',
                    color: currency === curr ? '#fff' : '#444',
                    cursor: 'pointer'
                  }}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f0eee9', background: '#faf9f7' }}>
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/923001581210?text=Hello%20Minerals%20Universe%2C%20I%20am%20interested%20in%20inquiring%20about%20your%20certified%20gemstones."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: '#25D366',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '13.5px',
              marginBottom: '10px',
              boxShadow: '0 2px 8px rgba(37,211,102,0.25)'
            }}
          >
            <FaWhatsapp size={18} /> Chat with Gemologist
          </a>

          {/* Admin Portal Button (Always accessible to store owner) */}
          <button
            onClick={() => handleLinkClick('/admin')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px',
              background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.25) 100%)',
              border: '1px solid #c5a059',
              borderRadius: '6px',
              color: '#8f6e2b',
              fontWeight: 700,
              fontSize: '13px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            <span>⚡</span> Store Owner / Admin Portal
          </button>

          {/* Account Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!mounted ? (
              <div style={{ width: '100%', height: '40px', background: '#fff', border: '1px solid #1a5c4a', borderRadius: '6px' }}></div>
            ) : (
              <ClerkLoaded>
              {!isSignedIn ? (
                <button
                  onClick={() => handleLinkClick('/sign-in')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#fff',
                    border: '1px solid #1a5c4a',
                    borderRadius: '6px',
                    color: '#1a5c4a',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Sign In / Create Account
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a5c4a', fontWeight: 600 }}>
                  <UserButton />
                  <span>My Account</span>
                </div>
              )}
            </ClerkLoaded>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

