'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { formatPrice, parsePrice } from '@/utils/price';
import { inferMainCategory } from '@/utils/categories';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { DEFAULT_PRODUCTS } from '@/lib/defaultData';

export default function Products({ initialProducts }: { initialProducts?: any[] }) {
  const [homeProducts, setHomeProducts] = useState<any[]>(() => (initialProducts && initialProducts.length > 0) ? initialProducts : DEFAULT_PRODUCTS.slice(0, 4));

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
    async function fetchHomeProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('application/json')) return;
        const data = await res.json();
        if (data.success && data.products) {
          setHomeProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading products for homepage:', err);
      }
    }
    fetchHomeProducts();
  }, [initialProducts]);

  const { addToCart, wishlist, toggleWishlist, currency, exchangeRates } = useCart();
  const [added, setAdded] = useState<Set<number>>(new Set());
  const router = useRouter();

  const handleAddToCart = (product: typeof homeProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceNum,
      img: product.img,
    });
    setAdded(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <>
      <section id="products" style={{ background: 'var(--bg)', padding: '60px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: '44px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
              ✦ Certified Natural Sourcing
            </p>
            <h2 className="section-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', color: '#1a5c4a', margin: '0 0 14px' }}>
              Latest <span>Arrivals</span>
            </h2>
            <div className="teal-line" style={{ margin: '0 auto' }}></div>
            <p style={{ color: '#666', maxWidth: '600px', margin: '14px auto 0', fontSize: '15px' }}>
              Freshly mined and authenticated specimens just added to our collection.
            </p>
          </div>

          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {homeProducts.map((product) => {
              const badgeText = product.badge?.trim() || 'NEW ARRIVAL';
              const isNew = badgeText.toUpperCase().includes('NEW');
              const isRare = badgeText.toUpperCase().includes('RARE') || badgeText.toUpperCase().includes('GRADE');
              const isPopular = badgeText.toUpperCase().includes('POPULAR') || badgeText.toUpperCase().includes('BEST');
              const isSale = badgeText.toUpperCase().includes('SALE') || badgeText.toUpperCase().includes('HOT');

              let badgeBg = '#1a5c4a'; // Emerald for New
              if (isRare) badgeBg = '#c5a059'; // Gold
              if (isPopular) badgeBg = '#d97706'; // Amber
              if (isSale) badgeBg = '#c94438'; // Ruby red

              const mainCat = product.mainCat || inferMainCategory(product.cat);

              return (
                <div 
                  key={product.id} 
                  className="product-card" 
                  onClick={() => router.push(`/product/${product.id}`)} 
                  style={{ 
                    cursor: 'pointer',
                    background: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e8e6e1',
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <div className="product-img" style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                    <Image 
                      src={product.img} 
                      alt={product.name} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      unoptimized 
                    />

                    {/* Luxury Badge */}
                    <span 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: badgeBg,
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: '4px',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 2,
                      }}
                    >
                      ✦ {badgeText}
                    </span>

                    {/* Stock Alert Badge */}
                    {product.stock && (product.stock.toLowerCase().includes('only') || product.stock.toLowerCase().includes('left')) && (
                      <span 
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          background: 'rgba(201,68,56,0.92)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '4px',
                          zIndex: 2,
                        }}
                      >
                        {product.stock}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      aria-label="Toggle wishlist"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#fff',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: wishlist.has(product.id) ? '#c94438' : '#888',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 2,
                        transition: 'color .2s'
                      }}
                    >
                      {wishlist.has(product.id) ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="product-info" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {product.cat}
                      </span>
                      <span style={{ fontSize: '11px', color: '#888' }}>
                        {product.origin || 'Pakistan'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16.5px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.35, minHeight: '44px' }}>
                      {product.name}
                    </h3>

                    <div className="stars" style={{ color: '#d4943a', fontSize: '12px', marginBottom: '10px' }}>★★★★★</div>

                    <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span className="price-sale" style={{ color: '#1a5c4a', fontSize: '18px', fontWeight: 700 }}>
                        {formatPrice(product.priceNum, currency, exchangeRates)}
                      </span>
                      {parsePrice(product.original) > 0 && (
                        <span className="price-original" style={{ color: '#888', fontSize: '13px', textDecoration: 'line-through' }}>
                          {formatPrice(parsePrice(product.original), currency, exchangeRates)}
                        </span>
                      )}
                    </div>

                    <button
                      className={`add-btn${added.has(product.id) ? ' added' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: added.has(product.id) ? '#113328' : 'var(--teal)',
                        color: '#fff',
                        transition: 'background .2s',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {added.has(product.id) ? '✓ Added to Cart!' : 'Add to Cart'}
                    </button>

                    <a 
                      href="https://wa.me/923001581210" 
                      className="whatsapp-link" 
                      target="_blank" 
                      rel="noopener" 
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#555',
                        marginTop: '10px',
                        textDecoration: 'none'
                      }}
                    >
                      💬 Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center" style={{ marginTop: '50px' }}>
            <button 
              className="btn-outline-teal" 
              onClick={() => router.push('/shop')}
              style={{
                padding: '13px 36px',
                border: '2px solid var(--teal)',
                borderRadius: '6px',
                color: 'var(--teal)',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              View Complete Gemstone Catalog →
            </button>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}

