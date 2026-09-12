'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import { useRouter } from 'next/navigation';
import { useAuth, UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

export default function Header() {
  const { cartCount, wishlist, currency, setCurrency, openCart } = useCart();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const scrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header>
        <div className="header-inner">
          <Link className="logo" href="/">Minerals <span>Universe</span></Link>
          <nav>
            <div className="nav-item"><a href="/" className="active">Home</a></div>
            <div className="nav-item">
              <Link href="/category/loose-gemstones">Loose Gemstones ▾</Link>
              <div className="dropdown">
                <Link href="/category/aquamarine">Aquamarine</Link>
                <Link href="/category/emerald">Emerald</Link>
                <Link href="/category/tourmaline">Tourmaline</Link>
                <Link href="/category/sapphire">Sapphire</Link>
                <Link href="/category/ruby">Ruby</Link>
                <Link href="/category/topaz">Topaz</Link>
                <Link href="/category/garnet">Garnet</Link>
                <Link href="/category/spinel">Spinel</Link>
                <Link href="/category/kunzite">Kunzite</Link>
                <Link href="/category/peridot">Peridot</Link>
                <Link href="/category/zircon">Zircon</Link>
                <Link href="/category/morganite">Morganite</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link href="/category/minerals-and-crystals">Minerals &amp; Crystals ▾</Link>
              <div className="dropdown">
                <Link href="/category/quartz">Quartz</Link>
                <Link href="/category/fluorite">Fluorite</Link>
                <Link href="/category/pyrite">Pyrite</Link>
                <Link href="/category/kyanite">Kyanite</Link>
                <Link href="/category/selenite">Selenite</Link>
                <Link href="/category/amethyst">Amethyst</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link href="/category/polished-stones">Polished Stones ▾</Link>
              <div className="dropdown">
                <Link href="/category/lapis-lazuli">Lapis Lazuli</Link>
                <Link href="/category/rhodonite">Rhodonite</Link>
                <Link href="/category/tremolite">Tremolite</Link>
                <Link href="/category/hackmanite">Hackmanite</Link>
                <Link href="/category/calcite">Calcite</Link>
                <Link href="/category/afghanite">Afghanite</Link>
              </div>
            </div>
            <div className="nav-item"><Link href="/#about">About Us</Link></div>
            <div className="nav-item"><Link href="/#faq">FAQ</Link></div>
            <div className="nav-item"><Link href="/#contact">Contact Us</Link></div>
          </nav>
          <div className="header-icons">
            {/* Mobile Hamburger Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            <select
              className="currency-select desktop-only-item"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option>USD $</option>
              <option>EUR €</option>
              <option>GBP £</option>
              <option>AED د.إ</option>
              <option>PKR ₨</option>
            </select>
            <button
              title="Search"
              onClick={() => setSearchOpen(prev => !prev)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--muted)', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              <Search size={20} style={{ display: 'block' }} />
            </button>
            <Link
              href="/wishlist"
              title={`Wishlist (${mounted ? wishlist.size : 0})`}
              className="desktop-only-item"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: (mounted && wishlist.size > 0) ? '#c94438' : 'var(--muted)', transition: 'color .2s', position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <Heart size={20} fill={(mounted && wishlist.size > 0) ? 'currentColor' : 'none'} style={{ display: 'block' }} />
              {mounted && wishlist.size > 0 && (
                <span className="cart-badge" style={{ background: '#c94438' }}>{wishlist.size}</span>
              )}
            </Link>
            <button
              title={`Cart (${mounted ? cartCount : 0})`}
              onClick={() => openCart()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--muted)', position: 'relative', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              <ShoppingCart size={20} style={{ display: 'block' }} />
              {mounted && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <div className="desktop-only-item" style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', minWidth: '70px', justifyContent: 'center' }}>
              {!mounted ? (
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid rgba(26,127,116,.2)', borderTopColor: 'var(--teal)', animation: 'spin 1s linear infinite' }}></div>
              ) : (
                <>
                  <ClerkLoading>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid rgba(26,127,116,.2)', borderTopColor: 'var(--teal)', animation: 'spin 1s linear infinite' }}></div>
                  </ClerkLoading>
                  <ClerkLoaded>
                    {!isSignedIn ? (
                      <Link
                        href="/sign-in"
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--teal)',
                          border: '1px solid var(--teal)',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        Sign In
                      </Link>
                    ) : (
                      <UserButton />
                    )}
                  </ClerkLoaded>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        cartCount={mounted ? cartCount : 0}
        wishlistCount={mounted ? wishlist.size : 0}
        currency={currency}
        setCurrency={setCurrency}
        isSignedIn={mounted ? isSignedIn : false}
      />

      {/* Search Modal */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(27,46,44,.6)',
            zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '120px', backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: '14px', padding: '32px',
            width: '100%', maxWidth: '600px', margin: '0 24px',
            boxShadow: '0 24px 64px rgba(15,92,83,.2)',
          }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>🔍 Search Products</p>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search gemstones, crystals, minerals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: '8px',
                  border: '1px solid var(--border)', fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif", color: 'var(--ink)',
                  background: 'var(--bg)', outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button type="submit" className="btn-teal" style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>Search</button>
            </form>
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Sapphire', 'Tourmaline', 'Emerald', 'Ruby', 'Aquamarine', 'Garnet'].map(term => (
                <button
                  key={term}
                  onClick={() => { 
                    router.push(`/shop?search=${encodeURIComponent(term)}`); 
                    setSearchOpen(false); 
                    setSearchQuery('');
                  }}
                  style={{
                    background: 'var(--teal-pale)', color: 'var(--teal-dark)', border: 'none',
                    borderRadius: '20px', padding: '6px 14px', fontSize: '12px',
                    fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                    transition: 'background .2s',
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
