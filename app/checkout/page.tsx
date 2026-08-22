'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Lock, Package, FileCheck, ShieldCheck, ArrowRight, CreditCard, CheckCircle2, Globe } from 'lucide-react';
import { formatPrice, convertPrice, getCurrencyCode, getCurrencySymbol, getExchangeRate } from '@/utils/price';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import React, { Component, ReactNode, ErrorInfo } from 'react';

// ─── PayPal Error Boundary (Prevents any page crash) ─────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class PayPalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PayPal Error Boundary Caught]', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '16px', background: '#fff9e6', border: '1px solid #fae69e', borderRadius: '8px', color: '#8a6400', fontSize: '13.5px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>⚠️ PayPal Connection Notice</p>
          <p style={{ margin: '0 0 10px' }}>
            PayPal is currently initializing or restricted in your region. You can pay seamlessly right now using any <strong>Debit or Credit Card</strong> in the Card tab!
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

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

  // 1. Customer Details (Single time only - AliExpress/Amazon style)
  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  // 2. Payment Method: 'card' (AliExpress Direct Card) | 'paypal' (PayPal 1-Click)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  // Direct Card Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isNavigatingToConfirmation, setIsNavigatingToConfirmation] = useState(false);

  // Sync Card Name with Full Name
  useEffect(() => {
    if (!cardName && customer.customerName) {
      setCardName(customer.customerName);
    }
  }, [customer.customerName, cardName]);

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

  function getCardBrand(num: string) {
    const clean = num.replace(/\s+/g, '');
    if (!clean) return { name: '', color: '#888', bg: '#f5f5f5', label: 'Accepted Cards', isDetected: false };
    if (/^4/.test(clean)) {
      return { name: 'Visa', color: '#1434CB', bg: '#eaf0ff', label: 'VISA', isDetected: true };
    }
    if (/^(5[1-5]|2[2-7])/.test(clean)) {
      return { name: 'Mastercard', color: '#EB001B', bg: '#fff0ee', label: 'Mastercard', isDetected: true };
    }
    if (/^3[47]/.test(clean)) {
      return { name: 'American Express', color: '#006FCF', bg: '#e6f3fc', label: 'AMEX', isDetected: true };
    }
    if (/^(6011|65|64[4-9])/.test(clean)) {
      return { name: 'Discover', color: '#FF6000', bg: '#fff4eb', label: 'Discover', isDetected: true };
    }
    if (/^35/.test(clean)) {
      return { name: 'JCB', color: '#00539B', bg: '#e6f1f9', label: 'JCB', isDetected: true };
    }
    if (/^62/.test(clean)) {
      return { name: 'UnionPay', color: '#D9272E', bg: '#fdeeed', label: 'UnionPay', isDetected: true };
    }
    return { name: 'Card', color: '#666', bg: '#f0f0f0', label: 'Card', isDetected: false };
  }

  // ─── Formatters ───
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val;
    // Format Amex as 4-6-5
    if (/^3[47]/.test(val)) {
      const parts = [val.substring(0, 4), val.substring(4, 10), val.substring(10, 15)].filter(Boolean);
      formatted = parts.join(' ');
      setCardNumber(formatted.substring(0, 17));
    } else {
      // Format 4-4-4-4 for Visa/Mastercard/Discover
      formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      setCardNumber(formatted.substring(0, 19));
    }
  };

  const detectedCard = getCardBrand(cardNumber);

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9/]/gi, '');
    if (val.length === 2 && !val.includes('/') && cardExpiry.length < 3) {
      val += ' / ';
    } else if (val.length === 2 && cardExpiry.length === 5) {
      val = val.substring(0, 1);
    }
    setCardExpiry(val.substring(0, 7));
  };

  const validateForm = (): boolean => {
    if (!customer.customerName.trim()) {
      setFormError('⚠️ Please enter your Full Name.');
      return false;
    }
    if (!customer.customerEmail.trim() || !customer.customerEmail.includes('@')) {
      setFormError('⚠️ Please enter a valid Email Address (e.g. yourname@example.com).');
      return false;
    }
    if (!customer.customerPhone.trim() || customer.customerPhone.trim().length < 7) {
      setFormError('⚠️ Please enter a valid Mobile Phone Number.');
      return false;
    }
    if (!customer.shippingAddress.trim() || customer.shippingAddress.trim().length < 10) {
      setFormError('⚠️ Please enter a complete Delivery Address (Street, City, Postal Code, Country).');
      return false;
    }

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15 || rawCard.length > 19) {
        setFormError('⚠️ Invalid Card Number. Please enter a complete 15 or 16-digit Card Number.');
        return false;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setFormError('⚠️ Please enter Card Expiry date in MM / YY format.');
        return false;
      }

      const [monthStr, yearStr] = cardExpiry.split('/').map(s => s.trim());
      const month = parseInt(monthStr, 10);
      const year = parseInt('20' + yearStr, 10);

      if (isNaN(month) || month < 1 || month > 12) {
        setFormError('⚠️ Invalid Expiry Month. Month must be between 01 and 12.');
        return false;
      }

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
        setFormError('⚠️ Card is expired. Please enter an active card with future expiry date.');
        return false;
      }

      if (!cardCvv || cardCvv.length < 3 || cardCvv.length > 4) {
        setFormError('⚠️ Invalid CVV. Please enter the 3 or 4-digit security code from your card.');
        return false;
      }
    }
    setFormError(null);
    return true;
  };

  // ─── Direct Card Order Submission (AliExpress / Amazon Style) ───
  const handleDirectCardPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        paymentMethod: `Credit / Debit Card (${detectedCard.name || 'Visa/Mastercard'})`,
        card: {
          number: cardNumber.replace(/\s/g, ''),
          expiry: cardExpiry,
          cvv: cardCvv,
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment card authorization failed.');
      }

      setIsNavigatingToConfirmation(true);
      const orderReceipt = JSON.stringify({
        orderId: data.orderId,
        paymentStatus: 'Paid (Card Authorized)',
        ...orderPayload,
      });

      sessionStorage.setItem('minerals_universe_last_order', orderReceipt);
      try {
        localStorage.setItem('minerals_universe_last_order', orderReceipt);
      } catch (e) {}

      clearCart();
      router.push('/order-confirmation');
    } catch (err: any) {
      console.error('[Card Payment Error]', err);
      setFormError(err.message || 'Payment processing failed. Please verify your card details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Input Styles ───
  const inputBase = {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #e0ded8',
    borderRadius: '6px',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    background: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    color: '#222',
  };

  const labelBase = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
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
          padding: 50px 20px 100px;
          color: #333;
        }
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 40px;
        }
        .heading-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .page-title {
          font-size: 38px;
          color: ${EMERALD};
          margin-bottom: 30px;
          font-weight: 600;
          text-align: center;
        }
        .section-card {
          background: #fff;
          border-radius: 10px;
          padding: 32px;
          border: 1px solid #e5e3dc;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .section-title {
          font-size: 22px;
          color: ${EMERALD};
          margin-bottom: 20px;
          border-bottom: 1px solid #f0eee8;
          padding-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }
        .input-field:focus {
          border-color: ${EMERALD} !important;
          box-shadow: 0 0 0 3px rgba(26,92,74,0.12);
        }
        .payment-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 24px;
        }
        .payment-tab {
          padding: 16px 14px;
          text-align: center;
          cursor: pointer;
          border: 2px solid #e2dfd8;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          transition: all 0.2s ease;
          background: #fff;
          color: #555;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .payment-tab.active {
          background: #f0faf8;
          color: ${EMERALD};
          border-color: ${EMERALD};
          box-shadow: 0 4px 12px rgba(26,92,74,0.1);
        }
        .btn-pay-now {
          width: 100%;
          background: ${EMERALD};
          color: #fff;
          padding: 18px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(26,92,74,0.25);
        }
        .btn-pay-now:hover {
          background: #144638;
          transform: translateY(-1px);
        }
        .btn-pay-now:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .order-summary-card {
          background: #fff;
          border-radius: 10px;
          padding: 32px;
          border: 1px solid #e5e3dc;
          position: sticky;
          top: 90px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .trust-box {
          margin-top: 24px;
          padding: 16px 18px;
          background: #fdfaf5;
          border: 1px solid #f2ead3;
          border-radius: 6px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #555;
        }
        .trust-item:last-child { margin-bottom: 0; }
        .gold-icon { color: ${GOLD}; font-size: 16px; }
        
        .badges-container {
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
        <h1 className="heading-serif page-title">AliExpress / Global Instant Checkout</h1>

        <div className="checkout-container">
          {/* ── LEFT COLUMN: Shipping & Payment ── */}
          <div>
            
            {/* Step 1: Shipping Address (Filled ONCE only) */}
            <div className="section-card">
              <h2 className="heading-serif section-title">
                <span>1. Shipping Address</span>
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelBase}>Contact / Full Name *</label>
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
                  <label style={labelBase}>Street Address & City *</label>
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

              {/* Payment Tabs: Direct Card vs PayPal */}
              <div className="payment-tabs">
                <div 
                  className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={20} />
                  <span>Debit / Credit Card</span>
                </div>

                <div 
                  className={`payment-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <span style={{ fontWeight: 800, color: '#003087', fontSize: '16px' }}>Pay<span style={{ color: '#0079C1' }}>Pal</span></span>
                </div>
              </div>

              {/* ── TAB 1: Direct Card Form (AliExpress / Amazon Style - NO duplicate address!) ── */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleDirectCardPay}>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ ...labelBase, marginBottom: 0 }}>Card Number</label>
                        <span style={{ fontSize: '12px', color: '#888' }}>Visa • MasterCard • Amex • Discover</span>
                      </div>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          className="input-field" 
                          style={{ ...inputBase, paddingRight: detectedCard.isDetected ? '115px' : '45px' }} 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532  ••••  ••••  ••••" 
                          maxLength={19}
                          required
                        />
                        <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                          {detectedCard.isDetected ? (
                            <span style={{ 
                              background: detectedCard.bg, 
                              color: detectedCard.color, 
                              padding: '4px 10px', 
                              borderRadius: '4px', 
                              fontWeight: 800, 
                              fontSize: '12px', 
                              letterSpacing: '0.5px',
                              border: `1px solid ${detectedCard.color}40`,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                            }}>
                              {detectedCard.label}
                            </span>
                          ) : (
                            <CreditCard size={20} color="#aaa" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={labelBase}>Expiration Date</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          style={inputBase} 
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM / YY" 
                          maxLength={7}
                          required
                        />
                      </div>
                      <div>
                        <label style={labelBase}>Security Code (CVV)</label>
                        <input 
                          type="password" 
                          className="input-field" 
                          style={inputBase} 
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                          placeholder="•••" 
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelBase}>Cardholder Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={inputBase} 
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        placeholder="Name on card" 
                      />
                    </div>

                  </div>

                  <button type="submit" className="btn-pay-now" disabled={isSubmitting}>
                    <Lock size={18} />
                    <span>{isSubmitting ? 'Processing Payment...' : `Pay $${subtotalUSD.toFixed(2)} USD Now`}</span>
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#777' }}>
                    <Lock size={13} color={EMERALD} />
                    <span>256-Bit SSL Encrypted & Protected Payment</span>
                  </div>
                </form>
              )}

              {/* ── TAB 2: PayPal 1-Click (Pre-filled, zero friction) ── */}
              {paymentMethod === 'paypal' && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px', fontSize: '13px', color: '#555' }}>
                    Click below to authorize fast 1-click payment with your <strong>PayPal Account</strong>.
                  </div>

                  {(!customer.customerName.trim() || !customer.customerEmail.trim() || !customer.customerPhone.trim() || !customer.shippingAddress.trim()) ? (
                    <div style={{ background: '#fffaf0', border: '1px solid #f3ebd8', borderRadius: '6px', padding: '14px', fontSize: '13.5px', color: '#8a6400', textAlign: 'center' }}>
                      👉 Please fill your <strong>Shipping Address</strong> in Step 1 to enable PayPal.
                    </div>
                  ) : (
                    <PayPalErrorBoundary>
                      <div style={{ minHeight: '120px' }}>
                        <PayPalScriptProvider options={{ 
                          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAk51QAzJlc_kltTZbbhUV03jzLZefyf7oT1OtIn-Kw9j74ijabIbeoCT2ARvl5gxuVyPCiHl2VebG9wo', 
                          currency: 'USD',
                          intent: 'capture'
                        }}>
                          <PayPalButtons
                            fundingSource="paypal"
                            style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
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
                              console.error('[PayPal Error]', err);
                              setFormError(err.message || 'PayPal payment capture failed.');
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          onError={(err) => {
                            console.error('[PayPal SDK Error]', err);
                            setFormError('PayPal payment was cancelled or encountered an error.');
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                    </PayPalErrorBoundary>
                  )}
                </div>
              )}

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

              {/* Currency Rate Indicator */}
              <div style={{ background: '#f4fbf9', border: '1px solid #d4ede6', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#1a5c4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Selected: <strong>{currencyCode} ({currencySymbol.trim()})</strong></span>
                {currencyCode !== 'USD' && (
                  <span>Rate: 1 USD ≈ {currentRate.toFixed(2)} {currencyCode}</span>
                )}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '16px 0', marginBottom: '16px' }}>
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
                <span className="heading-serif" style={{ fontSize: '19px', fontWeight: 600 }}>Total Payable</span>
                <span className="heading-serif" style={{ fontSize: '26px', color: EMERALD, fontWeight: 700 }}>
                  ${subtotalUSD.toFixed(2)} USD
                </span>
              </div>

              {/* Trust Box */}
              <div className="trust-box">
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Lock size={15} /></span>
                  <span>Buyer Protection & 256-Bit SSL Encryption.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Package size={15} /></span>
                  <span>Insured air courier with live tracking.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><FileCheck size={15} /></span>
                  <span>Official gemological certificate included.</span>
                </div>
              </div>

              {/* Cert Badges */}
              <div className="badges-container">
                <div className="cert-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>GIA Verified</span>
                </div>
                <div className="cert-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  <span>Lab Tested</span>
                </div>
                <div className="cert-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>Ethical Gem</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
