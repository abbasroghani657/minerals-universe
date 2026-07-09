'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface LastOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('minerals_universe_last_order');
    if (!raw) {
      router.push('/');
      return;
    }
    // Read once then clear so refresh doesn't re-show stale data
    sessionStorage.removeItem('minerals_universe_last_order');
    setOrder(JSON.parse(raw));
  }, [router]);

  if (!order) {
    return (
      <div style={{ padding: '140px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: '16px' }}>
        Redirecting…
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '110px 20px 60px' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        {/* Success Card */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>
            ✅
          </div>
          <h1 style={{ fontSize: '26px', margin: '0 0 8px', fontFamily: "'Playfair Display', serif", color: 'var(--teal-dark)' }}>
            Thank you, {order.customerName.split(' ')[0]}!
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', margin: 0 }}>Your order has been placed successfully.</p>
        </div>

        {/* Order Details Card */}
        <div style={{ background: '#fff', padding: '28px 32px', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--teal-dark)' }}>#{order.orderId}</p>
            </div>
            <div style={{ background: 'var(--teal-pale)', color: 'var(--teal-dark)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
              {order.paymentMethod}
            </div>
          </div>

          {/* Items table */}
          <h3 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid var(--bg)', paddingBottom: '10px' }}>
                <span style={{ color: '#444' }}>{item.quantity}× {item.name}</span>
                <span style={{ fontWeight: 600 }}>PKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, paddingTop: '8px', borderTop: '2px solid var(--border)' }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--teal-dark)' }}>PKR {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div style={{ background: '#fff', padding: '20px 32px', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: '16px', fontSize: '14px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333' }}>Shipping Information</h3>
          <p style={{ margin: '0 0 4px', color: '#444' }}><strong>Name:</strong> {order.customerName}</p>
          <p style={{ margin: '0 0 4px', color: '#444' }}><strong>Phone:</strong> {order.customerPhone}</p>
          <p style={{ margin: 0, color: '#444' }}><strong>Address:</strong> {order.shippingAddress}</p>
        </div>

        {/* Email note */}
        <div style={{ background: 'var(--teal-pale)', padding: '16px 20px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px', color: 'var(--teal-dark)', textAlign: 'center' }}>
          📧 A confirmation email has been sent to <strong>{order.customerEmail}</strong>
        </div>

        {/* Next steps */}
        <div style={{ background: '#fff', padding: '20px 32px', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: '24px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 10px', color: '#333' }}>What happens next?</h3>
          <p style={{ margin: '0 0 6px' }}>✅ &nbsp;Your order will be processed within <strong>1–2 business days</strong>.</p>
          <p style={{ margin: '0 0 6px' }}>📦 &nbsp;You'll receive a shipping update once dispatched.</p>
          <p style={{ margin: 0 }}>❓ &nbsp;Questions? Contact us at <a href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'support@mineralsuniverse.com'}`} style={{ color: 'var(--teal)' }}>support@mineralsuniverse.com</a></p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="btn-teal" style={{ display: 'inline-block', padding: '14px 36px', textDecoration: 'none' }}>
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
