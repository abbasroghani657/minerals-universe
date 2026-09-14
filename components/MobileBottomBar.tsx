'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, Sparkles, Search, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist, openCart } = useCart();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hide on admin and executive vault routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/executive-vault')) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery('');
    }
  };

  const isHome = pathname === '/';
  const isShop = pathname === '/shop' || pathname.startsWith('/category');
  const isWishlist = pathname === '/wishlist';

  return (
    <>
      {/* Mobile Bottom App Navigation Bar */}
      <nav 
        className="mobile-bottom-bar"
        aria-label="Mobile Bottom Navigation"
      >
        <Link 
          href="/" 
          className={`bottom-bar-item ${isHome ? 'active' : ''}`}
          aria-label="Home"
        >
          <Home size={20} strokeWidth={isHome ? 2.4 : 1.8} />
          <span>Home</span>
        </Link>

        <Link 
          href="/shop" 
          className={`bottom-bar-item ${isShop ? 'active' : ''}`}
          aria-label="Shop Catalog"
        >
          <Sparkles size={20} strokeWidth={isShop ? 2.4 : 1.8} />
          <span>Catalog</span>
        </Link>

        <button 
          type="button"
          onClick={() => setSearchModalOpen(true)} 
          className="bottom-bar-item"
          aria-label="Search"
        >
          <Search size={20} strokeWidth={1.8} />
          <span>Search</span>
        </button>

        <Link 
          href="/wishlist" 
          className={`bottom-bar-item ${isWishlist ? 'active' : ''}`}
          aria-label="Wishlist Saved Collection"
        >
          <div style={{ position: 'relative' }}>
            <Heart size={20} strokeWidth={isWishlist ? 2.4 : 1.8} fill={isWishlist || wishlist.size > 0 ? '#c94438' : 'none'} color={isWishlist || wishlist.size > 0 ? '#c94438' : 'currentColor'} />
            {wishlist.size > 0 && (
              <span className="bottom-bar-badge" style={{ background: '#c94438' }}>
                {wishlist.size}
              </span>
            )}
          </div>
          <span style={{ fontWeight: isWishlist ? 700 : 500, color: isWishlist ? '#1a5c4a' : 'inherit' }}>Saved</span>
        </Link>

        <button 
          type="button"
          onClick={() => openCart()} 
          className="bottom-bar-item"
          aria-label="Cart Bag"
        >
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={20} strokeWidth={cartCount > 0 ? 2.2 : 1.8} color={cartCount > 0 ? '#1a5c4a' : 'currentColor'} />
            {cartCount > 0 && (
              <span className="bottom-bar-badge" style={{ background: '#1a5c4a' }}>
                {cartCount}
              </span>
            )}
          </div>
          <span style={{ fontWeight: cartCount > 0 ? 700 : 500 }}>Bag</span>
        </button>
      </nav>

      {/* Quick Search Modal for Mobile */}
      {searchModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '20px 16px',
          }}
          onClick={() => setSearchModalOpen(false)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '18px 16px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
              marginTop: '40px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Emeralds, Sapphires, Topaz..."
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '8px',
                    border: '1.5px solid #1a5c4a',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#1a5c4a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 18px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Find
              </button>
            </form>

            {/* Quick Keyword Badges */}
            <div style={{ marginTop: '16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', fontWeight: 600 }}>
                Popular Searches
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Emerald', 'Aquamarine', 'Sapphire', 'Ruby', 'Topaz', 'Tourmaline', 'Quartz'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      router.push(`/shop?search=${encodeURIComponent(tag)}`);
                      setSearchModalOpen(false);
                    }}
                    style={{
                      background: '#f8f7f5',
                      border: '1px solid #e8e6e1',
                      borderRadius: '16px',
                      padding: '6px 14px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#1a5c4a',
                      cursor: 'pointer',
                    }}
                  >
                    ✦ {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
