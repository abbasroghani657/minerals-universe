import Link from 'next/link';
import { ArrowLeft, Truck, ShieldCheck, Package, Clock, Globe, Award } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export const metadata = {
  title: 'Worldwide Shipping & Delivery Policy | Minerals Universe',
  description: 'Learn about our insured worldwide DHL Express delivery, customs procedures, and tamper-proof luxury packaging for fine gemstones and minerals.',
};

export default function ShippingPolicyPage() {
  return (
    <div style={{ background: '#fbfaf8', minHeight: '100vh', padding: '120px 20px 80px', fontFamily: "'DM Sans', sans-serif", color: '#222' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .serif-heading { font-family: 'Cormorant Garamond', serif; }
        .policy-container { max-width: 960px; margin: 0 auto; }
        .policy-card { background: #fff; border: 1px solid #e8e6e1; border-radius: 12px; padding: 36px 32px; margin-bottom: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .feature-box { background: #faf9f6; border: 1px solid #eeebe5; border-radius: 8px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; }
      `}} />

      <div className="policy-container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#777', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1a5c4a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>Shipping & Delivery Policy</span>
        </div>

        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a5c4a 0%, #123d31 100%)',
          borderRadius: '16px',
          padding: '40px 36px',
          color: '#ffffff',
          marginBottom: '36px',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.4)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', color: '#ffd98c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
            <Globe size={13} /> Global Logistics
          </div>
          <h1 className="serif-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, margin: '0 0 12px 0' }}>
            Worldwide Shipping & Delivery Policy
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0, maxWidth: '750px' }}>
            Minerals Universe ensures discreet, fully insured, and expedited transit for all precious gemstones and high-value mineral specimens across over 120 countries worldwide.
          </p>
        </div>

        {/* Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="feature-box">
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eaf3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a', flexShrink: 0 }}>
              <Truck size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1a5c4a', fontWeight: 700 }}>DHL Express Priority</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>Delivered in 3 to 6 business days with real-time end-to-end GPS tracking.</p>
            </div>
          </div>

          <div className="feature-box">
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eaf3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1a5c4a', fontWeight: 700 }}>100% Transit Insurance</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>Every shipment is fully insured up to its full declared purchase value.</p>
            </div>
          </div>

          <div className="feature-box">
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eaf3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a', flexShrink: 0 }}>
              <Package size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1a5c4a', fontWeight: 700 }}>Museum-Grade Packaging</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>Shock-absorbent high-density foam & tamper-evident security wax seals.</p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '24px', color: '#1a5c4a', margin: '0 0 16px', fontWeight: 600 }}>
            1. International Shipping Carriers & Delivery Timelines
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', marginBottom: '16px' }}>
            All orders placed with Minerals Universe are dispatched from our headquarters in Namak Mandi, Peshawar. We partner exclusively with premier international logistics providers, primarily <strong>DHL Express Worldwide</strong> and <strong>FedEx International Priority</strong>.
          </p>
          <ul style={{ fontSize: '14.5px', lineHeight: 1.8, color: '#444', paddingLeft: '20px', marginBottom: '20px' }}>
            <li><strong>United States & Canada:</strong> 3 – 5 business days</li>
            <li><strong>United Kingdom & European Union:</strong> 3 – 5 business days</li>
            <li><strong>United Arab Emirates & Gulf States:</strong> 2 – 4 business days</li>
            <li><strong>Australia, New Zealand & East Asia:</strong> 5 – 7 business days</li>
          </ul>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            Order dispatch occurs within 24–48 hours following payment confirmation and necessary gemological certificate verification.
          </p>
        </div>

        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '24px', color: '#1a5c4a', margin: '0 0 16px', fontWeight: 600 }}>
            2. Customs, Import Duties & Legal Origin Clearance
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', marginBottom: '16px' }}>
            As certified gem dealers, every shipment includes official commercial invoices, Certificates of Authenticity, and Chamber of Commerce Origin declarations conforming to international precious mineral export standards.
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            Import duties, VAT, or local customs clearance taxes (if applicable by your destination country's regulations) are the responsibility of the recipient. Our logistics department coordinates directly with DHL customs brokers to facilitate seamless clearance without unnecessary delays.
          </p>
        </div>

        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '24px', color: '#1a5c4a', margin: '0 0 16px', fontWeight: 600 }}>
            3. Package Tracking & Direct Assistance
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', marginBottom: '20px' }}>
            Upon dispatch, you will immediately receive an automated tracking notification via email and WhatsApp containing your tracking number and expected delivery date.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/923001581210?text=Hello%20Minerals%20Universe%2C%20I%20have%20an%20inquiry%20regarding%20shipping%20and%20tracking."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13.5px',
                textDecoration: 'none'
              }}
            >
              <FaWhatsapp size={16} /> Track with Gemologist via WhatsApp
            </a>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1a5c4a',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13.5px',
                textDecoration: 'none'
              }}
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
