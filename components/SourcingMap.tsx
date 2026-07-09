export default function SourcingMap() {
  return (
    <>
      <section style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="text-center" style={{ marginBottom: '44px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Ethical Sourcing</p>
            <h2 className="section-title">Sourced from the World&apos;s<br /><span>Finest Locations</span></h2>
            <div className="teal-line"></div>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', fontSize: '14.5px', lineHeight: '1.75' }}>
              We are committed to ethical, transparent sourcing — working directly with trusted miners and cooperatives to ensure fair wages, safe conditions, and environmental responsibility.
            </p>
          </div>
          <div className="world-map-wrap">
            <svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '400px', display: 'block' }}>
              <rect width="900" height="400" fill="#e6efed"/>
              <text x="450" y="220" textAnchor="middle" fill="rgba(26,127,116,0.1)" fontSize="150" fontFamily="serif">🌏</text>
              <circle cx="590" cy="168" r="10" fill="#1a7f74" opacity=".2"><animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/></circle>
              <circle cx="590" cy="168" r="6" fill="#1a7f74"/><text x="590" y="194" textAnchor="middle" fill="#0f5c53" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Pakistan</text>
              <circle cx="566" cy="159" r="10" fill="#1a7f74" opacity=".2"><animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite"/></circle>
              <circle cx="566" cy="159" r="6" fill="#1a7f74"/><text x="538" y="148" textAnchor="middle" fill="#0f5c53" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Afghanistan</text>
              <circle cx="285" cy="255" r="10" fill="#4e7470" opacity=".2"><animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite"/></circle>
              <circle cx="285" cy="255" r="6" fill="#4e7470"/><text x="285" y="280" textAnchor="middle" fill="#4e7470" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Brazil</text>
              <circle cx="622" cy="214" r="10" fill="#1a7f74" opacity=".2"><animate attributeName="r" values="10;20;10" dur="2.2s" repeatCount="indefinite"/></circle>
              <circle cx="622" cy="214" r="6" fill="#1a7f74"/><text x="652" y="214" fill="#0f5c53" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Sri Lanka</text>
              <circle cx="658" cy="184" r="10" fill="#4e7470" opacity=".2"><animate attributeName="r" values="10;20;10" dur="1.9s" repeatCount="indefinite"/></circle>
              <circle cx="658" cy="184" r="6" fill="#4e7470"/><text x="680" y="184" fill="#4e7470" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Myanmar</text>
              <circle cx="566" cy="268" r="10" fill="#1a7f74" opacity=".2"><animate attributeName="r" values="10;20;10" dur="3.2s" repeatCount="indefinite"/></circle>
              <circle cx="566" cy="268" r="6" fill="#1a7f74"/><text x="566" y="294" textAnchor="middle" fill="#0f5c53" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Madagascar</text>
              <circle cx="248" cy="214" r="10" fill="#4e7470" opacity=".2"><animate attributeName="r" values="10;20;10" dur="2.8s" repeatCount="indefinite"/></circle>
              <circle cx="248" cy="214" r="6" fill="#4e7470"/><text x="222" y="204" fill="#4e7470" fontSize="11" fontFamily="Poppins,sans-serif" fontWeight="600">Colombia</text>
              <rect width="900" height="400" fill="none" stroke="rgba(26,127,116,0.18)" strokeWidth="1"/>
            </svg>
          </div>
          <div className="origin-cards">
            <div className="origin-card"><span className="flag">🇵🇰</span><h4>Pakistan</h4><p>Sapphire, Tourmaline, Spinel, Topaz</p></div>
            <div className="origin-card"><span className="flag">🇦🇫</span><h4>Afghanistan</h4><p>Lapis, Kunzite, Tourmaline</p></div>
            <div className="origin-card"><span className="flag">🇧🇷</span><h4>Brazil</h4><p>Aquamarine, Topaz, Tourmaline</p></div>
            <div className="origin-card"><span className="flag">🇱🇰</span><h4>Sri Lanka</h4><p>Sapphire, Ruby, Spinel</p></div>
            <div className="origin-card"><span className="flag">🇲🇲</span><h4>Myanmar</h4><p>Ruby, Sapphire, Spinel</p></div>
            <div className="origin-card"><span className="flag">🇲🇬</span><h4>Madagascar</h4><p>Sapphire, Tourmaline, Garnet</p></div>
            <div className="origin-card"><span className="flag">🇨🇴</span><h4>Colombia</h4><p>Emerald — Finest Green</p></div>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
