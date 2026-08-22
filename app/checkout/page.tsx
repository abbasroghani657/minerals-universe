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

  // 2. Payment Method Tab: 'card' (Direct Card) | 'paypal' (PayPal Express)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  // Direct Card Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const isShippingValid = 
    customer.customerName.trim().length >= 2 &&
    customer.customerEmail.trim().includes('@') &&
    customer.customerPhone.trim().length >= 6 &&
    customer.shippingAddress.trim().length >= 6;

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val;
    if (/^3[47]/.test(val)) {
      const parts = [val.substring(0, 4), val.substring(4, 10), val.substring(10, 15)].filter(Boolean);
      formatted = parts.join(' ');
      setCardNumber(formatted.substring(0, 17));
    } else {
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

  function isValidLuhn(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  const validateCardForm = (): boolean => {
    if (!customer.customerName.trim()) {
      setFormError('⚠️ Please enter your Full Name in Step 1.');
      return false;
    }
    if (!customer.customerEmail.trim() || !customer.customerEmail.includes('@')) {
      setFormError('⚠️ Please enter a valid Email Address in Step 1.');
      return false;
    }
    if (!customer.customerPhone.trim() || customer.customerPhone.trim().length < 6) {
      setFormError('⚠️ Please enter a valid Mobile Phone Number in Step 1.');
      return false;
    }
    if (!customer.shippingAddress.trim() || customer.shippingAddress.trim().length < 6) {
      setFormError('⚠️ Please enter your Complete Shipping Address in Step 1.');
      return false;
    }

    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 14 || rawCard.length > 19) {
      setFormError('⚠️ Please enter a valid 15 or 16-digit Card Number.');
      return false;
    }

    if (!isValidLuhn(rawCard)) {
      setFormError('⚠️ Invalid Card Number. The card failed bank checksum validation.');
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

    setFormError(null);
    return true;
  };

  const handleDirectCardPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCardForm()) return;

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
        paymentStatus: 'Paid (Card Authorized)',
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

              {/* ── TAB 1: Direct Credit / Debit Card (Global instant processing) ── */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleDirectCardPay}>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ ...labelBase, marginBottom: 0 }}>Card Number *</label>
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
                        <label style={labelBase}>Expiration Date *</label>
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
                        <label style={labelBase}>Security Code (CVV) *</label>
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
                      <label style={labelBase}>Cardholder Name *</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={inputBase} 
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        placeholder="Name on card" 
                        required
                      />
                    </div>

                  </div>

                  <button type="submit" className="btn-pay-now" disabled={isSubmitting}>
                    <Lock size={18} />
                    <span>{isSubmitting ? 'Authorizing Payment...' : `Pay $${subtotalUSD.toFixed(2)} USD Now`}</span>
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#777' }}>
                    <Lock size={13} color={EMERALD} />
                    <span>256-Bit SSL Bank Encrypted Payment</span>
                  </div>
                </form>
              )}

              {/* ── TAB 2: PayPal Express 1-Click ── */}
              {paymentMethod === 'paypal' && (
                <div>
                  <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px', fontSize: '13px', color: '#555' }}>
                    Click below to authorize 1-click payment with your <strong>PayPal Account</strong>.
                  </div>

                  <PayPalCheckoutSection 
                    subtotalUSD={subtotalUSD}
                    isShippingValid={isShippingValid}
                    isSubmitting={isSubmitting}
                    onApproveOrder={handleApprovePayPalOrder}
                    onError={(msg) => setFormError(msg)}
                  />
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
