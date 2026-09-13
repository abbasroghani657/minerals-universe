'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { FaWhatsapp } from 'react-icons/fa';

interface Bundle {
  id: number;
  imgs: string[];
  name: string;
  originalUSD: number;
  saleUSD: number;
  badge?: string | null;
  items?: string | null;
  description?: string | null;
  stock?: string | null;
}

const FALLBACK_BUNDLES: Bundle[] = [
  {
    id: 101,
    imgs: [
      '/images/bundles/aquamarine.jpg',
      '/images/bundles/garnet.jpg',
    ],
    name: 'Aquamarine + Garnet Royal Duo',
    originalUSD: 620,
    saleUSD: 558,
    badge: '✦ Save 10%',
    items: '1x 4.2ct Natural Aquamarine Crystal, 1x 2.8ct Faceted Spessartine Garnet',
    stock: 'Only 1 Set Available'
  },
  {
    id: 102,
    imgs: [
      '/images/bundles/tourmaline.jpg',
      '/images/bundles/topaz.jpg',
    ],
    name: 'Tourmaline + Imperial Topaz Set',
    originalUSD: 1250,
    saleUSD: 1125,
    badge: '✦ Save 10%',
    items: '1x 5.8ct Bi-Color Tourmaline Crystal, 1x 3.1ct Katlang Golden Topaz',
    stock: 'In Stock'
  },
  {
    id: 103,
    imgs: [
      '/images/bundles/lapis.jpg',
      '/images/bundles/rhodonite.jpg',
    ],
    name: 'Lapis + Rhodonite Polished Bundle',
    originalUSD: 480,
    saleUSD: 432,
    badge: '✦ Save 10%',
    items: '1x 65mm Badakhshan Lapis Specimen, 1x 80mm Polished Rhodonite Specimen',
    stock: '2 Sets Left'
  },
];

export default function Bundles() {
  const { addToCart, formatPrice } = useCart();
  const [bundles, setBundles] = useState<Bundle[]>(FALLBACK_BUNDLES);
  const [added, setAdded] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function loadLiveBundles() {
      try {
        const res = await fetch('/api/bundles');
        if (!res.ok) return;
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('application/json')) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.bundles) && data.bundles.length > 0) {
          setBundles(data.bundles);
        }
      } catch (err) {
        console.warn('Using default bundles fallback:', err);
      }
    }
    loadLiveBundles();
  }, []);

  const handleAdd = (bundle: Bundle) => {
    addToCart({
      id: 90000 + bundle.id,
      name: bundle.name,
      price: bundle.saleUSD,
      img: bundle.imgs && bundle.imgs.length > 0 ? bundle.imgs[0] : 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80',
    });
    setAdded(prev => new Set(prev).add(bundle.id));
    setTimeout(() => {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(bundle.id);
        return next;
      });
    }, 2500);
  };

  const getWhatsAppInquiryUrl = (bundle: Bundle) => {
    const text = encodeURIComponent(
      `Hello Minerals Universe, I would like to inquire about the Complete Set: "${bundle.name}" (${formatPrice(bundle.saleUSD)}). Could you please share high-resolution 4K video of this set?`
    );
    return `https://wa.me/923001581210?text=${text}`;
  };

  return (
    <>
      <section style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="text-center">
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              ✦ Curated Collector Suites
            </p>
            <h2 className="section-title">Complete the Set <span>&amp; Save</span></h2>
            <div className="teal-line"></div>
            <p style={{ color: '#666', fontSize: '15px', maxWidth: '640px', margin: '14px auto 0' }}>
              Handpicked pairs and mineral suites curated by master gemologists. Enjoy exclusive bundle savings on certified collector duos.
            </p>
          </div>

          <div className="bundle-grid" style={{ marginTop: '40px' }}>
            {bundles.map((bundle) => {
              const savingsPercent = Math.max(0, Math.round(((bundle.originalUSD - bundle.saleUSD) / bundle.originalUSD) * 100));
              const isAdded = added.has(bundle.id);

              return (
                <div key={bundle.id} className="bundle-card">
                  {/* Multi-stone Images */}
                  <div className="bundle-imgs">
                    {(bundle.imgs || []).slice(0, 2).map((img, j) => (
                      <Image 
                        key={j} 
                        src={img} 
                        alt={`${bundle.name} stone ${j + 1}`} 
                        width={300} 
                        height={300} 
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} 
                        unoptimized 
                      />
                    ))}
                  </div>

                  <div className="bundle-info">
                    {/* Badge & Stock */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="bundle-badge">
                        {bundle.badge || `✦ Save ${savingsPercent}%`}
                      </span>
                      {bundle.stock && (
                        <span style={{ fontSize: '11px', color: '#1a5c4a', fontWeight: 600, background: 'rgba(26,92,74,0.08)', padding: '2px 6px', borderRadius: '3px' }}>
                          {bundle.stock}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--charcoal)' }}>
                      {bundle.name}
                    </h3>

                    {/* Set Inclusions breakdown */}
                    {bundle.items && (
                      <p style={{ fontSize: '12px', color: '#555', margin: '0 0 12px', background: '#f8f7f5', padding: '6px 10px', borderRadius: '4px', borderLeft: '2px solid var(--gold)' }}>
                        <strong>Includes:</strong> {bundle.items}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="bundle-price">
                      <span className="bundle-orig">{formatPrice(bundle.originalUSD)}</span>
                      <span className="bundle-sale">{formatPrice(bundle.saleUSD)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      <button
                        className={`add-btn${isAdded ? ' added' : ''}`}
                        onClick={() => handleAdd(bundle)}
                        style={{ width: '100%' }}
                      >
                        {isAdded ? '✓ Complete Set Added!' : 'Add Set to Cart'}
                      </button>

                      <a
                        href={getWhatsAppInquiryUrl(bundle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          padding: '8px 12px', borderRadius: '4px', border: '1px solid #25D366',
                          background: 'rgba(37, 211, 102, 0.06)', color: '#128C7E',
                          textDecoration: 'none', fontSize: '12.5px', fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        <FaWhatsapp size={15} color="#25D366" />
                        <span>Request 4K Video of Set</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
