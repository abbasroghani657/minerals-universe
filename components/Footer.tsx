'use client';
import Link from 'next/link';
import { FaInstagram, FaTiktok, FaYoutube, FaEbay } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const infoLinks = [
    { label: 'About Our Heritage', href: '/#about' },
    { label: 'Gemstone Catalog', href: '/shop' },
    { label: 'Private Wishlist', href: '/wishlist' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Customer Reviews', href: '/#reviews' },
    { label: 'Contact & Showroom', href: '/#contact' },
  ];

  const supportLinks = [
    { label: 'View Cart & Bag', href: '/cart' },
    { label: 'Secure Checkout', href: '/checkout' },
    { label: 'Shipping & Delivery', href: '/shipping-policy' },
    { label: 'Returns & 30-Day Guarantee', href: '/returns-refunds' },
    { label: 'Privacy & Security', href: '/privacy-policy' },
    { label: 'Terms of Acquisition', href: '/terms' },
    { label: 'Admin Portal', href: '/admin' },
  ];

  return (
    <>
      <div className="teal-divider"></div>
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <span className="footer-logo">Minerals Universe</span>
              <p className="footer-about">Pakistan&apos;s premier online destination for authentic gemstones, minerals and crystals. Serving collectors and jewelers in 50+ countries for over a decade.</p>
              <div style={{ marginBottom: '18px' }}>
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', marginBottom: '5px' }}>
                  📞 <a href="tel:+923001581210" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>+92 300 158 1210</a>
                </p>
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', marginBottom: '5px' }}>
                  📧 <a href="mailto:info@mineralsuniverse.com" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>info@mineralsuniverse.com</a>
                </p>
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', lineHeight: '1.5' }}>📍 Office # F23 second floor Asghar gemstones market namak mandi Peshawar Pakistan</p>
              </div>
              <div className="social-row">
                <a className="social-btn" href="https://www.instagram.com/mineralsuniverse_" target="_blank" rel="noopener" title="Instagram"
                   style={{ borderColor: 'rgba(255,255,255,.18)', background: 'rgba(255,255,255,.06)', color: '#E1306C' }}><FaInstagram size={18} /></a>
                <a className="social-btn" href="https://www.tiktok.com/@mineralsuniverse1?_r=1&_t=ZN-95hIvZ38Z30" target="_blank" rel="noopener" title="TikTok"
                   style={{ borderColor: 'rgba(255,255,255,.18)', background: 'rgba(255,255,255,.06)', color: '#ffffff' }}><FaTiktok size={18} /></a>
                <a className="social-btn" href="https://youtube.com/@mineralsuniverse?si=8xemeeSlWzqPvsAA" target="_blank" rel="noopener" title="YouTube"
                   style={{ borderColor: 'rgba(255,255,255,.18)', background: 'rgba(255,255,255,.06)', color: '#FF0000' }}><FaYoutube size={18} /></a>
                <a className="social-btn" href="https://www.ebay.com/usr/mineralsuniverse" target="_blank" rel="noopener" title="eBay"
                   style={{ borderColor: 'rgba(255,255,255,.18)', background: 'rgba(255,255,255,.06)', color: '#ffffff' }}><FaEbay size={24} /></a>
              </div>
            </div>
            <div>
              <h4>Information</h4>
              <ul className="footer-links">
                {infoLinks.map(item => (
                  <li key={item.label}><Link href={item.href}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Customer Support</h4>
              <ul className="footer-links">
                {supportLinks.map(item => (
                  <li key={item.label}><Link href={item.href}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.12)', margin: '0 0 26px' }} />
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '12.5px', marginBottom: '14px' }}>Accepted Payment Methods</p>
          <div className="payment-row">
            <span className="pay-badge">💳 Visa</span>
            <span className="pay-badge">💳 Mastercard</span>
            <span className="pay-badge">🅿️ PayPal</span>
            <span className="pay-badge">💵 Western Union</span>
            <span className="pay-badge">🏦 Bank Transfer</span>
          </div>
          <div className="footer-bottom">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p className="footer-copy" style={{ margin: 0 }}>
                Copyright © 2025 Minerals Universe — All Rights Reserved | Powered by Minerals Universe
              </p>
              <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap' }}>
                <Link href="/shipping-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Shipping Policy</Link>
                <span>•</span>
                <Link href="/returns-refunds" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Returns &amp; Refunds</Link>
                <span>•</span>
                <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms of Service</Link>
              </div>
            </div>
            <button className="back-top" onClick={scrollToTop} title="Back to top">↑</button>
          </div>
        </div>
      </footer>
    </>
  );
}
