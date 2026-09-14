'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Truck, PackageCheck, ArrowLeft, Heart, ShoppingBag, Award } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { formatPrice, parsePrice } from '@/utils/price';
import { DEFAULT_PRODUCTS } from '@/lib/defaultData';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, currency, exchangeRates } = useCart();
  
  const parsedId = parseInt(resolvedParams.id);
  const initialProduct = DEFAULT_PRODUCTS.find(p => p.id === parsedId) || null;
  const [product, setProduct] = useState<any>(initialProduct);

  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products?id=${parsedId}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.name) {
            document.title = `${data.product.name} | Minerals Universe`;
          }
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      }
    }
    loadProduct();
  }, [parsedId]);

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
  }, [product?.id, product?.cat]);

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', background: '#f8f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid rgba(26,92,74,0.2)', borderTopColor: '#1a5c4a', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }}></div>
          <span>Unveiling Gemstone Details...</span>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.priceNum, img: product.img, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isWished = wishlist.has(product.id);

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '28px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
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
          .product-container { grid-template-columns: 1fr; gap: 24px; }
          .tab-content { padding: 20px; }
          .cat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .cat-grid .product-info {
            padding: 12px 10px !important;
          }
          .cat-grid h4 {
            font-size: 14px !important;
            margin-bottom: 6px !important;
          }
          .product-actions-wrap {
            gap: 10px !important;
          }
          .product-title-heading {
            font-size: clamp(24px, 6.5vw, 36px) !important;
          }
        }
        @media(max-width: 480px) {
          .trust-badge-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

      <div style={{ maxWidth: '1200px', margin: '0 auto 20px' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', color: '#1a5c4a', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="product-container">

        {/* Left: Image Gallery */}
        <div className="product-image-wrap">
          <Image src={product.img} alt={product.name} width={800} height={800} style={{ width: '100%', height: 'auto', borderRadius: '4px', objectFit: 'cover', aspectRatio: '1/1' }} unoptimized />
        </div>

        {/* Right: Product Details */}
        <div style={{ padding: '20px 0' }}>
          <p style={{ color: '#1a5c4a', fontSize: '12.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span 
              onClick={() => router.push(`/category/${encodeURIComponent((product.mainCat || 'Loose Gemstones').toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-'))}`)}
              style={{ color: '#1a5c4a', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {product.mainCat || 'Loose Gemstones'}
            </span>
            <span style={{ color: '#aaa' }}>/</span>
            <span 
              onClick={() => router.push(`/category/${encodeURIComponent(product.cat.toLowerCase().replace(/ /g, '-'))}`)}
              style={{ color: '#c5a059', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {product.cat}
            </span>
          </p>
          <h1 className="heading-serif product-title-heading" style={{ fontSize: '42px', color: '#1a5c4a', margin: '0 0 20px', lineHeight: 1.2 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
            <span style={{ fontSize: '28px', color: '#1a5c4a', fontWeight: 700 }}>{formatPrice(product.priceNum, currency, exchangeRates)}</span>
            {parsePrice(product.original) > 0 && <span style={{ fontSize: '18px', color: '#888', textDecoration: 'line-through' }}>{formatPrice(parsePrice(product.original), currency, exchangeRates)}</span>}
          </div>


          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#555', marginBottom: '40px' }}>
            {product.desc}
          </p>

          <div className="product-actions-wrap" style={{ display: 'flex', gap: '16px', marginBottom: '30px', flexWrap: 'wrap' }}>
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

                    {/* WhatsApp VIP Inquire & Daylight Video Request */}
          <a
            href={`https://wa.me/923001581210?text=${encodeURIComponent(
              `Hello Minerals Universe, I am interested in inquiring about this gemstone specimen:\n\n` +
              `💎 Item: ${product.name}\n` +
              `📂 Category: ${product.cat}\n` +
              `💰 Price: ${formatPrice(product.priceNum, currency, exchangeRates)}\n\n` +
              `Could you please share daylight 4K videos, certificate details, and international shipping options?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              padding: "16px 24px",
              background: "#25D366",
              color: "#fff",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.5px",
              margin: "0 0 24px 0",
              boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
              transition: "all 0.3s"
            }}
          >
            <FaWhatsapp size={22} /> Inquire / Request 4K Video via WhatsApp
          </a>

          {/* 4 Luxury International Trust Badges */}
          <div className="trust-badge-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginTop: "10px", paddingTop: "20px", borderTop: "1px solid #e8e6e1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#faf9f7", borderRadius: "6px" }}>
              <ShieldCheck size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#333", display: "block" }}>100% Certified Natural</span>
                <span style={{ fontSize: "11px", color: "#777" }}>{product.cert || "Authenticity Guaranteed"}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#faf9f7", borderRadius: "6px" }}>
              <Truck size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#333", display: "block" }}>Worldwide Express</span>
                <span style={{ fontSize: "11px", color: "#777" }}>DHL / FedEx Insured</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#faf9f7", borderRadius: "6px" }}>
              <PackageCheck size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#333", display: "block" }}>Tamper-Proof Box</span>
                <span style={{ fontSize: "11px", color: "#777" }}>Collector Packaging</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#faf9f7", borderRadius: "6px" }}>
              <Award size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#333", display: "block" }}>Mine-Direct Source</span>
                <span style={{ fontSize: "11px", color: "#777" }}>Peshawar / Northern Mines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      
      {/* Google SEO JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": [product.img],
            "description": product.desc,
            "sku": `MU-${product.id}`,
            "brand": {
              "@type": "Brand",
              "name": "Minerals Universe"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.priceNum,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Minerals Universe"
              }
            }
          })
        }}
      />

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
                <p style={{ color: '#555', fontWeight: 500, fontSize: '15px', margin: 0 }}>{formatPrice(rp.priceNum, currency, exchangeRates)}</p>

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
