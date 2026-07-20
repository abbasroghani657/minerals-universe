'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/price';

export default function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currency } = useCart();
  const [mounted, setMounted] = useState(false);
  const categoryName = decodeURIComponent(resolvedParams.name).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadCategoryProducts() {
      try {
        const res = await fetch(`/api/products?category=${categoryName}`);
        const data = await res.json();
        if (data.success && data.products) {
          setCategoryProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load category products:', err);
      }
    }
    loadCategoryProducts();
  }, [categoryName]);

  if (!mounted) return null;

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        .cat-grid { max-width: 1200px; margin: 40px auto 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
        .product-card { background: #fff; border-radius: 8px; border: 1px solid #e8e6e1; overflow: hidden; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-color: #1a5c4a; }
        .product-info { padding: 20px; }
        .btn-teal-outline {
          width: 100%; background: transparent; color: #1a5c4a; padding: 12px; border: 1px solid #1a5c4a; border-radius: 4px;
          font-size: 13px; font-weight: 500; text-transform: uppercase; margin-top: 16px; cursor: pointer; transition: all 0.3s;
          display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .product-card:hover .btn-teal-outline { background: #1a5c4a; color: #fff; }
      `}} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingBottom: '30px', borderBottom: '1px solid #e8e6e1', position: 'relative' }}>
        <button 
          onClick={() => router.back()} 
          style={{ position: 'absolute', top: 0, left: 0, background: 'none', border: 'none', color: '#1a5c4a', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <p style={{ color: '#c5a059', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>✦ Collection ✦</p>
        <h1 className="heading-serif" style={{ fontSize: '46px', color: '#1a5c4a', margin: '0 0 16px 0' }}>{categoryName}</h1>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore our exclusive collection of {categoryName.toLowerCase()}. Ethically sourced and carefully curated to ensure only the highest quality specimens make it to your collection.
        </p>
      </div>

      <div className="cat-grid">
        {categoryProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => router.push('/product/' + product.id)}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
              <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
            </div>
            <div className="product-info">
              <h3 className="heading-serif" style={{ fontSize: '18px', color: '#1a5c4a', margin: '0 0 8px 0', fontWeight: 600 }}>{product.name}</h3>
              <p style={{ color: '#555', fontWeight: 500, fontSize: '15px', margin: 0 }}>{formatPrice(product.priceNum, currency)}</p>
              <div className="btn-teal-outline">
                <ShoppingBag size={16} /> View Details
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
