'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Lock, Package, FileCheck, CreditCard, Wallet } from 'lucide-react';

// ─── Constants & Types ────────────────────────────────────────────────────────
const EMERALD = '#1a5c4a';
const STONE = '#f8f7f5';
const GOLD = '#c5a059';

interface CustomerDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  const [paymentTab, setPaymentTab] = useState<'paypal' | 'stripe'>('stripe');
  const [formError, setFormError] = useState<string | null>(null);

  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  // Custom Card State for visually matching the design request
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => { setMounted(true); }, []);

  // Empty cart guard
  useEffect(() => {
    if (mounted && cartItems.length === 0) router.push('/');
  }, [mounted, cartItems, router]);

  if (!mounted || cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ─── Formatters ───
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19)); // 16 digits + 3 spaces
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9/]/gi, '');
    if (val.length === 2 && !val.includes('/') && cardExpiry.length < 3) {
      val += ' / ';
    } else if (val.length === 2 && cardExpiry.length === 5) {
      val = val.substring(0, 1); // backspace over slash
    }
    setCardExpiry(val.substring(0, 7)); // MM / YY
  };

  const validateForm = (): boolean => {
    if (!customer.customerName.trim() || !customer.customerEmail.trim() || !customer.customerPhone.trim() || !customer.shippingAddress.trim()) {
      setFormError('Please fill out all customer details before proceeding.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // In a real app, this would process the Stripe token securely
    sessionStorage.setItem('minerals_universe_last_order', JSON.stringify({
      orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
      customerName: customer.customerName,
      customerEmail: customer.customerEmail,
      customerPhone: customer.customerPhone,
      shippingAddress: customer.shippingAddress,
      items: cartItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: subtotal,
      paymentMethod: paymentTab === 'paypal' ? 'PayPal' : 'Stripe / Card',
    }));
    clearCart();
    router.push('/order-confirmation');
  };

  // ─── Styles ───
  const inputBase = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e2dfd8',
    borderRadius: '4px',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    background: '#fff',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    color: '#333',
  };

  const labelBase = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#555',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        
        .premium-checkout {
          font-family: 'DM Sans', sans-serif;
          background-color: ${STONE};
          min-height: 100vh;
          padding: 60px 20px 100px;
          color: #333;
        }
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
        }
        .heading-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .page-title {
          font-size: 42px;
          color: ${EMERALD};
          margin-bottom: 40px;
          font-weight: 500;
          text-align: center;
        }
        .section-card {
          background: #fff;
          border-radius: 8px;
          padding: 40px;
          border: 1px solid #e8e6e1;
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 26px;
          color: ${EMERALD};
          margin-bottom: 24px;
          border-bottom: 1px solid #eee;
          padding-bottom: 16px;
        }
        .input-field:focus {
          border-color: ${EMERALD} !important;
          box-shadow: 0 0 0 1px ${EMERALD};
        }
        .toggle-btn {
          flex: 1;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          border: 1px solid #e2dfd8;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          background: #fff;
          color: #666;
        }
        .toggle-btn.active {
          background: ${EMERALD};
          color: #fff;
          border-color: ${EMERALD};
        }
        .toggle-btn:first-child {
          border-radius: 4px 0 0 4px;
        }
        .toggle-btn:last-child {
          border-radius: 0 4px 4px 0;
        }
        .btn-submit {
          width: 100%;
          background: ${EMERALD};
          color: #fff;
          padding: 18px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.3s;
          margin-top: 20px;
        }
        .btn-submit:hover {
          background: #144638;
        }
        .order-summary-card {
          background: #fff;
          border-radius: 8px;
          padding: 40px;
          border: 1px solid #e8e6e1;
          position: sticky;
          top: 100px;
        }
        .trust-box {
          margin-top: 30px;
          padding: 20px;
          background: #fdfaf5;
          border: 1px solid #f2ead3;
          border-radius: 4px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #555;
        }
        .trust-item:last-child { margin-bottom: 0; }
        .gold-icon { color: ${GOLD}; font-size: 18px; }
        
        .badges-container {
          display: flex;
          gap: 10px;
          margin-top: 24px;
          justify-content: space-between;
        }
        .cert-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          flex: 1;
          padding: 16px 10px;
          background: #fff;
          border: 1px solid #e8e6e1;
          border-radius: 4px;
        }
        .cert-badge span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${EMERALD};
        }
        
        @media (max-width: 900px) {
          .checkout-container { grid-template-columns: 1fr; gap: 40px; }
          .order-summary-card { position: static; }
        }
      `}} />

      <div className="premium-checkout">
        <h1 className="heading-serif page-title">Secure Checkout</h1>

        <div className="checkout-container">
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Customer Details */}
            <div className="section-card">
              <h2 className="heading-serif section-title">1. Customer Details</h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={labelBase}>Full Name</label>
                  <input type="text" className="input-field" style={inputBase} value={customer.customerName}
                    onChange={e => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="Enter your full name" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelBase}>Email Address</label>
                    <input type="email" className="input-field" style={inputBase} value={customer.customerEmail}
                      onChange={e => setCustomer({ ...customer, customerEmail: e.target.value })}
                      placeholder="email@example.com" />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#888' }}>Your confirmation email will be sent here.</p>
                  </div>
                  <div>
                    <label style={labelBase}>Phone Number</label>
                    <input type="tel" className="input-field" style={inputBase} value={customer.customerPhone}
                      onChange={e => setCustomer({ ...customer, customerPhone: e.target.value })}
                      placeholder="+92 300 0000000" />
                  </div>
                </div>

                <div>
                  <label style={labelBase}>Shipping Address</label>
                  <textarea rows={3} className="input-field" style={{ ...inputBase, resize: 'vertical' }} value={customer.shippingAddress}
                    onChange={e => setCustomer({ ...customer, shippingAddress: e.target.value })}
                    placeholder="Street Address, City, State/Province, Country, Zip/Postal Code" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="section-card">
              <h2 className="heading-serif section-title">2. Payment Method</h2>

              <div style={{ display: 'flex', marginBottom: '30px' }}>
                <button 
                  className={`toggle-btn ${paymentTab === 'stripe' ? 'active' : ''}`}
                  onClick={() => setPaymentTab('stripe')}
                >
                  <CreditCard size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', marginBottom: '2px' }} />
                  Credit / Debit Card
                </button>
                <button 
                  className={`toggle-btn ${paymentTab === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentTab('paypal')}
                >
                  <Wallet size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', marginBottom: '2px' }} />
                  PayPal
                </button>
              </div>

              {formError && (
                <div style={{ background: '#fdf2f2', color: '#c94438', padding: '16px', borderRadius: '4px', fontSize: '14px', marginBottom: '24px', border: '1px solid #f5c6cb' }}>
                  ⚠️ {formError}
                </div>
              )}

              {paymentTab === 'stripe' && (
                <form onSubmit={handlePlaceOrder}>
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                      <label style={labelBase}>Card Number</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={inputBase} 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000" 
                        maxLength={19}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={labelBase}>Expiry Date</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          style={inputBase} 
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM / YY" 
                          maxLength={7}
                        />
                      </div>
                      <div>
                        <label style={labelBase}>CVV</label>
                        <input 
                          type="password" 
                          className="input-field" 
                          style={inputBase} 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                          placeholder="123" 
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn-submit">
                    Place Order • PKR {subtotal.toLocaleString()}
                  </button>
                </form>
              )}

              {paymentTab === 'paypal' && (
                <div style={{ marginTop: '20px' }}>
                  <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'your_sandbox_client_id' ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID : 'test', currency: 'USD' }}>
                    <PayPalButtons 
                      style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
                      createOrder={(data, actions) => {
                        if (!validateForm()) return Promise.reject();
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{ amount: { value: "100.00", currency_code: "USD" } }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          handlePlaceOrder({ preventDefault: () => {} } as React.FormEvent);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div>
            <div className="order-summary-card">
              <h2 className="heading-serif section-title">Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '70px', height: '70px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.img ? (
                        <Image src={item.img} alt={item.name} width={70} height={70} style={{ objectFit: 'cover' }} unoptimized />
                      ) : (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                          <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
                          <polyline points="2 7 12 7 22 7"></polyline>
                          <polyline points="12 22 12 7"></polyline>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="heading-serif" style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>Qty: {item.quantity} • Premium Grade</p>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input type="text" className="input-field" style={{ ...inputBase, padding: '12px' }} placeholder="Promo Code" />
                <button style={{ background: '#333', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '4px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', textTransform: 'uppercase' }}>Apply</button>
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#555' }}>
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                  <span>Shipping</span>
                  <span style={{ color: EMERALD, fontWeight: 500 }}>Free Premium Shipping</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="heading-serif" style={{ fontSize: '24px', fontWeight: 600 }}>Total</span>
                <span className="heading-serif" style={{ fontSize: '28px', color: EMERALD, fontWeight: 700 }}>PKR {subtotal.toLocaleString()}</span>
              </div>

              {/* Trust Box */}
              <div className="trust-box">
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Lock size={18} /></span>
                  <span>Payment is 100% secured and encrypted.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Package size={18} /></span>
                  <span>Estimated dispatch in 1–2 business days.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><FileCheck size={18} /></span>
                  <span>Authenticity certificate included in package.</span>
                </div>
              </div>

              {/* Badges */}
              <div className="badges-container">
                <div className="cert-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>GIA Verified</span>
                </div>
                <div className="cert-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  <span>Lab Tested</span>
                </div>
                <div className="cert-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>Ethically Sourced</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
