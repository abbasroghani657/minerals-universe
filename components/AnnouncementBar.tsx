'use client';

import React from 'react';

const ANNOUNCEMENT_ITEMS = [
  'FREE WORLDWIDE SHIPPING ON ORDERS OVER $100',
  '100% NATURAL & CERTIFIED GEMSTONES',
  'DIRECT FROM HIMALAYAN & HINDU KUSH MINES',
  'REQUEST 4K VIDEO CONSULTATION VIA WHATSAPP',
  'INSURED DOORSTEP EXPRESS DELIVERY (DHL / FEDEX)',
  '30-DAY MONEY-BACK GUARANTEE'
];

export default function AnnouncementBar() {
  return (
    <aside className="announcement-bar" role="region" aria-label="Store Announcements" title="Pause on hover">
      <div className="announcement-track">
        {/* Set 1 */}
        {ANNOUNCEMENT_ITEMS.map((item, index) => (
          <div key={`ann-1-${index}`} className="announcement-item">
            <span className="announcement-diamond">✦</span>
            <span>{item}</span>
          </div>
        ))}
        {/* Set 2 (Duplicate for infinite seamless loop) */}
        {ANNOUNCEMENT_ITEMS.map((item, index) => (
          <div key={`ann-2-${index}`} className="announcement-item" aria-hidden="true">
            <span className="announcement-diamond">✦</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}