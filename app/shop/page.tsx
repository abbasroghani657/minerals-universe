'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/price';
import { Search, X, Layers, ShoppingBag } from 'lucide-react';
import { CATEGORY_TREE, MAIN_CATEGORY_NAMES, inferMainCategory, isPrimaryCategory, normalizeCategory, getProductBadge } from '@/utils/categories';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || 'All';
  const initialMain = searchParams.get('mainCategory') || 'All';

  const { addToCart, wishlist, toggleWishlist, currency, exchangeRates } = useCart();
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Department Filter
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    isPrimaryCategory(initialCat) ? initialCat : initialMain
  );

  // Variety Filter
  const [selectedVariety, setSelectedVariety] = useState<string>(
    !isPrimaryCategory(initialCat) ? initialCat : 'All'
  );

  const [loading, setLoading] = useState(true);

  // Sync URL search queries
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);

    const catParam = searchParams.get('category');
    if (catParam) {
      if (isPrimaryCategory(catParam)) {
        setSelectedDepartment(catParam);
        setSelectedVariety('All');
      } else {
        setSelectedVariety(catParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadShopData() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, []);

  // Varieties available for current department
  const availableVarieties = useMemo(() => {
    const subset = selectedDepartment === 'All'
      ? products
      : products.filter(p => (p.mainCat || inferMainCategory(p.cat)) === selectedDepartment);

    const vars = Array.from(new Set(subset.map(p => p.cat).filter(Boolean)));
    return ['All', ...vars];
  }, [products, selectedDepartment]);

  // Filtered products based on search, department, and variety
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const parentCat = p.mainCat || inferMainCategory(p.cat);

      // 1. Department match
      if (selectedDepartment !== 'All') {
        const normDep = normalizeCategory(selectedDepartment);
        const normParent = normalizeCategory(parentCat);
        if (normDep !== normParent) return false;
      }

      // 2. Variety match
      if (selectedVariety !== 'All') {
        if (p.cat?.toLowerCase() !== selectedVariety.toLowerCase()) return false;
      }

      // 3. Search query match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.cat?.toLowerCase().includes(q) ||
        parentCat.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.origin && p.origin.toLowerCase().includes(q)) ||
        (p.cert && p.cert.toLowerCase().includes(q))
      );
    });
  }, [products, searchQuery, selectedDepartment, selectedVariety]);

  // Grouped by Department when no search or specific variety is selected
  const groupedDepartments = useMemo(() => {
    if (searchQuery.trim() || selectedVariety !== 'All') return [];
    
    const depts = selectedDepartment === 'All' ? MAIN_CATEGORY_NAMES : [selectedDepartment];
    return depts.map(dept => {
      const normDept = normalizeCategory(dept);
      const items = products.filter(p => normalizeCategory(p.mainCat || inferMainCategory(p.cat)) === normDept);
      return {
        department: dept,
        items
      };
    }).filter(g => g.items.length > 0);
  }, [products, searchQuery, selectedDepartment, selectedVariety]);

  const handleAddToCart = (item: any) => {
    addToCart({ id: item.id, name: item.name, price: Number(item.priceNum), img: item.img });
    setAdded(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedVariety('All');
    router.push('/shop');
  };

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '28px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        .category-section { max-width: 1200px; margin: 0 auto 60px; }
        .category-title { font-size: 32px; color: #1a5c4a; margin-bottom: 24px; border-bottom: 1px solid #e8e6e1; padding-bottom: 12px; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
        .product-card { background: #fff; border-radius: 8px; border: 1px solid #e8e6e1; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(15,92,83,0.08); border-color: #1a5c4a; }
        .product-img { position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; }
        .product-img img { transition: transform 0.5s ease; }
        .product-card:hover .product-img img { transform: scale(1.05); }
        .badge-sale { position: absolute; top: 12px; left: 12px; background: #c94438; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px; z-index: 2; }
        .wishlist-btn { position: absolute; top: 12px; right: 12px; background: #fff; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 18px; color: #aaa; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s ease; z-index: 2; }
        .wishlist-btn:hover, .wishlist-btn.active { color: #c94438; }
        .product-info { padding: 22px; }
        .product-info h4 { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; margin: 0 0 10px 0; color: #1a5c4a; line-height: 1.3; }
        .price-row { display: flex; alignItems: center; gap: 12px; margin-bottom: 18px; }
        .sale-price { color: #1a5c4a; font-weight: 700; font-size: 17px; }
        .original-price { color: #888; text-decoration: line-through; font-size: 14px; }
        .add-btn { width: 100%; background: transparent; color: #1a5c4a; border: 1px solid #1a5c4a; padding: 12px; border-radius: 4px; font-size: 13px; font-weight: 600; text-transform: uppercase; cursor: pointer; transition: all 0.3s; margin-bottom: 10px; }
        .add-btn:hover, .add-btn.added { background: #1a5c4a; color: #fff; }
      `}} />

      {/* Hero Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '36px' }}>
        <h1 className="heading-serif" style={{ fontSize: '46px', color: '#1a5c4a', margin: '0 0 14px 0' }}>
          {searchQuery.trim() ? `Search Results` : `Natural Gemstones & Crystals`}
        </h1>
        <p style={{ color: '#666', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6, fontSize: '15px' }}>
          Explore our certified collection of precision-faceted gems, natural crystalline clusters, and polished specimens.
        </p>

        {/* Live Search Bar */}
        <div style={{ maxWidth: '580px', margin: '0 auto 24px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="text"
                placeholder="Search by gemstone name, origin, certificate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 40px 14px 44px',
                  borderRadius: '30px',
                  border: '1px solid #d4cfc7',
                  background: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#888'
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-teal"
              style={{
                borderRadius: '30px', padding: '0 24px', fontSize: '13.5px',
                fontWeight: 600, background: '#1a5c4a', color: '#fff', border: 'none', cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Tier 1: Department Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', maxWidth: '800px', margin: '0 auto 16px' }}>
          {['All', ...MAIN_CATEGORY_NAMES].map((dept) => {
            const isActive = selectedDepartment === dept;
            const label = dept === 'All' ? 'All Departments' : dept === 'Loose Gemstones' ? '💎 Loose Gemstones' : dept === 'Minerals & Crystals' ? '🔮 Minerals & Crystals' : '🪨 Polished Stones';

            return (
              <button
                key={dept}
                onClick={() => { setSelectedDepartment(dept); setSelectedVariety('All'); }}
                style={{
                  background: isActive ? '#1a5c4a' : '#fff',
                  color: isActive ? '#fff' : '#444',
                  border: isActive ? '1px solid #1a5c4a' : '1px solid #dcd7ce',
                  padding: '9px 20px',
                  borderRadius: '24px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 12px rgba(26,92,74,0.18)' : '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tier 2: Variety Filter Pills */}
        {availableVarieties.length > 2 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', maxWidth: '940px', margin: '0 auto' }}>
            {availableVarieties.map((v) => {
              const isActive = selectedVariety.toLowerCase() === v.toLowerCase();
              return (
                <button
                  key={v}
                  onClick={() => setSelectedVariety(v)}
                  style={{
                    background: isActive ? '#1a5c4a' : '#f0eee9',
                    color: isActive ? '#fff' : '#666',
                    border: 'none',
                    padding: '5px 14px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {v === 'All' ? (selectedDepartment === 'All' ? 'All Varieties' : `All ${selectedDepartment}`) : v}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#1a5c4a', fontWeight: 600 }}>
          💎 Loading certified gemstone collection...
        </div>
      ) : searchQuery.trim() || selectedVariety !== 'All' ? (
        /* Results View */
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e8e6e1', paddingBottom: '12px' }}>
            <h2 className="heading-serif" style={{ fontSize: '26px', color: '#1a5c4a', margin: 0 }}>
              Found {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'}
              {searchQuery ? ` for "${searchQuery}"` : selectedVariety !== 'All' ? ` in ${selectedVariety}` : ''}
            </h2>
            <button
              onClick={clearSearch}
              style={{
                background: 'none', border: 'none', color: '#c94438',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}
            >
              Clear Filters <X size={14} />
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1' }}>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '16px' }}>No gemstones matched your criteria.</p>
              <button onClick={clearSearch} className="btn-teal" style={{ padding: '12px 24px', borderRadius: '6px' }}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="product-card" onClick={() => router.push(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="product-img">
                    <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    {(() => {
                      const b = getProductBadge(product.badge);
                      return b ? (
                        <span 
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: b.bg,
                            color: b.color,
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 2,
                          }}
                        >
                          {b.icon} {b.text}
                        </span>
                      ) : null;
                    })()}
                    <button
                      className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      aria-label="Wishlist"
                    >
                      {wishlist.has(product.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="product-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', fontWeight: 600 }}>{product.cat}</span>
                      <span style={{ fontSize: '11px', color: '#1a5c4a', fontWeight: 600 }}>{product.origin || 'Pakistan'}</span>
                    </div>
                    <h4>{product.name}</h4>
                    <div className="price-row">
                      <span className="sale-price">{formatPrice(product.priceNum, currency, exchangeRates)}</span>
                      {product.original && (
                        <span className="original-price">{product.original}</span>
                      )}
                    </div>
                    <button
                      className={`add-btn${added.has(product.id) ? ' added' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    >
                      {added.has(product.id) ? '✓ Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Department Grouped View */
        groupedDepartments.map((group) => (
          <div key={group.department} className="category-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', borderBottom: '1px solid #e8e6e1', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: '#c5a059', fontWeight: 700 }}>✦ Collection</span>
                <h2 className="heading-serif" style={{ fontSize: '32px', color: '#1a5c4a', margin: '4px 0 0 0' }}>{group.department}</h2>
              </div>
              <button 
                onClick={() => router.push(`/category/${group.department === 'Loose Gemstones' ? 'loose-gemstones' : group.department === 'Minerals & Crystals' ? 'minerals-and-crystals' : 'polished-stones'}`)}
                style={{ background: 'none', border: 'none', color: '#1a5c4a', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All {group.department} ({group.items.length}) →
              </button>
            </div>
            
            <div className="products-grid">
              {group.items.map((product: any) => (
                <div key={product.id} className="product-card" onClick={() => router.push(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="product-img">
                    <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    {(() => {
                      const b = getProductBadge(product.badge);
                      return b ? (
                        <span 
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: b.bg,
                            color: b.color,
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 2,
                          }}
                        >
                          {b.icon} {b.text}
                        </span>
                      ) : null;
                    })()}
                    <button
                      className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      aria-label="Wishlist"
                    >
                      {wishlist.has(product.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="product-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', fontWeight: 600 }}>{product.cat}</span>
                      <span style={{ fontSize: '11px', color: '#1a5c4a', fontWeight: 600 }}>{product.origin || 'Pakistan'}</span>
                    </div>
                    <h4>{product.name}</h4>
                    <div className="price-row">
                      <span className="sale-price">{formatPrice(product.priceNum, currency, exchangeRates)}</span>
                      {product.original && (
                        <span className="original-price">{product.original}</span>
                      )}
                    </div>
                    <button
                      className={`add-btn${added.has(product.id) ? ' added' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    >
                      {added.has(product.id) ? '✓ Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '36px 20px', textAlign: 'center', color: '#1a5c4a' }}>Loading shop catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
