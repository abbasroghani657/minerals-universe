'use client';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGone(true), 700);
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div id="loader" className={gone ? 'gone' : ''}>
      <svg className="gem-spin" viewBox="0 0 60 60" fill="none">
        <polygon points="30,2 58,20 58,40 30,58 2,40 2,20" fill="none" stroke="#1a7f74" strokeWidth="2"/>
        <polygon points="30,10 48,22 48,38 30,50 12,38 12,22" fill="rgba(26,127,116,0.1)" stroke="#1a7f74" strokeWidth="1"/>
        <line x1="30" y1="2" x2="30" y2="10" stroke="#1a7f74" strokeWidth="1.5"/>
        <line x1="58" y1="20" x2="48" y2="22" stroke="#1a7f74" strokeWidth="1.5"/>
        <line x1="58" y1="40" x2="48" y2="38" stroke="#1a7f74" strokeWidth="1.5"/>
        <line x1="30" y1="58" x2="30" y2="50" stroke="#1a7f74" strokeWidth="1.5"/>
        <line x1="2" y1="40" x2="12" y2="38" stroke="#1a7f74" strokeWidth="1.5"/>
        <line x1="2" y1="20" x2="12" y2="22" stroke="#1a7f74" strokeWidth="1.5"/>
        <circle cx="30" cy="30" r="4" fill="#1a7f74"/>
      </svg>
    </div>
  );
}
