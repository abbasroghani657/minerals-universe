'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Sparkles, Filter, Heart, ExternalLink, Award } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/price';
import { 
  CATEGORY_TREE, 
  isPrimaryCategory, 
  normalizeCategory, 
  slugifyCategory, 
  deslugifyCategory, 
  inferMainCategory, 
  getVarietiesForMain, 
  getProductBadge 
} from '@/utils/categories';

export default function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currency, exchangeRates, wishlist, toggleWishlist } = useCart();
  const [mounted, setMounted] = useState(false);

  // Decode the route param
  const rawParam = decodeURIComponent(resolvedParams.name);
  const normParam = normalizeCategory(rawParam);

  // Determine if this is a primary department or a specific variety
  const matchedDepartment = Object.keys(CATEGORY_TREE).find(k => 
    normalizeCategory(k) === normParam || normalizeCategory(CATEGORY_TREE[k].slug) === normParam
  );
  const isDepartment = !!matchedDepartment;

  // Resolve display name cleanly
  const displayName = isDepartment ? matchedDepartment : deslugifyCategory(rawParam);

  // Parent department for varieties
  const parentDepartment = isDepartment ? null : inferMainCategory(displayName);
  const parentSlug = parentDepartment ? slugifyCategory(parentDepartment) : '';

  const departmentDef = isDepartment && matchedDepartment ? CATEGORY_TREE[matchedDepartment] : null;

  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [departmentFallbackProducts, setDepartmentFallbackProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        setLoading(true);
        // Fetch products matching this category/variety
        const queryParam = isDepartment ? (matchedDepartment || rawParam) : rawParam;
        const res = await fetch(`/api/products?category=${encodeURIComponent(queryParam)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setCategoryProducts(data.products);
        }

        // If it is a variety with low/zero count, also fetch related department products
        if (!isDepartment && parentDepartment) {
          const depRes = await fetch(`/api/products?category=${encodeURIComponent(parentDepartment)}`);
          const depData = await depRes.json();
          if (depData.success && Array.isArray(depData.products)) {
            setDepartmentFallbackProducts(depData.products);
          }
        }
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [rawParam, isDepartment, matchedDepartment, parentDepartment]);

  // Collect varieties for navigation
  const departmentVarieties = useMemo(() => {
    if (isDepartment && matchedDepartment) {
      const predefined = getVarietiesForMain(matchedDepartment);
      const fromProducts = Array.from(new Set(categoryProducts.map(p => p.cat).filter(Boolean)));
      return Array.from(new Set([...predefined, ...fromProducts]));
    }
    if (!isDepartment && parentDepartment) {
      return getVarietiesForMain(parentDepartment);
    }
    return [];
  }, [isDepartment, matchedDepartment, parentDepartment, categoryProducts]);

  if (!mounted) return null;

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '28px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        .cat-grid { max-width: 1200px; margin: 36px auto 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
        .product-card { background: #fff; border-radius: 10px; border: 1px solid #e8e6e1; overflow: hidden; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.06); border-color: #1a5c4a; }
        .product-info { padding: 20px; }
        .btn-teal-outline {
          width: 100%; background: transparent; color: #1a5c4a; padding: 12px; border: 1px solid #1a5c4a; border-radius: 4px;
          font-size: 13px; font-weight: 600; text-transform: uppercase; margin-top: 16px; cursor: pointer; transition: all 0.3s;
          display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .product-card:hover .btn-teal-outline { background: #1a5c4a; color: #fff; }
        
        .variety-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid #e2ded8;
          background: #ffffff;
          color: #444;
        }
        .variety-pill:hover, .variety-pill.active {
          background: #1a5c4a;
          color: #ffffff;
          border-color: #1a5c4a;
          box-shadow: 0 4px 12px rgba(26,92,74,0.15);
        }
      `}} />

      {/* Category Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingBottom: '30px', borderBottom: '1px solid #e8e6e1', position: 'relative' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: '#777', marginBottom: '16px' }}>
          <Link href="/" style={{ color: '#1a5c4a', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: '#1a5c4a', textDecoration: 'none' }}>Catalog</Link>
          <span>/</span>
          {!isDepartment && parentDepartment && (
            <>
              <Link href={`/category/${parentSlug}`} style={{ color: '#1a5c4a', textDecoration: 'none' }}>
                {parentDepartment}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: '#333', fontWeight: 600 }}>{displayName}</span>
        </div>

        <button 
          onClick={() => router.back()} 
          style={{ position: 'absolute', top: 0, left: 0, background: 'none', border: 'none', color: '#1a5c4a', fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <p style={{ color: '#c5a059', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
          {isDepartment ? '✦ Premier Department Collection ✦' : `✦ Certified ${parentDepartment || 'Gemstone'} Variety ✦`}
        </p>

        <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 46px)', color: '#1a5c4a', margin: '0 0 14px 0', fontWeight: 600 }}>
          {displayName}
        </h1>

        <p style={{ color: '#666', maxWidth: '680px', margin: '0 auto 24px', lineHeight: 1.6, fontSize: '15px' }}>
          {departmentDef 
            ? departmentDef.description 
            : `Authenticated 100% natural ${displayName.toLowerCase()} specimens. Ethically sourced from Himalayan & Hindu Kush pegmatite deposits, certified by gemological laboratories.`}
        </p>

        {/* Dynamic Variety Navigation: Every single stone variety has its OWN dedicated URL & page */}
        {departmentVarieties.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#888', fontWeight: 700, marginBottom: '12px' }}>
              {isDepartment ? 'Select Variety Stone (Dedicated Collections):' : `Other ${parentDepartment || 'Collection'} Varieties:`}
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {isDepartment && (
                <span className="variety-pill active">
                  All {displayName} ({categoryProducts.length})
                </span>
              )}

              {departmentVarieties.map((v) => {
                const vSlug = slugifyCategory(v);
                const isCurrent = !isDepartment && (v.toLowerCase() === displayName.toLowerCase() || vSlug === rawParam.toLowerCase());

                return (
                  <Link
                    key={v}
                    href={`/category/${vSlug}`}
                    className={`variety-pill ${isCurrent ? 'active' : ''}`}
                    title={`Open dedicated ${v} page`}
                  >
                    <span>✦ {v}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#1a5c4a', fontWeight: 600 }}>
          💎 Loading authenticated collection...
        </div>
      ) : categoryProducts.length === 0 ? (
        /* Luxury Concierge Empty State when this variety currently has 0 inventory */
        <div style={{ maxWidth: '800px', margin: '40px auto 0' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e8e6e1',
            padding: '48px 32px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#f4fbf7',
              border: '2px solid #c1e7d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#1a5c4a'
            }}>
              <Award size={34} />
            </div>

            <h2 className="heading-serif" style={{ fontSize: '28px', color: '#1a5c4a', margin: '0 0 12px 0', fontWeight: 600 }}>
              Bespoke Sourcing Available for {displayName}
            </h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 28px' }}>
              Our private vault specimens for <strong>{displayName}</strong> are currently undergoing laboratory testing or being cut for bespoke private orders. Our senior gemologist can source, cut, or certify an earth-mined specimen to your exact dimensions and carat requirements.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <a
                href={`https://wa.me/923001581210?text=${encodeURIComponent(`Hello Minerals Universe, I am interested in custom sourcing or acquiring certified ${displayName} specimens.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.25)'
                }}
              >
                <FaWhatsapp size={18} /> Inquire on WhatsApp for {displayName}
              </a>

              {parentDepartment && (
                <Link
                  href={`/category/${parentSlug}`}
                  style={{
                    background: '#1a5c4a',
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Browse All {parentDepartment}
                </Link>
              )}
            </div>
          </div>

          {/* Related Available Specimens from Parent Department */}
          {departmentFallbackProducts.length > 0 && (
            <div style={{ marginTop: '50px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: '#c5a059', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>
                  ✦ Available in the Same Collection ✦
                </p>
                <h3 className="heading-serif" style={{ fontSize: '28px', color: '#1a5c4a', margin: 0 }}>
                  Other Available {parentDepartment} Specimens
                </h3>
              </div>

              <div className="cat-grid">
                {departmentFallbackProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="product-card" onClick={() => router.push('/product/' + product.id)}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                      <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                      <button
                        type="button"
                        className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        title={wishlist.has(product.id) ? 'Remove from Saved' : 'Save to Wishlist'}
                        aria-label="Toggle Wishlist"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #e8e6e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          color: wishlist.has(product.id) ? '#c94438' : '#888',
                          fontSize: '18px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {wishlist.has(product.id) ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="product-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>{product.cat}</span>
                        <span style={{ fontSize: '11px', color: '#1a5c4a', fontWeight: 600 }}>{product.origin || 'Pakistan'}</span>
                      </div>
                      <h4 className="heading-serif" style={{ fontSize: '18px', color: '#1a5c4a', margin: '0 0 8px 0', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h4>
                      <p style={{ color: '#555', fontWeight: 600, fontSize: '16px', margin: 0 }}>
                        {formatPrice(product.priceNum, currency, exchangeRates)}
                      </p>
                      <div className="btn-teal-outline">
                        <ShoppingBag size={15} /> View Specimen
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Normal Category Product Grid */
        <div className="cat-grid">
          {categoryProducts.map((product) => (
            <div key={product.id} className="product-card" onClick={() => router.push('/product/' + product.id)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                <button
                  type="button"
                  className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  title={wishlist.has(product.id) ? 'Remove from Saved' : 'Save to Wishlist'}
                  aria-label="Toggle Wishlist"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid #e8e6e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 4,
                    color: wishlist.has(product.id) ? '#c94438' : '#888',
                    fontSize: '18px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {wishlist.has(product.id) ? '♥' : '♡'}
                </button>
                {(() => {
                  const b = getProductBadge(product.badge);
                  return b ? (
                    <span style={{
                      position: 'absolute', top: '10px', left: '10px',
                      background: b.bg, color: b.color, fontSize: '10.5px',
                      fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      display: 'inline-flex', alignItems: 'center', gap: '4px', zIndex: 2
                    }}>
                      {b.icon} {b.text}
                    </span>
                  ) : null;
                })()}
              </div>
              <div className="product-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>{product.cat}</span>
                  <span style={{ fontSize: '11px', color: '#1a5c4a', fontWeight: 600 }}>{product.origin || 'Pakistan'}</span>
                </div>
                <h3 className="heading-serif" style={{ fontSize: '18px', color: '#1a5c4a', margin: '0 0 8px 0', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
                <p style={{ color: '#555', fontWeight: 600, fontSize: '16px', margin: 0 }}>
                  {formatPrice(product.priceNum, currency, exchangeRates)}
                  {product.original && (
                    <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '6px', fontWeight: 400 }}>
                      {product.original}
                    </span>
                  )}
                </p>

                <div className="btn-teal-outline">
                  <ShoppingBag size={15} /> View Specimen
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
