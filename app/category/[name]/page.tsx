'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/price';
import { CATEGORY_TREE, isPrimaryCategory, normalizeCategory, getProductBadge } from '@/utils/categories';

export default function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currency, exchangeRates } = useCart();
  const [mounted, setMounted] = useState(false);
  const [selectedSubVariety, setSelectedSubVariety] = useState<string>('All');

  // Decode the route param
  const rawParam = decodeURIComponent(resolvedParams.name);
  const normParam = normalizeCategory(rawParam);

  // Check if this is one of the 3 primary departments
  const matchedDepartment = Object.keys(CATEGORY_TREE).find(k => normalizeCategory(k) === normParam);
  const isDepartment = !!matchedDepartment;
  const displayName = matchedDepartment || rawParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const departmentDef = matchedDepartment ? CATEGORY_TREE[matchedDepartment] : null;

  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadCategoryProducts() {
      try {
        setLoading(true);
        const queryParam = matchedDepartment ? matchedDepartment : displayName;
        const res = await fetch(`/api/products?category=${encodeURIComponent(queryParam)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setCategoryProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [matchedDepartment, displayName]);

  // Extract unique varieties present in these products
  const availableVarieties = useMemo(() => {
    const vars = Array.from(new Set(categoryProducts.map(p => p.cat).filter(Boolean)));
    return ['All', ...vars];
  }, [categoryProducts]);

  // Filter products by sub-variety pill if selected
  const displayedProducts = useMemo(() => {
    if (selectedSubVariety === 'All') return categoryProducts;
    return categoryProducts.filter(p => p.cat?.toLowerCase() === selectedSubVariety.toLowerCase());
  }, [categoryProducts, selectedSubVariety]);

  if (!mounted) return null;

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 70px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        .cat-grid { max-width: 1200px; margin: 36px auto 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
        .product-card { background: #fff; border-radius: 8px; border: 1px solid #e8e6e1; overflow: hidden; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.06); border-color: #1a5c4a; }
        .product-info { padding: 20px; }
        .btn-teal-outline {
          width: 100%; background: transparent; color: #1a5c4a; padding: 12px; border: 1px solid #1a5c4a; border-radius: 4px;
          font-size: 13px; font-weight: 600; text-transform: uppercase; margin-top: 16px; cursor: pointer; transition: all 0.3s;
          display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .product-card:hover .btn-teal-outline { background: #1a5c4a; color: #fff; }
      `}} />

      {/* Category Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingBottom: '30px', borderBottom: '1px solid #e8e6e1', position: 'relative' }}>
        <button 
          onClick={() => router.back()} 
          style={{ position: 'absolute', top: 0, left: 0, background: 'none', border: 'none', color: '#1a5c4a', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <p style={{ color: '#c5a059', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
          {isDepartment ? '✦ Premier Department Collection ✦' : '✦ Gemstone Specimen ✦'}
        </p>
        <h1 className="heading-serif" style={{ fontSize: '46px', color: '#1a5c4a', margin: '0 0 14px 0' }}>{displayName}</h1>
        <p style={{ color: '#666', maxWidth: '640px', margin: '0 auto 20px', lineHeight: 1.6, fontSize: '15px' }}>
          {departmentDef 
            ? departmentDef.description 
            : `Explore our authenticated natural ${displayName.toLowerCase()} specimens. Ethically sourced and gemologically certified.`}
        </p>

        {/* If viewing a main department and varieties exist, show filter pills */}
        {isDepartment && availableVarieties.length > 2 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {availableVarieties.map((v) => {
              const isActive = selectedSubVariety.toLowerCase() === v.toLowerCase();
              return (
                <button
                  key={v}
                  onClick={() => setSelectedSubVariety(v)}
                  style={{
                    background: isActive ? '#1a5c4a' : '#fff',
                    color: isActive ? '#fff' : '#555',
                    border: isActive ? '1px solid #1a5c4a' : '1px solid #e2ded8',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {v === 'All' ? `All ${displayName}` : v}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#1a5c4a', fontWeight: 600 }}>
          💎 Loading collection items...
        </div>
      ) : displayedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '17px', color: '#666', marginBottom: '20px' }}>
            No gemstones are currently listed under <strong>{selectedSubVariety !== 'All' ? selectedSubVariety : displayName}</strong>.
          </p>
          <button 
            onClick={() => router.push('/shop')} 
            className="btn-teal-outline" 
            style={{ display: 'inline-flex', width: 'auto', padding: '12px 28px', background: '#1a5c4a', color: '#fff' }}
          >
            Browse Complete Catalog
          </button>
        </div>
      ) : (
        <div className="cat-grid">
          {displayedProducts.map((product) => (
            <div key={product.id} className="product-card" onClick={() => router.push('/product/' + product.id)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
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
