'use client';

import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

export default function GlobalUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header/footer on admin and auth routes
  const hideHeaderFooter = pathname?.startsWith('/admin') || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  if (hideHeaderFooter) {
    return (
      <>
        {children}
        {/* WhatsApp Float */}
        <a href="https://wa.me/923001581210" className="wa-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <FaWhatsapp size={34} color="#fff" />
          <span className="wa-tooltip">Chat with us on WhatsApp</span>
        </a>
      </>
    );
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement">
        ✦ FREE WORLDWIDE SHIPPING ON ORDERS OVER $100 &nbsp;✦&nbsp; 100% NATURAL &amp; CERTIFIED
      </div>
      
      <Header />
      
      <main>
        {children}
      </main>
      
      <Footer />
      
      {/* WhatsApp Float */}
      <a href="https://wa.me/923001581210" className="wa-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
        <FaWhatsapp size={34} color="#fff" />
        <span className="wa-tooltip">Chat with us on WhatsApp</span>
      </a>
    </>
  );
}
