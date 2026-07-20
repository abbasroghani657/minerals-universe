'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Products() {
  const [homeProducts, setHomeProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          // Filter to first 4 products
          setHomeProducts(data.products.filter((p: any) => [1, 2, 3, 4].includes(p.id)));
        }
      } catch (err) {
        console.error('Error loading products for homepage:', err);
      }
    }
    fetchHomeProducts();
  }, []);
  const { addToCart, wishlist, toggleWishlist } = useCart();
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
      <section id="products" style={{ background: 'var(--bg)' }}>
        <div className="section-inner">
          <div className="text-center">
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ New Arrivals</p>
            <h2 className="section-title">Latest <span>Products</span></h2>
            <div className="teal-line"></div>
          </div>
          <div className="products-grid">
            {homeProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => router.push(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-img">
                  <Image src={product.img} alt={product.cat} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
                  {product.badge && <span className="badge-sale">{product.badge}</span>}
                  {product.stock && <span className="badge-stock">{product.stock}</span>}
                  <button
                    className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    aria-label="Toggle wishlist"
                  >
                    {wishlist.has(product.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="product-info">
                  <span className="cat-tag">{product.cat}</span>
                  <h3>{product.name}</h3>
                  <div className="stars">★★★★★</div>
                  <div className="price-row">
                    <span className="price-original">{product.original}</span>
                    <span className="price-sale">{product.sale}</span>
                  </div>
                  <button
                    className={`add-btn${added.has(product.id) ? ' added' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  >
                    {added.has(product.id) ? '✓ Added!' : 'Add to Cart'}
                  </button>
                  <a href="https://wa.me/923001581210" className="whatsapp-link" target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>💬 Ask on WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '50px' }}>
            <button className="btn-outline-teal" onClick={() => router.push('/shop')}>View All Products</button>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
