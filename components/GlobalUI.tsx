'use client';

import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

export default function GlobalUI() {
  const pathname = usePathname();
  
  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement">
        ✦ FREE WORLDWIDE SHIPPING ON ORDERS OVER $100 &nbsp;✦&nbsp; 100% NATURAL &amp; CERTIFIED
      </div>
      
      {/* WhatsApp Float */}
      <a href="https://wa.me/923001581210" className="wa-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
        <FaWhatsapp size={34} color="#fff" />
        <span className="wa-tooltip">Chat with us on WhatsApp</span>
      </a>
    </>
  );
}
