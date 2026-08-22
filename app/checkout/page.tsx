'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { Lock, Package, FileCheck, ShieldCheck, CreditCard, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import { formatPrice, convertPrice, getCurrencyCode, getCurrencySymbol, getExchangeRate } from '@/utils/price';

// Dynamically import PayPal section on client only
const PayPalCheckoutSection = dynamic(() => import('@/components/PayPalCheckoutSection'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '24px', textAlign: 'center', background: '#faf9f6', borderRadius: '8px', color: '#777', fontSize: '14px' }}>
      🔒 Initializing 256-Bit SSL PayPal Gateway...
    </div>
  ),
});

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const EMERALD = '#1a5c4a';
const STONE = '#f8f7f5';
const GOLD = '#c5a059';

interface CustomerDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, currency, exchangeRates } = useCart();
  const [mounted, setMounted] = useState(false);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigatingToConfirmation, setIsNavigatingToConfirmation] = useState(false);

  // 1. Customer Details (Single time only - Global standard)
  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Empty cart guard (only redirect if user lands on checkout with empty cart, never on successful payment)
  useEffect(() => {
    if (mounted && !isNavigatingToConfirmation && cartItems.length === 0) {
      router.push('/');
    }
  }, [mounted, cartItems.length, isNavigatingToConfirmation, router]);

  if (!mounted) return null;
  if (!isNavigatingToConfirmation && cartItems.length === 0) return null;

  // Base total in USD
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Live Converted Total
  const convertedTotal = convertPrice(subtotalUSD, currency, exchangeRates);
  const currencyCode = getCurrencyCode(currency);
  const currencySymbol = getCurrencySymbol(currency);
  const currentRate = getExchangeRate(currency, exchangeRates);

  const isShippingValid = 
    customer.customerName.trim().length >= 2 &&
    customer.customerEmail.trim().includes('@') &&
    customer.customerPhone.trim().length >= 6 &&
    customer.shippingAddress.trim().length >= 6;


  const handleApprovePayPalOrder = async (txnId: string) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const orderPayload = {
        customerName: customer.customerName,
        customerEmail: customer.customerEmail,
        customerPhone: customer.customerPhone,
        shippingAddress: customer.shippingAddress,
        items: cartItems.map(i => ({
          name: i.name,
          quantity: i.quantity,
          priceUSD: i.price,
          price: convertPrice(i.price, currency, exchangeRates),
        })),
        totalUSD: subtotalUSD,
        total: convertedTotal,
        currency: currencyCode,
        currencySymbol: currencySymbol,
        exchangeRate: currentRate,
        paymentMethod: `PayPal Express (Txn: ${txnId})`,
        paymentStatus: `Paid (PayPal - ${txnId})`,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to record order.');
      }

      setIsNavigatingToConfirmation(true);
      const orderReceipt = JSON.stringify({
        orderId: resData.orderId,
        ...orderPayload,
      });

      sessionStorage.setItem('minerals_universe_last_order', orderReceipt);
      try {
        localStorage.setItem('minerals_universe_last_order', orderReceipt);
      } catch (e) {}

      clearCart();
      router.push('/order-confirmation');
    } catch (err: any) {
      console.error('[Order Record Error]', err);
      setFormError(err.message || 'Failed to save order. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Input Styles ───
  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '13px 15px',
    background: '#fff',
    border: '1px solid #d5d2cc',
    borderRadius: '6px',
    color: '#1a1a1a',
    fontSize: '14.5px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelBase: React.CSSProperties = {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#444',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div style={{ background: '#f8f7f5', minHeight: '100vh', padding: '110px 20px 80px', fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .heading-serif { font-family: 'Playfair Display', Georgia, serif; }
        .page-title {
          font-size: 28px;
          color: #1a1a1a;
          margin-bottom: 24px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .checkout-container {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          max-width: 1140px;
          margin: 0 auto;
          align-items: flex-start;
        }
        .section-card {
          background: #ffffff;
          border: 1px solid #e8e6e1;
          border-radius: 10px;
          padding: 28px 30px;
          margin-bottom: 24px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.03);
        }
        .section-title {
          font-size: 19px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #f0eee9;
          padding-bottom: 12px;
        }
        .input-field:focus {
          border-color: ${EMERALD} !important;
          box-shadow: 0 0 0 3px ${EMERALD}18 !important;
        }
        .payment-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 22px;
        }
        .payment-tab {
          border: 2px solid #e8e6e1;
          border-radius: 8px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14.5px;
          font-weight: 600;
          color: #555;
          transition: all 0.2s ease;
          background: #faf9f7;
        }
        .payment-tab:hover {
          border-color: ${EMERALD}80;
          background: #fff;
        }
        .payment-tab.active {
          border-color: ${EMERALD};
          background: #ffffff;
          color: ${EMERALD};
          box-shadow: 0 4px 12px ${EMERALD}15;
        }
        .btn-pay-now {
          width: 100%;
          background: ${EMERALD};
          color: #ffffff;
          border: none;
          padding: 16px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, transform 0.1s;
          box-shadow: 0 6px 20px ${EMERALD}35;
          margin-top: 20px;
        }
        .btn-pay-now:hover {
          background: #14483a;
          transform: translateY(-1px);
        }
        .btn-pay-now:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .order-summary-card {
          background: #ffffff;
          border: 1px solid #e8e6e1;
          border-radius: 10px;
          padding: 28px 30px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.04);
          position: sticky;
          top: 100px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14.5px;
          color: #555;
          border-bottom: 1px solid #f6f5f2;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 18px 0 8px;
          font-size: 19px;
          font-weight: 700;
          color: #1a1a1a;
          border-top: 2px solid #1a1a1a;
          margin-top: 10px;
        }
        .cert-badges {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          justify-content: space-between;
        }
        .cert-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
          flex: 1;
          padding: 12px 6px;
          background: #fff;
          border: 1px solid #e8e6e1;
          border-radius: 6px;
        }
        .cert-badge span {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${EMERALD};
        }
        
        @media (max-width: 900px) {
          .checkout-container { grid-template-columns: 1fr; gap: 30px; }
          .order-summary-card { position: static; }
          .payment-tabs { grid-template-columns: 1fr; }
        }
      `}} />

      <div className="premium-checkout">
        <h1 className="heading-serif page-title">Global Secure Checkout</h1>

        <div className="checkout-container">
          {/* ── LEFT COLUMN: Shipping & Payment ── */}
          <div>
            
            {/* Step 1: Shipping Address */}
            <div className="section-card">
              <h2 className="heading-serif section-title">
                <span>1. Delivery & Contact Details</span>
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelBase}>Full Name / Recipient *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={inputBase} 
                    value={customer.customerName}
                    onChange={e => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelBase}>Email Address *</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      style={inputBase} 
                      value={customer.customerEmail}
                      onChange={e => setCustomer({ ...customer, customerEmail: e.target.value })}
                      placeholder="email@example.com" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={labelBase}>Mobile Phone *</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      style={inputBase} 
                      value={customer.customerPhone}
                      onChange={e => setCustomer({ ...customer, customerPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={labelBase}>Complete Shipping Address *</label>
                  <textarea 
                    rows={2} 
                    className="input-field" 
                    style={{ ...inputBase, resize: 'vertical' }} 
                    value={customer.shippingAddress}
                    onChange={e => setCustomer({ ...customer, shippingAddress: e.target.value })}
                    placeholder="House/Street, City, State/Province, Country, Postal Code" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="section-card">
              <h2 className="heading-serif section-title">
                <ShieldCheck size={22} color={EMERALD} />
                <span>2. Payment Method</span>
              </h2>

              {formError && (
                <div style={{ background: '#fdf2f2', color: '#c94438', padding: '12px 16px', borderRadius: '6px', fontSize: '13.5px', marginBottom: '18px', border: '1px solid #f5c6cb' }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* Official PayPal & Card Gateway */}
              <div>
                <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px', fontSize: '13px', color: '#555' }}>
                  Click below to securely authorize your payment. You can use your <strong>PayPal Account</strong> or pay directly with a <strong>Debit / Credit Card</strong>.
                </div>

                <PayPalCheckoutSection 
                  subtotalUSD={subtotalUSD}
                  isShippingValid={isShippingValid}
                  isSubmitting={isSubmitting}
                  onApproveOrder={handleApprovePayPalOrder}
                  onError={(msg) => setFormError(msg)}
                />
              </div>

            </div>

          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div>
            <div className="order-summary-card">
              <h2 className="heading-serif section-title">Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      {item.img ? (
                        <Image src={item.img} alt={item.name} width={60} height={60} style={{ objectFit: 'cover' }} unoptimized />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                          <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
                          <polyline points="2 7 12 7 22 7"></polyline>
                          <polyline points="12 22 12 7"></polyline>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="heading-serif" style={{ margin: '0 0 2px', fontSize: '15.5px', fontWeight: 600 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>Qty: {item.quantity} • Certified Gem</p>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '14.5px', color: EMERALD }}>
                      {formatPrice(item.price * item.quantity, currency, exchangeRates)}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalUSD, currency, exchangeRates)}</span>
                </div>
                <div className="summary-row">
                  <span>Insured Global Courier</span>
                  <span style={{ color: EMERALD, fontWeight: 600 }}>FREE (Complimentary)</span>
                </div>
                <div className="summary-row">
                  <span>Authenticity Lab Certificate</span>
                  <span style={{ color: EMERALD, fontWeight: 600 }}>Included</span>
                </div>

                <div className="total-row">
                  <span>Total Amount</span>
                  <div style={{ textAlign: 'right' }}>
                    <div>{formatPrice(subtotalUSD, currency, exchangeRates)}</div>
                    {currency !== 'USD' && (
                      <div style={{ fontSize: '12px', color: '#888', fontWeight: 400, marginTop: '2px' }}>
                        Approx. ${subtotalUSD.toFixed(2)} USD
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="cert-badges">
                <div className="cert-badge">
                  <ShieldCheck size={18} color={EMERALD} />
                  <span>100% Genuine</span>
                </div>
                <div className="cert-badge">
                  <FileCheck size={18} color={EMERALD} />
                  <span>Lab Certified</span>
                </div>
                <div className="cert-badge">
                  <Globe size={18} color={EMERALD} />
                  <span>Worldwide Courier</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
