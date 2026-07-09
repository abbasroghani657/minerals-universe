'use client';
import { FaInstagram, FaTiktok, FaYoutube, FaEbay } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const infoLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Privacy Policy', href: '#contact' },
    { label: 'Payment Info', href: '#contact' },
    { label: 'Shipping Policy', href: '#contact' },
  ];

  const supportLinks = [
    { label: 'My Account', href: '#contact' },
    { label: 'Checkout', href: '#products' },
    { label: 'Cart', href: '#products' },
    { label: 'Track Order', href: '#contact' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Wishlist', href: '#products' },
    { label: 'Custom Order', href: '#custom-order' },
    { label: 'Contact Us', href: '#contact' },
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
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px' }}>📍 Namak Mandi, Peshawar, Pakistan</p>
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
                  <li key={item.label}><a href={item.href}>{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Customer Support</h4>
              <ul className="footer-links">
                {supportLinks.map(item => (
                  <li key={item.label}><a href={item.href}>{item.label}</a></li>
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
            <p className="footer-copy">Copyright © 2025 Minerals Universe — All Rights Reserved | Powered by Minerals Universe</p>
            <button className="back-top" onClick={scrollToTop} title="Back to top">↑</button>
          </div>
        </div>
      </footer>
    </>
  );
}
