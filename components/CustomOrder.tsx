'use client';
import { useState } from 'react';

const initialForm = {
  stoneType: '',
  caratWeight: '',
  preferredColor: '',
  maxBudget: '',
  intendedUse: 'Jewelry',
  contact: '',
  notes: '',
};

export default function CustomOrder() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(initialForm);
  };

  return (
    <>
      <section id="custom-order" style={{ background: 'var(--bg)' }}>
        <div className="section-inner">
          <div className="custom-section">
            <div className="custom-inner">
              <div className="custom-text">
                <p style={{ color: '#9ee4de', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '12px' }}>✦ Bespoke Service</p>
                <h2>Can&apos;t Find What You&apos;re<br /><span>Looking For?</span></h2>
                <div style={{ width: '52px', height: '3px', background: '#9ee4de', borderRadius: '2px', marginBottom: '20px' }}></div>
                <p>Request a Custom Stone — our gemologists source rare gems to your exact specifications. From investment-grade sapphires to unique collector specimens, we fulfill bespoke orders worldwide.</p>
                <ul style={{ listStyle: 'none', marginTop: '16px' }}>
                  <li style={{ color: 'rgba(255,255,255,.68)', fontSize: '13.5px', marginBottom: '8px' }}>✦ Direct mine sourcing from Pakistan &amp; Afghanistan</li>
                  <li style={{ color: 'rgba(255,255,255,.68)', fontSize: '13.5px', marginBottom: '8px' }}>✦ GIA / AGL certification available</li>
                  <li style={{ color: 'rgba(255,255,255,.68)', fontSize: '13.5px', marginBottom: '8px' }}>✦ Typical fulfillment: 7–21 business days</li>
                </ul>
              </div>
              <div>
                <form className="form-grid" onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label>Stone Type</label>
                    <input type="text" name="stoneType" placeholder="e.g. Sapphire, Ruby..." value={form.stoneType} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Target Carat Weight</label>
                    <input type="text" name="caratWeight" placeholder="e.g. 5.0 ct" value={form.caratWeight} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Preferred Color</label>
                    <input type="text" name="preferredColor" placeholder="e.g. Deep blue..." value={form.preferredColor} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Max Budget (USD)</label>
                    <input type="number" name="maxBudget" placeholder="$500" value={form.maxBudget} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Intended Use</label>
                    <select name="intendedUse" value={form.intendedUse} onChange={handleChange}>
                      <option>Jewelry</option>
                      <option>Collection</option>
                      <option>Investment</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Your Contact</label>
                    <input type="text" name="contact" placeholder="Email or WhatsApp" value={form.contact} onChange={handleChange} />
                  </div>
                  <div className="form-field form-full">
                    <label>Additional Notes</label>
                    <textarea name="notes" placeholder="Any specific requirements..." value={form.notes} onChange={handleChange}></textarea>
                  </div>
                  <div className="form-full">
                    <button type="submit" className="btn-teal" style={{ width: '100%', padding: '15px' }}>
                      {submitted ? '✓ Request Submitted!' : 'Submit Custom Request ✦'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
