import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, Eye } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Minerals Universe',
  description: 'Learn how Minerals Universe protects customer data, payment security, and transaction privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#fbfaf8', minHeight: '100vh', padding: '120px 20px 80px', fontFamily: "'DM Sans', sans-serif", color: '#222' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .serif-heading { font-family: 'Cormorant Garamond', serif; }
        .policy-container { max-width: 960px; margin: 0 auto; }
        .policy-card { background: #fff; border: 1px solid #e8e6e1; border-radius: 12px; padding: 36px 32px; margin-bottom: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
      `}} />

      <div className="policy-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#777', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1a5c4a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>Privacy & Data Security Policy</span>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a5c4a 0%, #123d31 100%)',
          borderRadius: '16px',
          padding: '40px 36px',
          color: '#ffffff',
          marginBottom: '36px',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.4)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', color: '#ffd98c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
            <Lock size={13} /> Data Integrity
          </div>
          <h1 className="serif-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, margin: '0 0 12px 0' }}>
            Privacy & Confidentiality Policy
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0, maxWidth: '750px' }}>
            Minerals Universe adheres to strict international standards regarding client privacy, encrypted payment processing, and confidential acquisition records.
          </p>
        </div>

        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '22px', color: '#1a5c4a', margin: '0 0 14px', fontWeight: 600 }}>
            1. Information Collection & Usage
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', marginBottom: '14px' }}>
            We only collect necessary information required to fulfill orders, arrange DHL customs clearance, and communicate order tracking updates (such as name, verified shipping address, phone number, and email address).
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            We <strong>never sell, lease, or distribute</strong> client contact details or purchase histories to third-party marketing entities.
          </p>
        </div>

        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '22px', color: '#1a5c4a', margin: '0 0 14px', fontWeight: 600 }}>
            2. Payment Security & Encryption
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            Credit card transactions are processed securely through PCI-DSS Level 1 certified gateways (including Stripe and PayPal). Minerals Universe does not store or process raw credit card numbers on our servers. All traffic is encrypted using 256-bit SSL/TLS protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
