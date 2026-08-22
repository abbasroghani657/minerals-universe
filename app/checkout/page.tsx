'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Lock, Package, FileCheck, ShieldCheck, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { formatPrice, convertPrice, getCurrencyCode, getCurrencySymbol, getExchangeRate } from '@/utils/price';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

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

  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Empty cart guard
  useEffect(() => {
    if (mounted && cartItems.length === 0) router.push('/');
  }, [mounted, cartItems, router]);

  if (!mounted || cartItems.length === 0) return null;

  // Base total in USD
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Live Converted Total
  const convertedTotal = convertPrice(subtotalUSD, currency, exchangeRates);
  const currencyCode = getCurrencyCode(currency);
  const currencySymbol = getCurrencySymbol(currency);
  const currentRate = getExchangeRate(currency, exchangeRates);

  const validateForm = (): boolean => {
    if (!customer.customerName.trim() || !customer.customerEmail.trim() || !customer.customerPhone.trim() || !customer.shippingAddress.trim()) {
      setFormError('Please fill out all delivery details (Full Name, Email, Phone, Shipping Address) before paying.');
      return false;
    }
    setFormError(null);
    return true;
  };

  // ─── Input Styles ───
  const inputBase = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e2dfd8',
    borderRadius: '6px',
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
    fontWeight: 600,
    marginBottom: '8px',
    color: '#444',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
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
          gap: 50px;
        }
        .heading-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .page-title {
          font-size: 40px;
          color: ${EMERALD};
          margin-bottom: 36px;
          font-weight: 600;
          text-align: center;
        }
        .section-card {
          background: #fff;
          border-radius: 10px;
          padding: 36px;
          border: 1px solid #e8e6e1;
          margin-bottom: 26px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.02);
        }
        .section-title {
          font-size: 24px;
          color: ${EMERALD};
          margin-bottom: 22px;
          border-bottom: 1px solid #eee;
          padding-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .input-field:focus {
          border-color: ${EMERALD} !important;
          box-shadow: 0 0 0 3px rgba(26,92,74,0.1);
        }
        .order-summary-card {
          background: #fff;
          border-radius: 10px;
          padding: 36px;
          border: 1px solid #e8e6e1;
          position: sticky;
          top: 90px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .trust-box {
          margin-top: 26px;
          padding: 18px 20px;
          background: #fdfaf5;
          border: 1px solid #f2ead3;
          border-radius: 6px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 13.5px;
          color: #555;
        }
        .trust-item:last-child { margin-bottom: 0; }
        .gold-icon { color: ${GOLD}; font-size: 18px; }
        
        .badges-container {
          display: flex;
          gap: 10px;
          margin-top: 22px;
          justify-content: space-between;
        }
        .cert-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          flex: 1;
          padding: 14px 8px;
          background: #fff;
          border: 1px solid #e8e6e1;
          border-radius: 6px;
        }
        .cert-badge span {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${EMERALD};
        }
        
        @media (max-width: 900px) {
          .checkout-container { grid-template-columns: 1fr; gap: 30px; }
          .order-summary-card { position: static; }
        }
      `}} />

      <div className="premium-checkout">
        <h1 className="heading-serif page-title">Global Secure Checkout</h1>

        <div className="checkout-container">
          {/* ── LEFT COLUMN: Shipping & PayPal Gateway ── */}
          <div>
            
            {/* Step 1: Customer Delivery Details */}
            <div className="section-card">
              <h2 className="heading-serif section-title">
                <span>1. Delivery & Contact Details</span>
              </h2>

              <div style={{ display: 'grid', gap: '18px' }}>
                <div>
                  <label style={labelBase}>Full Name *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={inputBase} 
                    value={customer.customerName}
                    onChange={e => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="e.g. Alexander Wright" 
                    required 
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelBase}>Email Address *</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      style={inputBase} 
                      value={customer.customerEmail}
                      onChange={e => setCustomer({ ...customer, customerEmail: e.target.value })}
                      placeholder="alexander@example.com" 
                      required 
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: '#777' }}>Official purchase certificate & tracking invoice sent here.</p>
                  </div>
                  <div>
                    <label style={labelBase}>Phone / WhatsApp *</label>
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
                    rows={3} 
                    className="input-field" 
                    style={{ ...inputBase, resize: 'vertical' }} 
                    value={customer.shippingAddress}
                    onChange={e => setCustomer({ ...customer, shippingAddress: e.target.value })}
                    placeholder="Street Address, Apartment/Suite, City, State/Province, Postal Code, Country" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Step 2: PayPal Global Payment Gateway */}
            <div className="section-card">
              <h2 className="heading-serif section-title">
                <ShieldCheck size={22} color={EMERALD} />
                <span>2. Payment via PayPal & International Cards</span>
              </h2>

              {formError && (
                <div style={{ background: '#fdf2f2', color: '#c94438', padding: '14px 16px', borderRadius: '6px', fontSize: '13.5px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* Verified PayPal Guarantee Box */}
              <div style={{ background: '#f0faf8', border: '1px solid #cce8e2', borderRadius: '8px', padding: '18px 22px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: EMERALD, fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                  <Lock size={16} /> 256-Bit Encrypted International Gateway
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#555', lineHeight: '1.6' }}>
                  All orders are charged securely in USD (<strong>${subtotalUSD.toFixed(2)} USD</strong>). You can pay seamlessly using your <strong>PayPal Balance</strong> or any international <strong>Visa, MasterCard, American Express, or Discover</strong> card.
                </p>
              </div>

              {/* Customer Warning if fields empty */}
              {(!customer.customerName.trim() || !customer.customerEmail.trim() || !customer.customerPhone.trim() || !customer.shippingAddress.trim()) ? (
                <div style={{ background: '#fffaf0', border: '1px solid #f3ebd8', borderRadius: '6px', padding: '16px', fontSize: '14px', color: '#8a6400', textAlign: 'center' }}>
                  👉 Please enter your <strong>Name, Email, Phone, and Address</strong> above to unlock the PayPal payment buttons.
                </div>
              ) : (
                <div style={{ minHeight: '140px' }}>
                  <PayPalScriptProvider options={{ 
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test', 
                    currency: 'USD',
                    intent: 'capture'
                  }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                      disabled={isSubmitting}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [
                            {
                              description: `Minerals Universe Gemstones Order (${cartItems.length} items)`,
                              amount: {
                                currency_code: 'USD',
                                value: subtotalUSD.toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (!actions.order) return;
                        setIsSubmitting(true);
                        setFormError(null);
                        try {
                          const details = await actions.order.capture();
                          const txnId = details?.id || data.orderID;

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

                          sessionStorage.setItem('minerals_universe_last_order', JSON.stringify({
                            orderId: resData.orderId,
                            ...orderPayload,
                          }));

                          clearCart();
                          router.push('/order-confirmation');
                        } catch (err: any) {
                          console.error('[PayPal Error]', err);
                          setFormError(err.message || 'PayPal capture failed. Please try again.');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      onError={(err) => {
                        console.error('[PayPal SDK Error]', err);
                        setFormError('PayPal payment was cancelled or encountered an issue. Please try again.');
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '26px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      {item.img ? (
                        <Image src={item.img} alt={item.name} width={64} height={64} style={{ objectFit: 'cover' }} unoptimized />
                      ) : (
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                          <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
                          <polyline points="2 7 12 7 22 7"></polyline>
                          <polyline points="12 22 12 7"></polyline>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="heading-serif" style={{ margin: '0 0 3px', fontSize: '16px', fontWeight: 600 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#777' }}>Qty: {item.quantity} • 100% Natural Certified</p>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: EMERALD }}>
                      {formatPrice(item.price * item.quantity, currency, exchangeRates)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Currency & Live Conversion Indicator */}
              <div style={{ background: '#f4fbf9', border: '1px solid #d4ede6', borderRadius: '6px', padding: '12px 14px', marginBottom: '18px', fontSize: '12px', color: '#1a5c4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Selected: <strong>{currencyCode} ({currencySymbol.trim()})</strong></span>
                {currencyCode !== 'USD' && (
                  <span>Rate: 1 USD ≈ {currentRate.toFixed(2)} {currencyCode}</span>
                )}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '18px 0', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555', fontSize: '14px' }}>
                  <span>Subtotal</span>
                  <span>${subtotalUSD.toFixed(2)} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '14px' }}>
                  <span>Insured Global Shipping</span>
                  <span style={{ color: EMERALD, fontWeight: 600 }}>FREE Worldwide Delivery</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="heading-serif" style={{ fontSize: '20px', fontWeight: 600 }}>Total Payable</span>
                <span className="heading-serif" style={{ fontSize: '26px', color: EMERALD, fontWeight: 700 }}>
                  ${subtotalUSD.toFixed(2)} USD
                </span>
              </div>

              {/* Trust Box */}
              <div className="trust-box">
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Lock size={16} /></span>
                  <span>Direct PayPal Buyer Protection & Encryption.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Package size={16} /></span>
                  <span>Insured air courier with live tracking.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><FileCheck size={16} /></span>
                  <span>Official gemological certificate included.</span>
                </div>
              </div>

              {/* Cert Badges */}
              <div className="badges-container">
                <div className="cert-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>GIA Verified</span>
                </div>
                <div className="cert-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  <span>Lab Tested</span>
                </div>
                <div className="cert-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>Ethical Sourcing</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
