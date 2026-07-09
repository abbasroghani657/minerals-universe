'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: '#333' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        
        .heading-serif { font-family: 'Cormorant Garamond', serif; }
        .cart-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 380px; gap: 40px; }
        .cart-card { background: #fff; border-radius: 8px; padding: 40px; border: 1px solid #e8e6e1; }
        .cart-item { display: flex; gap: 24px; padding: 24px 0; border-bottom: 1px solid #eee; }
        .cart-item:last-child { border-bottom: none; padding-bottom: 0; }
        .cart-item:first-child { padding-top: 0; }
        
        .qty-btn { background: none; border: none; cursor: pointer; padding: 4px 12px; font-size: 16px; color: #555; }
        .qty-display { padding: 0 12px; font-size: 15px; border-left: 1px solid #eee; border-right: 1px solid #eee; }
        .qty-controls { display: inline-flex; align-items: center; border: 1px solid #e8e6e1; border-radius: 4px; margin-top: 12px; }
        
        .btn-teal {
          width: 100%; background: #1a5c4a; color: #fff; padding: 18px; border: none; border-radius: 4px;
          font-size: 15px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: background 0.3s; display: flex; justify-content: center; align-items: center; gap: 10px;
        }
        .btn-teal:hover { background: #144638; }
        
        @media(max-width: 900px) {
          .cart-container { grid-template-columns: 1fr; }
          .cart-item { flex-direction: column; }
        }
      `}} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '40px' }}>
        <h1 className="heading-serif" style={{ fontSize: '42px', color: '#1a5c4a', margin: '0 0 10px 0', textAlign: 'center' }}>Your Shopping Cart</h1>
        <p style={{ textAlign: 'center', color: '#666' }}>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '60px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🛒</div>
          <h2 className="heading-serif" style={{ fontSize: '28px', color: '#1a5c4a', marginBottom: '16px' }}>Your cart is empty</h2>
          <p style={{ color: '#666', marginBottom: '32px' }}>Explore our collection of premium gemstones and minerals to find something you love.</p>
          <button onClick={() => router.push('/#categories')} className="btn-teal" style={{ maxWidth: '250px', margin: '0 auto' }}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          {/* Left Column: Items */}
          <div className="cart-card">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <Image src={item.img} alt={item.name} width={120} height={120} style={{ objectFit: 'cover', borderRadius: '4px' }} unoptimized />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 8px 0', fontWeight: 600 }}>{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438' }} title="Remove item">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p style={{ color: '#1a5c4a', fontWeight: 600, fontSize: '16px', margin: '0' }}>PKR {item.price.toLocaleString()}</p>
                  
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn" aria-label="Decrease quantity">-</button>
                    <span className="qty-display">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn" aria-label="Increase quantity">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="cart-card" style={{ position: 'sticky', top: '100px' }}>
              <h2 className="heading-serif" style={{ fontSize: '24px', color: '#1a5c4a', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#555' }}>
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: '#555' }}>
                <span>Shipping</span>
                <span style={{ color: '#1a5c4a', fontWeight: 500 }}>Calculated at checkout</span>
              </div>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span className="heading-serif" style={{ fontSize: '20px', fontWeight: 600 }}>Estimated Total</span>
                <span className="heading-serif" style={{ fontSize: '24px', color: '#1a5c4a', fontWeight: 700 }}>PKR {subtotal.toLocaleString()}</span>
              </div>

              <button onClick={() => router.push('/checkout')} className="btn-teal">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
