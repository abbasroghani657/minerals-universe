'use client';
import { useEffect, useRef, useState } from 'react';

const SLIDE_DEFAULTS = [
  {
    id: 1,
    cls: 'slide1',
    bannerKey: 'hero_banner_1',
    tagKey: 'hero_tag_1',
    titleKey: 'hero_title_1',
    descKey: 'hero_desc_1',
    ctaKey: 'hero_cta_1',
    linkKey: 'hero_link_1',
    showTextKey: 'hero_show_text_1',
    fitKey: 'hero_fit_1',
    defaultTag: '✨ Featured Collection',
    defaultTitle: "Polished Stones - Nature's Art, Perfected",
    defaultDesc: 'Handpicked specimens from around the world, curated for collectors and connoisseurs',
    defaultCta: 'Shop Now',
    defaultHref: '#products',
    defaultBg: '/images/hero/luxury-gemstones-collection.webp',
  },
  {
    id: 2,
    cls: 'slide2',
    bannerKey: 'hero_banner_2',
    tagKey: 'hero_tag_2',
    titleKey: 'hero_title_2',
    descKey: 'hero_desc_2',
    ctaKey: 'hero_cta_2',
    linkKey: 'hero_link_2',
    showTextKey: 'hero_show_text_2',
    fitKey: 'hero_fit_2',
    defaultTag: '✨ New Arrivals',
    defaultTitle: 'Natural Loose Gemstones - Rare & Certified',
    defaultDesc: 'Sapphires, Rubies, Tourmalines & more - directly sourced from premier mining regions',
    defaultCta: 'Explore Collection',
    defaultHref: '#categories',
    defaultBg: '/images/hero/aquamarine-crystal-matrix.webp',
  },
  {
    id: 3,
    cls: 'slide3',
    bannerKey: 'hero_banner_3',
    tagKey: 'hero_tag_3',
    titleKey: 'hero_title_3',
    descKey: 'hero_desc_3',
    ctaKey: 'hero_cta_3',
    linkKey: 'hero_link_3',
    showTextKey: 'hero_show_text_3',
    fitKey: 'hero_fit_3',
    defaultTag: '✨ Collectors Edition',
    defaultTitle: 'Minerals & Crystals - Sourced from the Earth',
    defaultDesc: "Authentic specimens for collectors and jewelers - from the world's finest geological formations",
    defaultCta: 'View All',
    defaultHref: '#categories',
    defaultBg: '/images/hero/faceted-gems-spectrum.webp',
  },
];

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const sparklesRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const goTo = (n: number) => setCur(((n % 3) + 3) % 3);

  // Fetch dynamic banner URLs and text from settings
  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) return;
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('application/json')) return;
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.warn('Using fallback hero banners:', err);
      }
    }
    fetchBanners();
  }, []);

  // Modern scroll-driven interactive depth & parallax
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y <= 650) {
        setScrollProgress(Math.min(1, y / 550));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Autoplay with pause-on-hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => goTo(cur + 1), 6000);
    return () => clearInterval(interval);
  }, [cur, isPaused]);

  // Ambient sparkles
  useEffect(() => {
    if (!sparklesRef.current) return;
    sparklesRef.current.innerHTML = '';
    for (let i = 0; i < 35; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${2.5 + Math.random() * 3.5}s;--delay:${Math.random() * 4}s;`;
      sparklesRef.current.appendChild(s);
    }
  }, []);

  // Format title with glowing teal accent on secondary segment
  const renderTitle = (rawTitle: string) => {
    if (!rawTitle) return null;
    if (rawTitle.includes(' - ')) {
      const [mainPart, accentPart] = rawTitle.split(' - ');
      return (
        <>
          {mainPart} -<br />
          <span>{accentPart}</span>
        </>
      );
    }
    return rawTitle;
  };

  const handleScrollDown = () => {
    const target = document.querySelector('.trust-section') || document.querySelector('section:not(.hero)');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="hero" 
      style={{ padding: 0 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Minerals & Gemstones Showcase"
    >
      <div className="sparkles" ref={sparklesRef}></div>
      <div className="slides" style={{ transform: `translateX(-${cur * 33.333}%)` }}>
        {SLIDE_DEFAULTS.map((slide) => {
          const bgUrl = settings[slide.bannerKey] || slide.defaultBg;
          const showText = settings[slide.showTextKey] !== 'false';
          const fitMode = settings[slide.fitKey] || 'cover';

          const tag = settings[slide.tagKey] || slide.defaultTag;
          const title = settings[slide.titleKey] || slide.defaultTitle;
          const desc = settings[slide.descKey] || slide.defaultDesc;
          const cta = settings[slide.ctaKey] || slide.defaultCta;
          const href = settings[slide.linkKey] || slide.defaultHref;

          const isContain = fitMode === 'contain';

          return (
            <div key={slide.id} className={`slide ${slide.cls}`}>
              {/* Layer 1: Ambient soft blur that fills the screen in the photo's own natural colors */}
              <div 
                className="slide-ambient" 
                style={{ backgroundImage: `url('${bgUrl}')` }}
              ></div>

              {/* Layer 2: Main Gemstone Picture (Cover = edge-to-edge, Contain = uncropped in center) */}
              <div 
                className="slide-fg" 
                style={{ 
                  backgroundImage: `url('${bgUrl}')`,
                  backgroundSize: isContain ? 'contain' : 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: `scale(${1 + scrollProgress * 0.05}) translateY(${scrollProgress * 30}px)`,
                }}
              ></div>

              {/* Layer 3: Ultra-soft crystal-clear overlay - ZERO dark green tint */}
              <div className="slide-overlay"></div>

              {/* Slide Text Content in Frosted Glass Capsule (Only shown if showText is true) */}
              {showText && (
                <div 
                  className="slide-content"
                  style={{
                    opacity: Math.max(0, 1 - scrollProgress * 1.8),
                    transform: `translateY(-${scrollProgress * 50}px)`,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    boxShadow: 'none',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    padding: '0 20px',
                    maxWidth: '880px',
                    margin: '0 auto 30px',
                  }}
                >
                  <div className="slide-tag">{tag}</div>
                  <h1>{renderTitle(title)}</h1>
                  <p>{desc}</p>
                  <a href={href} className="btn-teal">{cta}</a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hero-arrows" style={{ opacity: Math.max(0, 1 - scrollProgress * 2.5) }}>
        <button className="arrow-btn" onClick={() => goTo(cur - 1)} aria-label="Previous Slide">&#10094;</button>
        <button className="arrow-btn" onClick={() => goTo(cur + 1)} aria-label="Next Slide">&#10095;</button>
      </div>

      <div className="hero-dots" style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}>
        {SLIDE_DEFAULTS.map((_, i) => (
          <button 
            key={i} 
            className={`dot${cur === i ? ' active' : ''}`} 
            onClick={() => goTo(i)} 
            aria-label={`Slide ${i + 1}`} 
          />
        ))}
      </div>

      {/* Modern Luxury Animated Scroll Down Indicator (Clean Mouse Cue - Zero Button Collision) */}
      <div 
        className="hero-scroll-cue" 
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to explore collection"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 3.5) }}
      >
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
      </div>
    </section>
  );
}

