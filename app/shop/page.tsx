'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const categorizedProducts = [
  { category: 'Sapphire', items: [{ id: 101, img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', name: 'Royal Blue Sapphire', original: '$1200', sale: '$950', sale_num: 950, badge: 'PREMIUM' }] },
  { category: 'Ruby', items: [{ id: 102, img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=400&q=80', name: 'Pigeon Blood Ruby', original: null, sale: '$1500', sale_num: 1500, badge: 'RARE' }] },
  { category: 'Emerald', items: [{ id: 103, img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80', name: 'Vivid Green Emerald', original: '$850', sale: '$720', sale_num: 720, badge: '' }] },
  { category: 'Aquamarine', items: [
      { id: 1, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80', name: 'Natural Aquamarine Emerald Cut', original: '$480', sale: '$385', sale_num: 385, badge: 'SALE' },
      { id: 6, img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&q=80', name: 'Ocean Blue Aquamarine Round', original: null, sale: '$490', sale_num: 490, badge: '' }
  ] },
  { category: 'Tourmaline', items: [
      { id: 3, img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', name: 'Pink Tourmaline Cushion Cut', original: null, sale: '$740', sale_num: 740, badge: 'NEW' },
      { id: 7, img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80', name: 'Watermelon Tourmaline Slice', original: '$1200', sale: '$950', sale_num: 950, badge: 'RARE' }
  ] },
  { category: 'Topaz', items: [{ id: 4, img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=400&q=80', name: 'Imperial Topaz Pear Shape', original: null, sale: '$510', sale_num: 510, badge: '' }] },
  { category: 'Garnet', items: [{ id: 2, img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=400&q=80', name: 'Deep Red Pyrope Garnet Oval', original: '$320', sale: '$245', sale_num: 245, badge: 'BEST SELLER' }] },
  { category: 'Kunzite', items: [{ id: 108, img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', name: 'Lilac Pink Kunzite', original: null, sale: '$340', sale_num: 340, badge: '' }] },
  { category: 'Opals', items: [{ id: 109, img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=400&q=80', name: 'Ethiopian Welo Opal', original: '$220', sale: '$180', sale_num: 180, badge: '' }] },
  { category: 'Peridot', items: [{ id: 110, img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80', name: 'Apple Green Peridot', original: null, sale: '$150', sale_num: 150, badge: '' }] },
  { category: 'Zircon', items: [{ id: 111, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80', name: 'Blue Zircon Round Cut', original: null, sale: '$210', sale_num: 210, badge: '' }] },
  { category: 'Morganite', items: [{ id: 112, img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', name: 'Peach Morganite Oval', original: '$450', sale: '$380', sale_num: 380, badge: '' }] },
  { category: 'Quartz', items: [{ id: 113, img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&q=80', name: 'Clear Quartz Cluster', original: null, sale: '$90', sale_num: 90, badge: '' }] },
  { category: 'Amethyst', items: [{ id: 114, img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80', name: 'Deep Purple Amethyst Geode', original: '$200', sale: '$160', sale_num: 160, badge: 'POPULAR' }] },
  { category: 'Lapis Lazuli', items: [{ id: 115, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80', name: 'Afghan Lapis Lazuli Polished', original: null, sale: '$120', sale_num: 120, badge: '' }] }
];

export default function ShopPage() {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddToCart = (item: any) => {
    addToCart({ id: item.id, name: item.name, price: item.sale_num, img: item.img });
    setAdded(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        
        .category-section {
          max-width: 1200px;
          margin: 0 auto 60px;
        }
        
        .category-title {
          font-size: 32px;
          color: #1a5c4a;
          margin-bottom: 24px;
          border-bottom: 1px solid #e8e6e1;
          padding-bottom: 12px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .product-card {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(15,92,83,0.08);
          border-color: #1a5c4a;
        }

        .product-img {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1;
          overflow: hidden;
        }

        .product-img img {
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-img img {
          transform: scale(1.05);
        }

        .badge-sale {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #c94438;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          letter-spacing: 1px;
        }

        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #fff;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #aaa;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .wishlist-btn:hover {
          color: #c94438;
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          color: #c94438;
        }

        .product-info {
          padding: 24px;
        }

        .product-info h4 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 10px 0;
          color: #1a5c4a;
          line-height: 1.3;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .sale-price {
          color: #1a5c4a;
          font-weight: 600;
          font-size: 16px;
        }

        .original-price {
          color: #888;
          text-decoration: line-through;
          font-size: 14px;
        }

        .add-btn {
          width: 100%;
          background: transparent;
          color: #1a5c4a;
          border: 1px solid #1a5c4a;
          padding: 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 10px;
        }

        .add-btn:hover {
          background: #1a5c4a;
          color: #fff;
        }

        .add-btn.added {
          background: #1a5c4a;
          color: #fff;
        }
      `}} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="heading-serif" style={{ fontSize: '48px', color: '#1a5c4a', margin: '0 0 16px 0' }}>All Gemstones</h1>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore our complete collection of natural, certified gemstones organized by category.
        </p>
      </div>

      {categorizedProducts.map((catGroup, index) => (
        <div key={index} className="category-section">
          <h2 className="heading-serif category-title">{catGroup.category}</h2>
          
          <div className="products-grid">
            {catGroup.items.map(product => (
              <div key={product.id} className="product-card" onClick={() => router.push('/product/' + product.id)} style={{ cursor: 'pointer' }}>
                <div className="product-img">
                  <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  {product.badge && <span className="badge-sale">{product.badge}</span>}
                  
                  <button
                    className={`wishlist-btn${wishlist.has(product.id) ? ' active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    aria-label="Toggle wishlist"
                  >
                    {wishlist.has(product.id) ? '♥' : '♡'}
                  </button>
                </div>
                
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <div className="price-row">
                    <span className="sale-price">{product.sale.replace('$', 'PKR ')}</span>
                    {product.original && <span className="original-price">{product.original.replace('$', 'PKR ')}</span>}
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
      ))}
    </div>
  );
}
