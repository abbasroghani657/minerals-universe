'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Lock, ShieldCheck } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SafePayPalBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[PayPal Gateway Notice]', error.message);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fff9e6', border: '1px solid #fae69e', borderRadius: '8px', color: '#8a6400', fontSize: '13.5px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>⚠️ International Payment Connection</p>
          <p style={{ margin: '0 0 14px', lineHeight: 1.5 }}>
            Unable to connect to the bank network from your current connection. Please refresh or check your internet.
          </p>
          <button 
            type="button"
            onClick={() => this.setState({ hasError: false })}
            style={{ background: '#1a5c4a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            Retry Connection
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PayPalSectionProps {
  subtotalUSD: number;
  isShippingValid: boolean;
  isSubmitting: boolean;
  onApproveOrder: (txnId: string) => Promise<void>;
  onError: (msg: string) => void;
}

export default function PayPalCheckoutSection({
  subtotalUSD,
  isShippingValid,
  isSubmitting,
  onApproveOrder,
  onError,
}: PayPalSectionProps) {
  if (!isShippingValid) {
    return (
      <div style={{ background: '#fffaf0', border: '1px solid #f3ebd8', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#8a6400', fontSize: '14.5px' }}>
          👉 Step 1: Complete Delivery Details Above
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#7a5a00' }}>
          Please enter your Full Name, Email, Phone, and Address to unlock the live payment buttons.
        </p>
      </div>
    );
  }

  return (
    <SafePayPalBoundary>
      <div style={{ minHeight: '140px' }}>
        <PayPalScriptProvider options={{ 
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAk51QAzJlc_kltTZbbhUV03jzLZefyf7oT1OtIn-Kw9j74ijabIbeoCT2ARvl5gxuVyPCiHl2VebG9wo', 
          currency: 'USD',
          intent: 'capture',
          components: 'buttons',
        }}>
          <PayPalButtons
            style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
            disabled={isSubmitting}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    description: `Minerals Universe Gemstones Order`,
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
              try {
                const details = await actions.order.capture();
                const txnId = details?.id || data.orderID;
                await onApproveOrder(txnId);
              } catch (err: any) {
                console.error('[Capture Error]', err);
                onError(err.message || 'Payment capture failed. Please check your card balance and try again.');
              }
            }}
            onError={(err) => {
              console.error('[PayPal SDK Error]', err);
              onError('Payment was declined or cancelled by the bank. Please check your balance or try another card.');
            }}
          />
        </PayPalScriptProvider>
      </div>
    </SafePayPalBoundary>
  );
}
