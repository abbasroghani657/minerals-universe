'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft, Package, Lock, ShieldCheck, Mail, Globe } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  priceUSD?: number;
}

interface LastOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  totalUSD?: number;
  currency?: string;
  currencySymbol?: string;
  paymentMethod: string;
  paymentStatus: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let raw = sessionStorage.getItem('minerals_universe_last_order');
    if (!raw) {
      raw = localStorage.getItem('minerals_universe_last_order');
    }
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch (err) {
        console.error('Failed to parse order receipt', err);
      }
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ padding: '140px 20px', textAlign: 'center', color: '#888', fontSize: '16px' }}>
        Loading order receipt…
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '140px 20px 80px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <CheckCircle2 size={48} color="#1a5c4a" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' }}>Order Successfully Received</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
            Thank you for your purchase with Minerals Universe! A confirmation email has been dispatched to your inbox.
          </p>
          <Link href="/shop" style={{ display: 'inline-block', background: '#1a5c4a', color: '#fff', padding: '12px 28px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none' }}>
            Explore More Gemstones
          </Link>
        </div>
      </div>
    );
  }

  const sym = order.currencySymbol || '$';
  const displayTotal = order.totalUSD ? `$${order.totalUSD.toFixed(2)} USD` : `${sym}${order.total.toLocaleString()}`;

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 80px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Success Header Card */}
        <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '12px', border: '1px solid #e8e6e1', textAlign: 'center', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eaf4f2', color: '#1a5c4a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
            <CheckCircle2 size={36} color="#1a5c4a" />
          </div>
          <h1 style={{ fontSize: '30px', margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif", color: '#1a5c4a', fontWeight: 600 }}>
            Payment Confirmed!
          </h1>
          <p style={{ color: '#555', fontSize: '15px', margin: '0 0 6px' }}>
            Thank you, <strong>{order.customerName}</strong>. Your payment was verified and processed securely via PayPal.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0faf8', color: '#1a5c4a', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginTop: '8px' }}>
            <ShieldCheck size={16} /> Status: {order.paymentStatus || 'Paid (PayPal)'}
          </div>
        </div>

        {/* Order Details Card */}
        <div style={{ background: '#fff', padding: '28px 32px', borderRadius: '12px', border: '1px solid #e8e6e1', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Reference</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a5c4a' }}>#{order.orderId}</p>
            </div>
            <div style={{ background: '#eaf4f2', color: '#1a5c4a', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
              {order.paymentMethod}
            </div>
          </div>

          {/* Items table */}
          <h3 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Purchased</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>
                <span style={{ color: '#444' }}>{item.quantity}× {item.name}</span>
                <span style={{ fontWeight: 600 }}>{item.priceUSD ? `$${item.priceUSD.toFixed(2)}` : `${sym}${item.price.toLocaleString()}`}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, paddingTop: '12px', borderTop: '2px solid #eee' }}>
            <span>Total Paid</span>
            <span style={{ color: '#1a5c4a', fontSize: '22px' }}>{displayTotal}</span>
          </div>
        </div>

        {/* Shipping Destination Info */}
        <div style={{ background: '#fff', padding: '24px 32px', borderRadius: '12px', border: '1px solid #e8e6e1', marginBottom: '20px', fontSize: '14px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Destination</h3>
          <p style={{ margin: '0 0 6px', color: '#444' }}><strong>Recipient:</strong> {order.customerName}</p>
          <p style={{ margin: '0 0 6px', color: '#444' }}><strong>Contact Phone:</strong> {order.customerPhone}</p>
          <p style={{ margin: 0, color: '#444' }}><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        </div>

        {/* Invoice & Tracking Email Notification Box */}
        <div style={{ background: '#f0faf8', border: '1px solid #cce8e2', padding: '18px 22px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', color: '#1a5c4a', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Mail size={22} style={{ flexShrink: 0 }} />
          <span>A formal receipt and courier tracking details have been emailed to <strong>{order.customerEmail}</strong>.</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/shop" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '14px 32px', 
              background: '#1a5c4a', 
              color: '#fff', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 4px 14px rgba(26,92,74,0.2)'
            }}
          >
            <ArrowLeft size={16} /> Return to Gemstone Gallery
          </Link>
        </div>

      </div>
    </div>
  );
}
