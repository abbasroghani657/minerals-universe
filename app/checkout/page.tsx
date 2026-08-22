'use client';

import { useState, useEffect, Component, ReactNode, ErrorInfo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Lock, Package, FileCheck, ShieldCheck, ArrowRight, CreditCard, CheckCircle2, Globe, Check } from 'lucide-react';
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

// ─── PayPal Error Boundary (Fallback Handler) ────────────────────────────────
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
        <div style={{ padding: '20px', background: '#fff9e6', border: '1px solid #fae69e', borderRadius: '8px', color: '#8a6400', fontSize: '13.5px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>⚠️ International Gateway Notice</p>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Please refresh the page to reconnect to the secure banking network.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
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
    customer.shippingAddress.trim().length >= 8;

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
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAk51QAzJlc_kltTZbbhUV03jzLZefyf7oT1OtIn-Kw9j74ijabIbeoCT2ARvl5gxuVyPCiHl2VebG9wo', 
      currency: 'USD',
      intent: 'capture',
      components: 'buttons',
      deferLoading: false,
    }}>
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
          }
        `}} />

        <div className="premium-checkout">
          <h1 className="heading-serif page-title">Global Secure Checkout</h1>

          <div className="checkout-container">
            {/* ── LEFT COLUMN: Shipping & Real Payment ── */}
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

              {/* Step 2: 100% Live Bank Verified Payment */}
              <div className="section-card">
                <h2 className="heading-serif section-title">
                  <ShieldCheck size={22} color={EMERALD} />
                  <span>2. Live Bank-Verified Payment</span>
                </h2>

                {formError && (
                  <div style={{ background: '#fdf2f2', color: '#c94438', padding: '12px 16px', borderRadius: '6px', fontSize: '13.5px', marginBottom: '18px', border: '1px solid #f5c6cb' }}>
                    ⚠️ {formError}
                  </div>
                )}

                <div style={{ background: '#fbfaf8', border: '1px solid #eae7e1', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>Accepted Global Cards:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ background: '#eaf0ff', color: '#1434CB', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>VISA</span>
                      <span style={{ background: '#fff0ee', color: '#EB001B', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>Mastercard</span>
                      <span style={{ background: '#e6f3fc', color: '#006FCF', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>AMEX</span>
                      <span style={{ background: '#fff4eb', color: '#FF6000', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>Discover</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#666', lineHeight: 1.5 }}>
                    Payments are authenticated directly by your card-issuing bank via 256-Bit SSL encryption. Real money is securely transferred to your verified account.
                  </p>
                </div>

                {!isShippingValid ? (
                  <div style={{ background: '#fffaf0', border: '1px solid #f3ebd8', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#8a6400', fontSize: '14.5px' }}>
                      👉 Step 1: Complete Delivery Details Above
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#7a5a00' }}>
                      Please enter your Full Name, Email, Phone, and Address to unlock the live payment buttons.
                    </p>
                  </div>
                ) : (
                  <PayPalErrorBoundary>
                    <div style={{ minHeight: '140px' }}>
                      <PayPalButtons
                        style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
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
                              paymentMethod: `PayPal / Card (Txn: ${txnId})`,
                              paymentStatus: `Paid (Txn: ${txnId})`,
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
                            console.error('[PayPal Payment Error]', err);
                            setFormError(err.message || 'Payment capture failed. Please check your card balance and try again.');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        onError={(err) => {
                          console.error('[PayPal SDK Error]', err);
                          setFormError('Payment was declined or cancelled by the card-issuing bank. Please verify card balance and details.');
                        }}
                      />
                    </div>
                  </PayPalErrorBoundary>
                )}

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#777' }}>
                  <Lock size={13} color={EMERALD} />
                  <span>256-Bit SSL Bank Encrypted Payment Engine</span>
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
    </PayPalScriptProvider>
  );
}
