'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ name: string; count: string; img: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          const counts: Record<string, number> = {};
          const imgs: Record<string, string> = {};
          
          data.products.forEach((p: any) => {
            if (p.cat) {
              counts[p.cat] = (counts[p.cat] || 0) + 1;
              if (!imgs[p.cat]) {
                imgs[p.cat] = p.img;
              }
            }
          });

          const catList = Object.keys(counts).map(cat => ({
            name: cat,
            count: `${counts[cat]} ${counts[cat] === 1 ? 'Product' : 'Products'}`,
            img: imgs[cat] || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&q=80'
          }));
          setCategories(catList);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  if (loading) return null;
  if (categories.length === 0) return null;

  return (
    <>
      <div className="teal-divider"></div>
      <div id="categories" className="cat-section" style={{ background: 'var(--bg)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
            ✦ Browse Collections
          </p>
          <h2 className="cat-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: '#1a5c4a', margin: '0 0 20px' }}>
            Shop By <span>Category</span>
          </h2>
          <div className="teal-line left" style={{ marginBottom: '40px' }}></div>
          
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
            {categories.map((item, i) => (
              <div 
                key={i} 
                className="cat-tile" 
                onClick={() => router.push(`/category/${encodeURIComponent(item.name.toLowerCase().replace(/ /g, '-'))}`)} 
                style={{ 
                  cursor: 'pointer', 
                  background: '#fff', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  border: '1px solid #e8e6e1',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image 
                    src={item.img} 
                    alt={item.name} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    unoptimized 
                  />
                </div>
                <div className="cat-tile-info" style={{ padding: '16px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: '#1a5c4a', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{item.name}</h4>
                  <p className="cat-count" style={{ margin: 0, fontSize: '12px', color: '#888' }}>{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="teal-divider"></div>
    </>
  );
}
