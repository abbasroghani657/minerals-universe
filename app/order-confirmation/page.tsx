'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building, CheckCircle2, MessageCircle, ArrowLeft, Package, Lock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

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
  totalUSD?: number;
  currency?: string;
  currencySymbol?: string;
  paymentMethod: string;
  bankSettings?: {
    bankName?: string;
    accountTitle?: string;
    accountNumber?: string;
    iban?: string;
    raastId?: string;
    easyPaisaNumber?: string;
    jazzCashNumber?: string;
    paymentInstructions?: string;
    whatsappNumber?: string;
  };
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
    setOrder(JSON.parse(raw));
  }, [router]);

  if (!order) {
    return (
      <div style={{ padding: '140px 20px', textAlign: 'center', color: '#888', fontSize: '16px' }}>
        Redirecting…
      </div>
    );
  }

  const sym = order.currencySymbol || 'PKR ';
  const isBankTransfer = order.paymentMethod.toLowerCase().includes('bank') || order.paymentMethod.toLowerCase().includes('raast') || order.paymentMethod.toLowerCase().includes('easypaisa');
  const whatsappNum = order.bankSettings?.whatsappNumber || '923001581210';

  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum Minerals Universe!\nI have placed an order.\nOrder ID: #${order.orderId}\nCustomer: ${order.customerName}\nTotal Amount: ${sym}${order.total.toLocaleString()}\nPayment Method: ${order.paymentMethod}\nPlease confirm my order.`
  );

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 80px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Success Card */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e8e6e1', textAlign: 'center', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eaf4f2', color: '#1a5c4a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
            <CheckCircle2 size={36} color="#1a5c4a" />
          </div>
          <h1 style={{ fontSize: '28px', margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif", color: '#1a5c4a' }}>
            Thank you, {order.customerName.split(' ')[0]}!
          </h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>Your order has been recorded successfully.</p>
        </div>

        {/* Bank Transfer Instructions Box */}
        {isBankTransfer && (
          <div style={{ background: '#f0faf8', border: '1.5px solid #1a5c4a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a5c4a', fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
              <Building size={20} /> Bank Transfer & Payment Verification
            </div>
            <p style={{ fontSize: '14px', color: '#444', margin: '0 0 16px', lineHeight: '1.6' }}>
              Please transfer the total amount of <strong>{sym}{order.total.toLocaleString()}</strong> to the following official account:
            </p>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #cce8e2', fontSize: '13px', display: 'grid', gap: '8px', marginBottom: '16px' }}>
              <div><strong>Bank Name:</strong> {order.bankSettings?.bankName || 'Meezan Bank Limited'}</div>
              <div><strong>Account Title:</strong> {order.bankSettings?.accountTitle || 'Minerals Universe / Zaheer Abbas'}</div>
              {order.bankSettings?.accountNumber && <div><strong>Account No:</strong> <span style={{ color: '#1a5c4a', fontWeight: 700 }}>{order.bankSettings.accountNumber}</span></div>}
              {order.bankSettings?.iban && <div><strong>IBAN:</strong> <span style={{ color: '#1a5c4a', fontWeight: 700 }}>{order.bankSettings.iban}</span></div>}
              {order.bankSettings?.raastId && <div><strong>Raast ID:</strong> {order.bankSettings.raastId}</div>}
              {order.bankSettings?.easyPaisaNumber && <div><strong>EasyPaisa:</strong> {order.bankSettings.easyPaisaNumber}</div>}
            </div>

            <a 
              href={`https://wa.me/${whatsappNum}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 20px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                transition: 'background 0.2s',
              }}
            >
              <FaWhatsapp size={20} /> Send Payment Screenshot on WhatsApp
            </a>
          </div>
        )}

        {/* Order Details Card */}
        <div style={{ background: '#fff', padding: '28px 32px', borderRadius: '12px', border: '1px solid #e8e6e1', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a5c4a' }}>#{order.orderId}</p>
            </div>
            <div style={{ background: '#eaf4f2', color: '#1a5c4a', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
              {order.paymentMethod}
            </div>
          </div>

          {/* Items table */}
          <h3 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>
                <span style={{ color: '#444' }}>{item.quantity}× {item.name}</span>
                <span style={{ fontWeight: 600 }}>{sym}{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, paddingTop: '12px', borderTop: '2px solid #eee' }}>
            <span>Total Amount</span>
            <span style={{ color: '#1a5c4a', fontSize: '22px' }}>{sym}{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div style={{ background: '#fff', padding: '20px 32px', borderRadius: '12px', border: '1px solid #e8e6e1', marginBottom: '20px', fontSize: '14px' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333' }}>Shipping Address</h3>
          <p style={{ margin: '0 0 4px', color: '#444' }}><strong>Recipient:</strong> {order.customerName}</p>
          <p style={{ margin: '0 0 4px', color: '#444' }}><strong>Phone:</strong> {order.customerPhone}</p>
          <p style={{ margin: 0, color: '#444' }}><strong>Address:</strong> {order.shippingAddress}</p>
        </div>

        {/* Email note */}
        <div style={{ background: '#eaf4f2', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', color: '#1a5c4a', textAlign: 'center' }}>
          📧 A detailed invoice has been sent to <strong>{order.customerEmail}</strong>
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
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '15px'
            }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
