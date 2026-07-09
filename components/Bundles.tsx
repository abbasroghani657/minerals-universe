'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { parsePrice } from '@/utils/price';

const bundles = [
  {
    id: 101,
    imgs: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80',
      'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=300&q=80',
    ],
    badge: '✦ Save 10%',
    name: 'Aquamarine + Garnet Duo',
    original: '$620',
    sale: '$558',
  },
  {
    id: 102,
    imgs: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&q=80',
      'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=300&q=80',
    ],
    badge: '✦ Save 10%',
    name: 'Tourmaline + Imperial Topaz Set',
    original: '$1,250',
    sale: '$1,125',
  },
  {
    id: 103,
    imgs: [
      'https://images.unsplash.com/photo-1551868041-3bfcabc0a86c?w=300&q=80',
      'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=300&q=80',
    ],
    badge: '✦ Save 10%',
    name: 'Lapis + Rhodonite Polished Bundle',
    original: '$480',
    sale: '$432',
  },
];

export default function Bundles() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState<Set<number>>(new Set());

  const handleAdd = (bundle: typeof bundles[0]) => {
    addToCart({
      id: bundle.id,
      name: bundle.name,
      price: parsePrice(bundle.sale),
      img: bundle.imgs[0],
    });
    setAdded(prev => new Set(prev).add(bundle.id));
    setTimeout(() => {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(bundle.id);
        return next;
      });
    }, 2000);
  };

  return (
    <>
      <section style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="text-center">
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Special Offers</p>
            <h2 className="section-title">Complete the Set <span>&amp; Save</span></h2>
            <div className="teal-line"></div>
          </div>
          <div className="bundle-grid">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="bundle-card">
                <div className="bundle-imgs">
                  {bundle.imgs.map((img, j) => (
                    <Image key={j} src={img} alt="bundle" width={300} height={300} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} unoptimized />
                  ))}
                </div>
                <div className="bundle-info">
                  <span className="bundle-badge">{bundle.badge}</span>
                  <h3>{bundle.name}</h3>
                  <div className="bundle-price">
                    <span className="bundle-orig">{bundle.original}</span>
                    <span className="bundle-sale">{bundle.sale}</span>
                  </div>
                  <button
                    className={`add-btn${added.has(bundle.id) ? ' added' : ''}`}
                    onClick={() => handleAdd(bundle)}
                  >
                    {added.has(bundle.id) ? '✓ Bundle Added!' : 'Add Bundle to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
