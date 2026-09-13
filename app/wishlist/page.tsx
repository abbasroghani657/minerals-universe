'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/price';
import { 
  Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, 
  Share2, ShieldCheck, Truck, Award, Check 
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  original?: string;
  img: string;
  cat: string;
  origin?: string;
  weight?: string;
  dimensions?: string;
  badge?: string;
  description?: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    currency, 
    exchangeRates, 
    openCart 
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedItems, setAddedItems] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products for wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: '80vh', background: '#fbfaf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#1a5c4a', fontWeight: 600, fontSize: '16px' }}>
          ✦ Loading your saved collection...
        </div>
      </div>
    );
  }

  // Filter products that are in the user's wishlist
  const savedProducts = products.filter(p => wishlist.has(p.id));

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceNum,
      img: product.img,
          });

    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    savedProducts.forEach(product => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.priceNum,
        img: product.img,
              });
    });
    openCart();
  };

  const handleShareWhatsApp = () => {
    if (savedProducts.length === 0) return;
    const itemList = savedProducts
      .map((p, i) => `${i + 1}. ${p.name} (${formatPrice(p.priceNum, currency, exchangeRates)})`)
      .join('\n');
    const text = `Hello Minerals Universe,\n\nI am interested in these items from my saved collection:\n${itemList}\n\nPlease provide availability and DHL Express shipping details.`;
    window.open(`https://wa.me/923001581210?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div style={{ background: '#fbfaf8', minHeight: '100vh', padding: '28px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#222' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .serif-title { font-family: 'Cormorant Garamond', serif; }
        
        .wishlist-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1080px) {
          .wishlist-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 480px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .wishlist-card {
          background: #ffffff;
          border: 1px solid #e8e6e1;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
        }

        .wishlist-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(26, 92, 74, 0.08);
          border-color: #c5a059;
        }

        .remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          border: 1px solid #e8e6e1;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c94438;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 5;
        }

        .remove-btn:hover {
          background: #c94438;
          color: #ffffff;
          border-color: #c94438;
          transform: scale(1.08);
        }

        .btn-add-bag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: #1a5c4a;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-add-bag:hover {
          background: #134638;
        }

        .btn-inquire-wa {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          background: #f4fbf7;
          color: #128c7e;
          border: 1px solid #c1e7d8;
          padding: 10px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12.5px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .btn-inquire-wa:hover {
          background: #25d366;
          color: #ffffff;
          border-color: #25d366;
        }
      `}} />

      <div className="wishlist-container">
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#777', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1a5c4a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <Link href="/shop" style={{ color: '#1a5c4a', textDecoration: 'none' }}>
            Catalog
          </Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>Private Wishlist</span>
        </div>

        {/* Page Hero Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a5c4a 0%, #123d31 100%)',
          borderRadius: '16px',
          padding: '40px 36px',
          color: '#ffffff',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(26,92,74,0.15)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197,160,89,0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '700px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.4)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', color: '#ffd98c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
                <Heart size={13} fill="#ffd98c" /> Curated Wishlist
              </div>
              <h1 className="serif-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, margin: '0 0 12px 0', lineHeight: 1.15 }}>
                My Saved Collection
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
                Review and manage your favorite natural gemstones and rare mineral specimens. Inquire directly with our resident gemologists or transfer items to your bag for insured worldwide acquisition.
              </p>
            </div>

            {/* Total Items Badge */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '18px 24px',
              textAlign: 'center',
              minWidth: '140px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#c5a059', lineHeight: 1 }}>
                {wishlist.size}
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                {wishlist.size === 1 ? 'Specimen Saved' : 'Specimens Saved'}
              </div>
            </div>
          </div>

          {/* Action Toolbar when Wishlist is NOT empty */}
          {savedProducts.length > 0 && (
            <div style={{
              marginTop: '30px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddAllToCart}
                  style={{
                    background: '#c5a059',
                    color: '#1a5c4a',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                >
                  <ShoppingBag size={16} /> Add All Available to Bag
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 18px',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaWhatsapp size={16} /> Share Collection via WhatsApp
                </button>
              </div>

              <button
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copiedLink ? <Check size={14} color="#4ade80" /> : <Share2 size={14} />}
                {copiedLink ? 'Link Copied!' : 'Copy Page Link'}
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(26,92,74,0.2)', borderTopColor: '#1a5c4a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#666', marginTop: '16px', fontSize: '15px' }}>Loading your private collection...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : savedProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e8e6e1',
            padding: '60px 24px',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto 40px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fbf5ea',
              border: '2px solid #ecd8ab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#c5a059'
            }}>
              <Heart size={36} />
            </div>

            <h2 className="serif-title" style={{ fontSize: '28px', color: '#1a5c4a', margin: '0 0 12px 0', fontWeight: 600 }}>
              Your Saved Collection is Empty
            </h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 28px' }}>
              You have not added any gemstones or mineral specimens to your private wishlist yet. Explore our museum-grade catalog and tap the heart icon on any piece to save it here.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/shop"
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
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26,92,74,0.2)'
                }}
              >
                <Sparkles size={16} /> Explore Gemstone Catalog
              </Link>
              <Link
                href="/#products"
                style={{
                  background: '#ffffff',
                  color: '#1a5c4a',
                  border: '1.5px solid #1a5c4a',
                  padding: '14px 28px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                View Featured Specimens
              </Link>
            </div>

            {/* Quick Category Exploration Chips */}
            <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #f0eee9' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', fontWeight: 600, marginBottom: '14px' }}>
                Popular Departments
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Emeralds', href: '/category/emerald' },
                  { label: 'Aquamarines', href: '/category/aquamarine' },
                  { label: 'Tourmalines', href: '/category/tourmaline' },
                  { label: 'Sapphires', href: '/category/sapphire' },
                  { label: 'Minerals & Crystals', href: '/category/minerals-and-crystals' },
                  { label: 'Polished Stones', href: '/category/polished-stones' },
                ].map(chip => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    style={{
                      background: '#faf9f6',
                      border: '1px solid #e8e6e1',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      color: '#444',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✦ {chip.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Wishlist Grid */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: 500 }}>
                Showing <strong>{savedProducts.length}</strong> saved {savedProducts.length === 1 ? 'gemstone' : 'gemstones'}
              </p>
              <Link 
                href="/shop" 
                style={{ fontSize: '13.5px', color: '#1a5c4a', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Continue Browsing Catalog →
              </Link>
            </div>

            <div className="wishlist-grid">
              {savedProducts.map((product) => (
                <div key={product.id} className="wishlist-card">
                  {/* Remove Button */}
                  <button
                    className="remove-btn"
                    onClick={() => toggleWishlist(product.id)}
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Specimen Media Thumbnail */}
                  <div 
                    style={{ position: 'relative', width: '100%', aspectRatio: '1/1', cursor: 'pointer', background: '#f5f4f0', overflow: 'hidden' }}
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      unoptimized
                    />

                    {/* Specimen Origin Badge */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      <span style={{
                        background: 'rgba(26, 92, 74, 0.88)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        letterSpacing: '0.4px'
                      }}>
                        {product.origin || 'Certified Origin'}
                      </span>
                    </div>
                  </div>

                  {/* Specimen Card Content */}
                  <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', fontWeight: 600 }}>
                          {product.cat}
                        </span>
                        {product.weight && (
                          <span style={{ fontSize: '11px', color: '#c5a059', fontWeight: 600 }}>
                            {product.weight}
                          </span>
                        )}
                      </div>

                      <h3
                        className="serif-title"
                        onClick={() => router.push(`/product/${product.id}`)}
                        style={{
                          fontSize: '19px',
                          fontWeight: 600,
                          color: '#1a5c4a',
                          margin: '0 0 10px 0',
                          lineHeight: 1.25,
                          cursor: 'pointer',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.name}
                      </h3>

                      {/* Price Display */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '19px', fontWeight: 700, color: '#1a5c4a' }}>
                          {formatPrice(product.priceNum, currency, exchangeRates)}
                        </span>
                        {product.original && (
                          <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>
                            {product.original}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div>
                      <button
                        className="btn-add-bag"
                        onClick={() => handleAddToCart(product)}
                      >
                        {addedItems[product.id] ? (
                          <>
                            <Check size={16} /> Added to Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} /> Move to Bag
                          </>
                        )}
                      </button>

                      {/* Inquire on WhatsApp */}
                      <a
                        href={`https://wa.me/923001581210?text=${encodeURIComponent(`Hello Minerals Universe, I am interested in inquiring about ${product.name} (Price: ${formatPrice(product.priceNum, currency, exchangeRates)}) from my saved wishlist. Link: https://mineralsuniverse.com/product/${product.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-inquire-wa"
                        title="Chat with gemologist on WhatsApp"
                      >
                        <FaWhatsapp size={15} /> Inquire on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High-End Guarantees Footer Strip */}
        <div style={{
          marginTop: '60px',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e8e6e1',
          padding: '24px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f4fbf7', border: '1px solid #c1e7d8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a', flexShrink: 0 }}>
              <Award size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#1a5c4a' }}>100% Earth-Mined Guarantee</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>Natural untampered specimens with optional GIA/GAA lab certificates.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f4fbf7', border: '1px solid #c1e7d8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a', flexShrink: 0 }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#1a5c4a' }}>Insured Worldwide Delivery</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>Priority DHL Express with tracking and door-to-door full insurance.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f4fbf7', border: '1px solid #c1e7d8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#1a5c4a' }}>30-Day Inspection Period</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>Inspect your specimen at your local laboratory with complete peace of mind.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
