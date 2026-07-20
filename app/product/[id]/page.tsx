'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Truck, PackageCheck, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { formatPrice, parsePrice } from '@/utils/price';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, currency } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    const id = parseInt(resolvedParams.id);
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (product) {
      async function loadRelated() {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
          if (data.success && data.products) {
            const filtered = data.products
              .filter((p: any) => p.id !== product.id)
              .sort((a: any, b: any) => (a.cat === product.cat ? -1 : 1))
              .slice(0, 4);
            setRelated(filtered);
          }
        } catch (err) {
          console.error('Failed to load related products:', err);
        }
      }
      loadRelated();
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.priceNum, img: product.img, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isWished = wishlist.has(product.id);

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        .product-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        .product-image-wrap { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e8e6e1; }
        .btn-teal {
          flex: 1; background: #1a5c4a; color: #fff; padding: 18px; border: none; border-radius: 4px;
          font-size: 15px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: background 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .btn-teal:hover { background: #144638; }
        .btn-teal.added { background: #113328; }
        .qty-wrap { display: flex; border: 1px solid #e8e6e1; border-radius: 4px; overflow: hidden; height: 58px; width: 140px; }
        .qty-btn { width: 45px; background: transparent; border: none; font-size: 20px; cursor: pointer; color: #1a5c4a; transition: background 0.2s; }
        .qty-btn:hover { background: #f0eee9; }
        .qty-input { flex: 1; min-width: 0; text-align: center; border: none; font-size: 16px; font-weight: 600; color: #333; outline: none; background: transparent; }
        
        .wish-btn { 
          width: 58px; height: 58px; border: 1px solid #e8e6e1; border-radius: 4px; background: transparent;
          display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.2s; color: #1a5c4a;
        }
        .wish-btn:hover { border-color: #1a5c4a; background: #f8f7f5; }
        .wish-btn.active { color: #c94438; border-color: #c94438; background: #fff5f5; }

        .perks-row { display: flex; gap: 20px; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e8e6e1; }
        .perk { flex: 1; text-align: center; color: #555; }
        .perk svg { color: #c5a059; margin-bottom: 8px; }
        .perk span { display: block; font-size: 13px; font-weight: 500; }

        .tabs-container { max-width: 1200px; margin: 80px auto 0; background: #fff; border: 1px solid #e8e6e1; border-radius: 8px; overflow: hidden; }
        .tabs-header { display: flex; border-bottom: 1px solid #e8e6e1; background: #faf9f7; overflow-x: auto; }
        .tab-btn { flex: 1; padding: 20px; background: transparent; border: none; font-size: 16px; font-weight: 600; color: #555; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #fff; color: #1a5c4a; border-bottom: 3px solid #1a5c4a; }
        .tab-content { padding: 40px; line-height: 1.8; color: #555; }
        
        .related-section { max-width: 1200px; margin: 80px auto 0; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; margin-top: 30px; }
        .product-card { background: #fff; border-radius: 8px; border: 1px solid #e8e6e1; overflow: hidden; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-color: #1a5c4a; }
        .product-info { padding: 20px; }
        .btn-teal-outline {
          width: 100%; background: transparent; color: #1a5c4a; padding: 12px; border: 1px solid #1a5c4a; border-radius: 4px;
          font-size: 13px; font-weight: 500; text-transform: uppercase; margin-top: 16px; cursor: pointer; transition: all 0.3s;
          display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .product-card:hover .btn-teal-outline { background: #1a5c4a; color: #fff; }

        @media(max-width: 900px) {
          .product-container { grid-template-columns: 1fr; gap: 30px; }
          .tab-content { padding: 20px; }
        }
      `}} />

      <div className="product-container" style={{ position: 'relative' }}>
        <button 
          onClick={() => router.back()} 
          style={{ position: 'absolute', top: '-40px', left: 0, background: 'none', border: 'none', color: '#1a5c4a', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Left: Image Gallery */}
        <div className="product-image-wrap">
          <Image src={product.img} alt={product.name} width={800} height={800} style={{ width: '100%', height: 'auto', borderRadius: '4px', objectFit: 'cover', aspectRatio: '1/1' }} unoptimized />
        </div>

        {/* Right: Product Details */}
        <div style={{ padding: '20px 0' }}>
          <p style={{ color: '#1a5c4a', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>
            Category: <span style={{ color: '#c5a059' }}>{product.cat}</span>
          </p>
          <h1 className="heading-serif" style={{ fontSize: '42px', color: '#1a5c4a', margin: '0 0 20px', lineHeight: 1.2 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
            <span style={{ fontSize: '28px', color: '#1a5c4a', fontWeight: 700 }}>{formatPrice(product.priceNum, currency)}</span>
            {parsePrice(product.original) > 0 && <span style={{ fontSize: '18px', color: '#888', textDecoration: 'line-through' }}>{formatPrice(parsePrice(product.original), currency)}</span>}
          </div>

          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#555', marginBottom: '40px' }}>
            {product.desc}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div className="qty-wrap">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <input type="text" className="qty-input" value={qty} readOnly />
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button 
              className={`btn-teal ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button 
              className={`wish-btn ${isWished ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle Wishlist"
            >
              <Heart fill={isWished ? 'currentColor' : 'none'} size={24} />
            </button>
          </div>

          <div className="perks-row">
            <div className="perk">
              <ShieldCheck size={28} />
              <span>{product.cert}</span>
            </div>
            <div className="perk">
              <Truck size={28} />
              <span>Free Insured Shipping</span>
            </div>
            <div className="perk">
              <PackageCheck size={28} />
              <span>Secure Packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
          <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Additional Information</button>
          <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews (0)</button>
        </div>
        <div className="tab-content">
          {activeTab === 'description' && (
            <div>
              <h3 style={{ color: '#1a5c4a', marginBottom: '16px', fontSize: '22px' }} className="heading-serif">Product Description</h3>
              <p>{product.desc} All our gems are ethically sourced and inspected by certified gemologists to ensure you receive only the highest quality stones. Hand-selected for exceptional color, clarity, and cut.</p>
            </div>
          )}
          {activeTab === 'info' && (
            <div>
              <h3 style={{ color: '#1a5c4a', marginBottom: '16px', fontSize: '22px' }} className="heading-serif">Additional Information</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '12px 0', borderBottom: '1px solid #f0eee9' }}><strong>Origin:</strong> {product.origin}</li>
                <li style={{ padding: '12px 0', borderBottom: '1px solid #f0eee9' }}><strong>Treatment:</strong> {product.treatment}</li>
                <li style={{ padding: '12px 0', borderBottom: '1px solid #f0eee9' }}><strong>Certification:</strong> {product.cert}</li>
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              <h3 style={{ color: '#1a5c4a', marginBottom: '16px', fontSize: '22px' }} className="heading-serif">Customer Reviews</h3>
              <p>There are no reviews yet for this specific product. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="related-section">
        <h2 className="heading-serif" style={{ fontSize: '32px', color: '#1a5c4a', textAlign: 'center', margin: '0 0 10px 0' }}>Related Products</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '15px' }}>Customers also viewed these exclusive items</p>
        <div className="cat-grid">
          {related.map((rp) => (
            <div key={rp.id} className="product-card" onClick={() => router.push('/product/' + rp.id)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src={rp.img} alt={rp.name} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div className="product-info">
                <h3 className="heading-serif" style={{ fontSize: '18px', color: '#1a5c4a', margin: '0 0 8px 0', fontWeight: 600 }}>{rp.name}</h3>
                <p style={{ color: '#555', fontWeight: 500, fontSize: '15px', margin: 0 }}>{formatPrice(rp.priceNum, currency)}</p>
                <div className="btn-teal-outline">
                  <ShoppingBag size={16} /> View Details
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
