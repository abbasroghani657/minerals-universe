'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Lock, Package, FileCheck, CreditCard, Building, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatPrice, convertPrice, getCurrencyCode, getCurrencySymbol, getExchangeRate } from '@/utils/price';

// ─── Constants & Styles ────────────────────────────────────────────────────────
const EMERALD = '#1a5c4a';
const STONE = '#f8f7f5';
const GOLD = '#c5a059';

interface CustomerDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

interface BankSettings {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  raastId: string;
  easyPaisaNumber: string;
  jazzCashNumber: string;
  paymentInstructions: string;
}

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, currency, exchangeRates, ratesLoading } = useCart();
  const [mounted, setMounted] = useState(false);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  // Payment method: 'bank_transfer' | 'card' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card' | 'cod'>('bank_transfer');

  // Admin Bank details loaded from settings
  const [bankSettings, setBankSettings] = useState<BankSettings>({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Minerals Universe / Zaheer Abbas',
    accountNumber: '',
    iban: '',
    raastId: '',
    easyPaisaNumber: '',
    jazzCashNumber: '',
    paymentInstructions: 'Please transfer the exact converted amount to our account and send the screenshot/receipt on WhatsApp along with your Order ID for immediate dispatch verification.',
  });

  // Custom Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    setMounted(true);

    // Fetch store bank details
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setBankSettings({
            bankName: data.settings.bankName || 'Meezan Bank Limited',
            accountTitle: data.settings.accountTitle || 'Minerals Universe / Zaheer Abbas',
            accountNumber: data.settings.accountNumber || '',
            iban: data.settings.iban || '',
            raastId: data.settings.raastId || '',
            easyPaisaNumber: data.settings.easyPaisaNumber || '',
            jazzCashNumber: data.settings.jazzCashNumber || '',
            paymentInstructions: data.settings.paymentInstructions || 'Please transfer the exact converted PKR total to our account and send the screenshot on WhatsApp for instant confirmation.',
          });
        }
      } catch (err) {
        console.error('Failed to load store settings:', err);
      }
    }
    loadSettings();
  }, []);

  // Set default payment method according to currency
  useEffect(() => {
    const code = getCurrencyCode(currency);
    if (code === 'PKR') {
      setPaymentMethod('bank_transfer');
    } else {
      setPaymentMethod('card');
    }
  }, [currency]);

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

  // ─── Formatters ───
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19));
  };

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
    if (!customer.customerName.trim() || !customer.customerEmail.trim() || !customer.customerPhone.trim() || !customer.shippingAddress.trim()) {
      setFormError('Please fill out all customer details (Name, Email, Phone, Address) before proceeding.');
      return false;
    }
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvv) {
        setFormError('Please enter valid credit/debit card details.');
        return false;
      }
    }
    setFormError(null);
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError(null);

    let paymentMethodName = 'Direct Pakistani Bank Transfer / Raast / EasyPaisa';
    if (paymentMethod === 'card') paymentMethodName = 'Debit / Credit Card (Stripe)';
    if (paymentMethod === 'cod') paymentMethodName = 'Cash on Delivery (COD)';

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
        paymentMethod: paymentMethodName,
        card: paymentMethod === 'card' ? {
          number: cardNumber.replace(/\s/g, ''),
          expiry: cardExpiry,
          cvv: cardCvv,
        } : undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order.');
      }

      sessionStorage.setItem('minerals_universe_last_order', JSON.stringify({
        orderId: data.orderId,
        bankSettings,
        ...orderPayload,
      }));
      
      clearCart();
      router.push('/order-confirmation');
    } catch (err: any) {
      console.error('[handlePlaceOrder]', err);
      setFormError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        .payment-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .payment-tab {
          flex: 1;
          min-width: 160px;
          padding: 16px 14px;
          text-align: center;
          cursor: pointer;
          border: 2px solid #e2dfd8;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
          background: #fff;
          color: #555;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .payment-tab.active {
          background: #f0faf8;
          color: ${EMERALD};
          border-color: ${EMERALD};
          box-shadow: 0 4px 12px rgba(26,92,74,0.1);
        }
        .btn-submit {
          width: 100%;
          background: ${EMERALD};
          color: #fff;
          padding: 18px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.3s;
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-submit:hover {
          background: #144638;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .order-summary-card {
          background: #fff;
          border-radius: 8px;
          padding: 40px;
          border: 1px solid #e8e6e1;
          position: sticky;
          top: 100px;
        }
        .bank-info-box {
          background: #f9fbfb;
          border: 1px solid #c7e3dd;
          border-radius: 8px;
          padding: 24px;
          margin-top: 16px;
        }
        .bank-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #d5e8e3;
          font-size: 14px;
        }
        .bank-row:last-child {
          border-bottom: none;
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
                  <label style={labelBase}>Full Name *</label>
                  <input type="text" className="input-field" style={inputBase} value={customer.customerName}
                    onChange={e => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="Enter your full name" required />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelBase}>Email Address *</label>
                    <input type="email" className="input-field" style={inputBase} value={customer.customerEmail}
                      onChange={e => setCustomer({ ...customer, customerEmail: e.target.value })}
                      placeholder="email@example.com" required />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#888' }}>Confirmation invoice will be sent here.</p>
                  </div>
                  <div>
                    <label style={labelBase}>Phone / WhatsApp Number *</label>
                    <input type="tel" className="input-field" style={inputBase} value={customer.customerPhone}
                      onChange={e => setCustomer({ ...customer, customerPhone: e.target.value })}
                      placeholder="+92 300 0000000" required />
                  </div>
                </div>

                <div>
                  <label style={labelBase}>Full Shipping Address *</label>
                  <textarea rows={3} className="input-field" style={{ ...inputBase, resize: 'vertical' }} value={customer.shippingAddress}
                    onChange={e => setCustomer({ ...customer, shippingAddress: e.target.value })}
                    placeholder="House/Street, Area, City, Province/State, Country, Postal Code" required />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="section-card">
              <h2 className="heading-serif section-title">2. Choose Payment Method</h2>

              {formError && (
                <div style={{ background: '#fdf2f2', color: '#c94438', padding: '16px', borderRadius: '4px', fontSize: '14px', marginBottom: '24px', border: '1px solid #f5c6cb' }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* Payment Tabs */}
              <div className="payment-tabs">
                <div 
                  className={`payment-tab ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <Building size={20} />
                  <span>Pakistani Bank / Raast / EasyPaisa</span>
                </div>

                <div 
                  className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={20} />
                  <span>Debit / Credit Card (Stripe)</span>
                </div>

                <div 
                  className={`payment-tab ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <Truck size={20} />
                  <span>Cash on Delivery</span>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder}>
                
                {/* ── TAB 1: Pakistani Direct Bank Transfer ── */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="bank-info-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: EMERALD, fontWeight: 700, fontSize: '16px', marginBottom: '14px' }}>
                      <Building size={18} /> Official Pakistani Beneficiary Details
                    </div>
                    <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                      Please transfer the exact converted amount <strong>{formatPrice(subtotalUSD, currency, exchangeRates)}</strong> to the official account below:
                    </p>

                    <div className="bank-row">
                      <span style={{ color: '#666' }}>Bank Name:</span>
                      <strong style={{ color: '#222' }}>{bankSettings.bankName || 'Meezan Bank Limited'}</strong>
                    </div>
                    <div className="bank-row">
                      <span style={{ color: '#666' }}>Account Title:</span>
                      <strong style={{ color: '#222' }}>{bankSettings.accountTitle || 'Minerals Universe / Zaheer Abbas'}</strong>
                    </div>
                    {bankSettings.accountNumber && (
                      <div className="bank-row">
                        <span style={{ color: '#666' }}>Account Number:</span>
                        <strong style={{ color: EMERALD, letterSpacing: '0.5px' }}>{bankSettings.accountNumber}</strong>
                      </div>
                    )}
                    {bankSettings.iban && (
                      <div className="bank-row">
                        <span style={{ color: '#666' }}>IBAN:</span>
                        <strong style={{ color: EMERALD, fontSize: '13px' }}>{bankSettings.iban}</strong>
                      </div>
                    )}
                    {bankSettings.raastId && (
                      <div className="bank-row">
                        <span style={{ color: '#666' }}>Raast ID:</span>
                        <strong style={{ color: '#222' }}>{bankSettings.raastId}</strong>
                      </div>
                    )}
                    {bankSettings.easyPaisaNumber && (
                      <div className="bank-row">
                        <span style={{ color: '#666' }}>EasyPaisa:</span>
                        <strong style={{ color: '#222' }}>{bankSettings.easyPaisaNumber}</strong>
                      </div>
                    )}
                    {bankSettings.jazzCashNumber && (
                      <div className="bank-row">
                        <span style={{ color: '#666' }}>JazzCash:</span>
                        <strong style={{ color: '#222' }}>{bankSettings.jazzCashNumber}</strong>
                      </div>
                    )}

                    <div style={{ marginTop: '16px', padding: '12px', background: '#eaf4f2', borderRadius: '6px', fontSize: '12px', color: '#1a5c4a', display: 'flex', gap: '8px' }}>
                      <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                      <span>{bankSettings.paymentInstructions}</span>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: Card / Stripe ── */}
                {paymentMethod === 'card' && (
                  <div style={{ display: 'grid', gap: '20px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#1a5c4a', background: '#e8f3f0', padding: '12px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 600 }}>
                      <Lock size={16} /> 256-Bit Encrypted Card Payment via Stripe Gateway
                    </div>
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
                        <label style={labelBase}>CVV / CVC</label>
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
                )}

                {/* ── TAB 3: Cash on Delivery ── */}
                {paymentMethod === 'cod' && (
                  <div style={{ background: '#fcfcfc', border: '1px solid #e8e6e1', borderRadius: '8px', padding: '20px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: EMERALD, fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>
                      <Truck size={18} /> Cash on Delivery (Pakistan Domestic Orders)
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                      You can pay the full amount of <strong>{formatPrice(subtotalUSD, currency, exchangeRates)}</strong> in cash to the courier upon delivery at your doorstep. We will call you on your phone to confirm your order before dispatch.
                    </p>
                  </div>
                )}

                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : (
                    <>
                      <span>Place Order • {formatPrice(subtotalUSD, currency, exchangeRates)}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div>
            <div className="order-summary-card">
              <h2 className="heading-serif section-title">Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '70px', height: '70px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
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
                      <p className="heading-serif" style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>Qty: {item.quantity} • Authentic Gem</p>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: EMERALD }}>
                      {formatPrice(item.price * item.quantity, currency, exchangeRates)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Currency & Live Rate Indicator */}
              <div style={{ background: '#f4fbf9', border: '1px solid #d4ede6', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: '#1a5c4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Selected Currency: <strong>{currencyCode} ({currencySymbol.trim()})</strong></span>
                {currencyCode !== 'USD' && (
                  <span>Live Rate: 1 USD ≈ {currentRate.toFixed(2)} {currencyCode}</span>
                )}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#555' }}>
                  <span>Base Total (USD)</span>
                  <span>${subtotalUSD.toFixed(2)} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#555' }}>
                  <span>Converted Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(subtotalUSD, currency, exchangeRates)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                  <span>Shipping</span>
                  <span style={{ color: EMERALD, fontWeight: 600 }}>Free Worldwide Tracked Delivery</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="heading-serif" style={{ fontSize: '22px', fontWeight: 600 }}>Total Payable</span>
                <span className="heading-serif" style={{ fontSize: '28px', color: EMERALD, fontWeight: 700 }}>
                  {formatPrice(subtotalUSD, currency, exchangeRates)}
                </span>
              </div>

              {/* Trust Box */}
              <div className="trust-box">
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Lock size={18} /></span>
                  <span>Payment is 100% verified & encrypted.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><Package size={18} /></span>
                  <span>Insured dispatch with official tracking.</span>
                </div>
                <div className="trust-item">
                  <span className="gold-icon" style={{ display: 'flex' }}><FileCheck size={18} /></span>
                  <span>Authenticity certificate included with every stone.</span>
                </div>
              </div>

              {/* Badges */}
              <div className="badges-container">
                <div className="cert-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>GIA Verified</span>
                </div>
                <div className="cert-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  <span>Lab Tested</span>
                </div>
                <div className="cert-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
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
