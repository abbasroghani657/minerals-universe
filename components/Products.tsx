'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const products = [
  { id: 1, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80', cat: 'Aquamarine', name: 'Natural Aquamarine Emerald Cut — 4.8 Cts', original: '$480', sale: '$385', sale_num: 385, badge: 'SALE', stock: 'Only 2 left' },
  { id: 2, img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=400&q=80', cat: 'Garnet', name: 'Deep Red Pyrope Garnet Oval — 3.2 Cts', original: '$320', sale: '$245', sale_num: 245, badge: 'SALE', stock: null },
  { id: 3, img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', cat: 'Tourmaline', name: 'Pink Tourmaline Cushion Cut — 6.1 Cts', original: '$920', sale: '$740', sale_num: 740, badge: 'SALE', stock: 'Only 1 left' },
  { id: 4, img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=400&q=80', cat: 'Topaz', name: 'Imperial Topaz Pear Shape — 7.4 Cts', original: '$650', sale: '$510', sale_num: 510, badge: 'SALE', stock: null },
];

export default function Products() {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [added, setAdded] = useState<Set<number>>(new Set());
  const router = useRouter();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_num,
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
            {products.map(product => (
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
