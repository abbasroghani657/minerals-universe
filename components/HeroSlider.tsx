'use client';
import { useEffect, useRef, useState } from 'react';

const slides = [
  {
    cls: 'slide1',
    tag: '✦ Featured Collection',
    title: <>Polished Stones —<br /><span>Nature&apos;s Art,</span> Perfected</>,
    desc: 'Handpicked specimens from around the world, curated for collectors and connoisseurs',
    cta: 'Shop Now',
    href: '#products',
  },
  {
    cls: 'slide2',
    tag: '✦ New Arrivals',
    title: <>Natural Loose Gemstones —<br /><span>Rare &amp; Certified</span></>,
    desc: 'Sapphires, Rubies, Tourmalines & more — directly sourced from premier mining regions',
    cta: 'Explore Collection',
    href: '#categories',
  },
  {
    cls: 'slide3',
    tag: '✦ Collectors Edition',
    title: <>Minerals &amp; Crystals —<br /><span>Sourced from</span> the Earth</>,
    desc: "Authentic specimens for collectors and jewelers — from the world's finest geological formations",
    cta: 'View All',
    href: '#categories',
  },
];

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const sparklesRef = useRef<HTMLDivElement>(null);

  const goTo = (n: number) => setCur(((n % 3) + 3) % 3);

  useEffect(() => {
    const interval = setInterval(() => goTo(cur + 1), 5000);
    return () => clearInterval(interval);
  }, [cur]);

  useEffect(() => {
    if (!sparklesRef.current) return;
    sparklesRef.current.innerHTML = '';
    for (let i = 0; i < 55; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${2 + Math.random() * 4}s;--delay:${Math.random() * 5}s;`;
      sparklesRef.current.appendChild(s);
    }
  }, []);

  return (
    <section className="hero" style={{ padding: 0 }}>
      <div className="sparkles" ref={sparklesRef}></div>
      <div className="slides" style={{ transform: `translateX(-${cur * 33.333}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} className={`slide ${slide.cls}`}>
            <div className="slide-bg"></div>
            <div className="slide-content">
              <div className="slide-tag">{slide.tag}</div>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
              <a href={slide.href} className="btn-teal">{slide.cta}</a>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-arrows">
        <button className="arrow-btn" onClick={() => goTo(cur - 1)}>←</button>
        <button className="arrow-btn" onClick={() => goTo(cur + 1)}>→</button>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`dot${cur === i ? ' active' : ''}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </section>
  );
}
