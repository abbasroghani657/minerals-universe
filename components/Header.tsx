'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { cartCount, wishlist } = useCart();
  const router = useRouter();
  const [currency, setCurrency] = useState('USD $');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

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
    if (searchQuery.trim()) {
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const scrollTo = (id: string) => {
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
              <Link href="/shop">Loose Gemstones ▾</Link>
              <div className="dropdown">
                <Link href="/category/sapphire">Sapphire</Link><Link href="/category/ruby">Ruby</Link>
                <Link href="/category/tourmaline">Tourmaline</Link><Link href="/category/topaz">Topaz</Link>
                <Link href="/category/kunzite">Kunzite</Link><Link href="/category/emerald">Emerald</Link>
                <Link href="/category/aquamarine">Aquamarine</Link><Link href="/category/garnet">Garnet</Link>
                <Link href="/category/opals">Opals</Link><Link href="/category/peridot">Peridot</Link>
                <Link href="/category/zircon">Zircon</Link><Link href="/category/morganite">Morganite</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link href="/shop">Minerals &amp; Crystals ▾</Link>
              <div className="dropdown">
                <Link href="/category/quartz">Quartz</Link><Link href="/category/kyanite">Kyanite</Link>
                <Link href="/category/fluorite">Fluorite</Link><Link href="/category/pyrite">Pyrite</Link>
                <Link href="/category/selenite">Selenite</Link><Link href="/category/amethyst">Amethyst</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link href="/shop">Polished Stones ▾</Link>
              <div className="dropdown">
                <Link href="/category/lapis-lazuli">Lapis Lazuli</Link><Link href="/category/rhodonite">Rhodonite</Link>
                <Link href="/category/tremolite">Tremolite</Link><Link href="/category/hackmanite">Hackmanite</Link>
                <Link href="/category/calcite">Calcite</Link><Link href="/category/afghanite">Afghanite</Link>
              </div>
            </div>
            <div className="nav-item"><a href="#about">About Us</a></div>
            <div className="nav-item"><a href="#faq">FAQ</a></div>
            <div className="nav-item"><a href="#contact">Contact Us</a></div>
          </nav>
          <div className="header-icons">
            <select
              className="currency-select"
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
            <button
              title={`Wishlist (${wishlist.size})`}
              onClick={() => scrollTo('products')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: wishlist.size > 0 ? '#c94438' : 'var(--muted)', transition: 'color .2s', position: 'relative' }}
            >
              <Heart size={20} fill={wishlist.size > 0 ? 'currentColor' : 'none'} style={{ display: 'block' }} />
              {wishlist.size > 0 && (
                <span className="cart-badge" style={{ background: '#c94438' }}>{wishlist.size}</span>
              )}
            </button>
            <button
              title={`Cart (${cartCount})`}
              onClick={() => router.push('/cart')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--muted)', position: 'relative', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              <ShoppingCart size={20} style={{ display: 'block' }} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

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
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>✦ Search Products</p>
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
                  onClick={() => { setSearchQuery(term); scrollTo('products'); setSearchOpen(false); }}
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
