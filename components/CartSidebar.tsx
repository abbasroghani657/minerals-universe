'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/price';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cartItems, cartCount, updateQuantity, removeFromCart, currency } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Body scroll lock
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  // Accessibility: Focus trap & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.addEventListener('keydown', handleKeyDown);
      sidebarRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          backdropFilter: 'blur(2px)'
        }}
        onClick={closeCart}
      />
      
      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: 0, right: 0,
          width: '400px', maxWidth: '100vw',
          height: '100vh',
          backgroundColor: '#fff',
          zIndex: 1000,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column',
          outline: 'none',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', margin: 0, fontFamily: "'Inter', sans-serif" }}>Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--muted)' }} aria-label="Close Cart">×</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <p>Your cart is empty.</p>
              <button onClick={closeCart} className="btn-outline-teal" style={{ marginTop: '16px' }}>Continue Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Image src={item.img} alt={item.name} width={80} height={80} style={{ objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} unoptimized />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--teal-dark)' }}>{formatPrice(item.price, currency)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Decrease quantity">-</button>
                        <span style={{ padding: '0 8px', fontSize: '14px', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438', padding: '4px', alignSelf: 'flex-start' }} title="Remove item" aria-label="Remove item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--teal-dark)' }}>{formatPrice(subtotal, currency)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-teal" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
        
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>
    </>
  );
}
