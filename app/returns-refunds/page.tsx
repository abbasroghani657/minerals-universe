import Link from 'next/link';
import { ArrowLeft, RotateCcw, ShieldCheck, CheckCircle, Clock, Award } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export const metadata = {
  title: 'Returns & 30-Day Refund Policy | Minerals Universe',
  description: 'Our 30-day money-back guarantee and return policy for certified earth-mined gemstones and minerals.',
};

export default function ReturnsRefundsPage() {
  return (
    <div style={{ background: '#fbfaf8', minHeight: '100vh', padding: '120px 20px 80px', fontFamily: "'DM Sans', sans-serif", color: '#222' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .serif-heading { font-family: 'Cormorant Garamond', serif; }
        .policy-container { max-width: 960px; margin: 0 auto; }
        .policy-card { background: #fff; border: 1px solid #e8e6e1; border-radius: 12px; padding: 36px 32px; margin-bottom: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
      `}} />

      <div className="policy-container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#777', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1a5c4a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>Returns & Refunds Guarantee</span>
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
            <ShieldCheck size={13} /> Collector Assurance
          </div>
          <h1 className="serif-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, margin: '0 0 12px 0' }}>
            30-Day Money-Back Guarantee & Return Policy
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0, maxWidth: '750px' }}>
            We want you to acquire gemstones with complete confidence. Every specimen purchased from Minerals Universe is covered by our unconditional 30-day inspection period and full authenticity guarantee.
          </p>
        </div>

        {/* 3 Steps Process */}
        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '24px', color: '#1a5c4a', margin: '0 0 20px', fontWeight: 600 }}>
            How Our 30-Day Return Guarantee Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#faf9f6', padding: '20px', borderRadius: '8px', border: '1px solid #eeebe5' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#c5a059', marginBottom: '8px' }}>Step 1: Inspect</div>
              <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                You have 30 full days from the moment your package is delivered to examine your specimen in person or submit it to an independent gemological laboratory (e.g. GIA, GRS, IGI, SSEF).
              </p>
            </div>
            <div style={{ background: '#faf9f6', padding: '20px', borderRadius: '8px', border: '1px solid #eeebe5' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#c5a059', marginBottom: '8px' }}>Step 2: Notify</div>
              <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                If you are not completely enchanted, message our concierge team via WhatsApp or email. We will issue a Return Merchandise Authorization (RMA) and secure return instructions.
              </p>
            </div>
            <div style={{ background: '#faf9f6', padding: '20px', borderRadius: '8px', border: '1px solid #eeebe5' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#c5a059', marginBottom: '8px' }}>Step 3: 100% Refund</div>
              <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                Upon receipt and verification of the specimen in its original untampered condition, a full 100% refund will be processed back to your original payment method within 3 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Authenticity Guarantee */}
        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '24px', color: '#1a5c4a', margin: '0 0 16px', fontWeight: 600 }}>
            Lifetime Authenticity Guarantee
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', marginBottom: '16px' }}>
            Minerals Universe warrants that every specimen sold through our platform is <strong>100% genuine, natural earth-mined mineral or gemstone</strong>. We do not sell synthetic, glass-filled, or lab-created substitutes.
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            If any reputable certified international gemological laboratory (such as GIA, GRS, or Gübelin) concludes that a specimen is synthetic or artificially treated contrary to our disclosure, we will provide an immediate 100% refund, plus reimburse your testing fees.
          </p>
        </div>

        {/* Contact Concierge */}
        <div className="policy-card" style={{ background: '#f4fbf7', borderColor: '#c1e7d8' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1a5c4a', fontWeight: 700 }}>
            Need to Initiate a Return or Exchange?
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#444' }}>
            Contact our senior gemologist directly. We provide hassle-free support 7 days a week.
          </p>
          <a
            href="https://wa.me/923001581210?text=Hello%20Minerals%20Universe%2C%20I%20would%20like%20to%20inquire%20about%20a%20return%20or%20exchange."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#25D366',
              color: '#fff',
              padding: '12px 22px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            <FaWhatsapp size={17} /> Connect with Return Concierge on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
