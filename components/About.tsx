import Image from 'next/image';

export default function About() {
  return (
    <>
      <section id="about" style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-text">
              <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '12px' }}>✦ Our Story</p>
              <h2>Welcome to<br /><span>Minerals Universe</span></h2>
              <div className="teal-line left" style={{ marginBottom: '28px' }}></div>
              <p>Minerals Universe is your premier destination for authentic gemstones, minerals, and crystals sourced directly from the world&apos;s most prolific geological regions. For over a decade, we have curated an extraordinary collection for jewelers, collectors, and enthusiasts worldwide.</p>
              <p>Our team of expert gemologists personally inspects every specimen — from the sapphire mines of Pakistan&apos;s Hunza Valley to the tourmaline deposits of Kunar, Afghanistan. Each stone is authenticated, certified, and delivered with complete transparency.</p>
              <a href="#products" className="btn-teal" style={{ marginTop: '16px' }}>Shop Now</a>
              <div className="stats-row">
                <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Products</div></div>
                <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Countries</div></div>
                <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Yrs Experience</div></div>
                <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Certified</div></div>
              </div>
            </div>
            <div className="about-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=700&q=80"
                alt="Gemstone collection"
                style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '14px' }}
              />
              <div className="about-glow"></div>
              <div className="about-badge">
                <p>✦ Certified Gemologist</p>
                <span>GIA • AGL • GÜBELIN</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
