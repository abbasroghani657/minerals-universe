export default function TrustBar() {
  return (
    <>
      <div className="teal-divider"></div>
      <div className="trust-section">
        <div className="trust-grid">
          <div className="trust-card">
            <span className="trust-icon">📦</span>
            <h3>Secure Packaging</h3>
            <p>Your gems are packed safely to prevent any damage during transit</p>
          </div>
          <div className="trust-card">
            <span className="trust-icon">🔒</span>
            <h3>Secure Payment</h3>
            <p>Visa, Mastercard, PayPal — all transactions encrypted &amp; protected</p>
          </div>
          <div className="trust-card">
            <span className="trust-icon">💎</span>
            <h3>100% Natural &amp; Certified</h3>
            <p>Every gem certified by accredited gemological laboratories</p>
          </div>
          <div className="trust-card">
            <span className="trust-icon">🌍</span>
            <h3>Fast Shipping Worldwide</h3>
            <p>Insured express delivery to 50+ countries — fully tracked</p>
          </div>
        </div>
      </div>
      <div className="teal-divider"></div>
    </>
  );
}
