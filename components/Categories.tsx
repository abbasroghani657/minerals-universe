'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CATEGORY_TREE, MAIN_CATEGORY_NAMES, inferMainCategory, slugifyCategory } from '@/utils/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Categories() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('application/json')) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Compute counts for the 3 main departments
  const departmentCounts: Record<string, number> = {
    'Loose Gemstones': 0,
    'Minerals & Crystals': 0,
    'Polished Stones': 0,
  };

  products.forEach((p) => {
    const main = p.mainCat || inferMainCategory(p.cat);
    if (departmentCounts[main] !== undefined) {
      departmentCounts[main]++;
    } else {
      departmentCounts['Loose Gemstones']++;
    }
  });

  // Top gemstone varieties from products
  const popularVarieties = useMemo(() => {
    const fromProducts = Array.from(new Set(products.map(p => p.cat).filter(Boolean)));
    if (fromProducts.length > 0) {
      return fromProducts.slice(0, 12);
    }
    return ['Aquamarine', 'Emerald', 'Tourmaline', 'Quartz', 'Fluorite', 'Lapis Lazuli', 'Spinel', 'Garnet'];
  }, [products]);

  // Helper to dynamically get varieties for each department (from DB + taxonomy)
  const getDeptVarieties = (mainName: string) => {
    const fromProducts = products
      .filter(p => (p.mainCat || inferMainCategory(p.cat)) === mainName)
      .map(p => p.cat)
      .filter(Boolean);
    const predefined = CATEGORY_TREE[mainName]?.varieties || [];
    return Array.from(new Set([...fromProducts, ...predefined]));
  };

  if (loading) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .cat-section {
            padding: 36px 14px !important;
          }
          .cat-heading {
            font-size: 28px !important;
          }
        }
      `}} />
      <div className="teal-divider"></div>
      <div id="categories" className="cat-section" style={{ background: '#f8f7f5', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
              ✦ Certified Sourcing Collections
            </p>
            <h2 className="cat-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', color: '#1a5c4a', margin: '0 0 14px' }}>
              Shop By <span>Department</span>
            </h2>
            <div className="teal-line" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: '#666', maxWidth: '640px', margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}>
              Discover our ethically sourced natural gems classified into three premier collections, ranging from precision-faceted collector gems to rare crystalline matrix specimens.
            </p>
          </div>
          
          {/* 3 Main Department Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {MAIN_CATEGORY_NAMES.map((mainName) => {
              const def = CATEGORY_TREE[mainName];
              const count = departmentCounts[mainName] || 0;
              const deptVarieties = getDeptVarieties(mainName);

              return (
                <div 
                  key={mainName} 
                  onClick={() => router.push(`/category/${def.slug}`)} 
                  style={{ 
                    cursor: 'pointer', 
                    background: '#fff', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid #e8e6e1',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = '#1a5c4a';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,92,74,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#e8e6e1';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/11', overflow: 'hidden' }}>
                    <Image 
                      src={def.image} 
                      alt={def.name} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      unoptimized 
                    />
                    <div style={{
                      position: 'absolute', top: '14px', right: '14px',
                      background: 'rgba(26,92,74,0.92)', color: '#fff',
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                      fontWeight: 600, backdropFilter: 'blur(4px)'
                    }}>
                      {count} {count === 1 ? 'Specimen' : 'Specimens'}
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '24px', color: '#1a5c4a', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                        {def.name}
                      </h3>
                      <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#666', lineHeight: 1.5 }}>
                        {def.description}
                      </p>

                      {/* Clickable Variety Stones: Opens dedicated page for each stone! */}
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>
                          Featured Varieties:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {deptVarieties.slice(0, 5).map((v) => {
                            const vSlug = slugifyCategory(v);
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/category/${vSlug}`);
                                }}
                                title={`Open dedicated ${v} page`}
                                style={{
                                  background: '#f8f7f5',
                                  color: '#1a5c4a',
                                  border: '1px solid #e2ded8',
                                  padding: '5px 11px',
                                  borderRadius: '16px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  fontFamily: "'DM Sans', sans-serif"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#1a5c4a';
                                  e.currentTarget.style.color = '#fff';
                                  e.currentTarget.style.borderColor = '#1a5c4a';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#f8f7f5';
                                  e.currentTarget.style.color = '#1a5c4a';
                                  e.currentTarget.style.borderColor = '#e2ded8';
                                }}
                              >
                                {v}
                              </button>
                            );
                          })}
                          {deptVarieties.length > 5 && (
                            <span 
                              style={{ 
                                fontSize: '11.5px', 
                                color: '#888', 
                                padding: '5px 4px', 
                                fontWeight: 600,
                                alignSelf: 'center'
                              }}
                            >
                              +{deptVarieties.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0eee9', paddingTop: '14px' }}>
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        Browse full department
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a5c4a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Explore Collection <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Browse Gemstone Varieties */}
          {popularVarieties.length > 0 && (
            <div style={{ textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '28px 24px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#888', fontWeight: 700 }}>
                Popular Gemstone Varieties (Dedicated Collections)
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                {popularVarieties.map((varName) => {
                  const vSlug = slugifyCategory(varName);
                  return (
                    <button
                      key={varName}
                      onClick={() => router.push(`/category/${vSlug}`)}
                      title={`Open dedicated ${varName} page`}
                      style={{
                        background: '#f8f7f5', color: '#1a5c4a', border: '1px solid #e2ded8',
                        padding: '8px 18px', borderRadius: '20px', fontSize: '13px',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: "'DM Sans', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1a5c4a';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = '#1a5c4a';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,92,74,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8f7f5';
                        e.currentTarget.style.color = '#1a5c4a';
                        e.currentTarget.style.borderColor = '#e2ded8';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      ✦ {varName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
      <div className="teal-divider"></div>
    </>
  );
}

