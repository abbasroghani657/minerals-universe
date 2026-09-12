import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Minerals Universe',
  description: 'Terms of service, sales conditions, and authenticity commitments of Minerals Universe.',
};

export default function TermsPage() {
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
          <span style={{ color: '#333', fontWeight: 600 }}>Terms of Service</span>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a5c4a 0%, #123d31 100%)',
          borderRadius: '16px',
          padding: '40px 36px',
          color: '#ffffff',
          marginBottom: '36px',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.4)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', color: '#ffd98c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
            <Scale size={13} /> Legal Agreement
          </div>
          <h1 className="serif-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, margin: '0 0 12px 0' }}>
            Terms & Conditions of Acquisition
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0, maxWidth: '750px' }}>
            These terms govern acquisitions, specimen provenance representations, and worldwide shipments through Minerals Universe.
          </p>
        </div>

        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '22px', color: '#1a5c4a', margin: '0 0 14px', fontWeight: 600 }}>
            1. Authenticity & Specimen Photography
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            All specimens presented are photographed under balanced 5500K daylight lighting conditions without chromatic distortion. Natural crystals and gemstones may display characteristic inclusions, color zoning, or growth features that verify natural genesis.
          </p>
        </div>

        <div className="policy-card">
          <h2 className="serif-heading" style={{ fontSize: '22px', color: '#1a5c4a', margin: '0 0 14px', fontWeight: 600 }}>
            2. Pricing, Multi-Currency & Invoicing
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#444', margin: 0 }}>
            Base prices are denominated in United States Dollars (USD). Converted amounts in EUR, GBP, AED, and PKR reflect real-time market exchange rates for collector convenience.
          </p>
        </div>
      </div>
    </div>
  );
}
