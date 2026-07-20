'use client';
import { useState } from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaEbay, FaWhatsapp } from 'react-icons/fa';

const initialForm = { name: '', email: '', phone: '', source: 'Google Search', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `${form.message} (Source: ${form.source})`,
          type: 'General',
          subject: 'Contact Form Message'
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm(initialForm);
      }
    } catch (err) {
      console.error('[Contact submission error]', err);
    }
  };

  return (
    <section id="contact" style={{ background: 'var(--bg)' }}>
      <div className="section-inner">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Reach Us</p>
          <h2 className="section-title">Get In <span>Touch</span></h2>
          <div className="teal-line"></div>
        </div>
        <div className="contact-grid">
          <div>
            <form className="cform-grid" onSubmit={handleSubmit}>
              <div className="cfield">
                <label>Your Name</label>
                <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="cfield">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="cfield">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
              </div>
              <div className="cfield">
                <label>How did you hear about us?</label>
                <select name="source" value={form.source} onChange={handleChange}>
                  <option>Google Search</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>TikTok</option>
                  <option>Friend / Referral</option>
                  <option>YouTube</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="cfield" style={{ gridColumn: '1/-1' }}>
                <label>Message</label>
                <textarea name="message" placeholder="Tell us about your inquiry..." value={form.message} onChange={handleChange} required></textarea>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <button type="submit" className="btn-teal" style={{ width: '100%', padding: '15px', fontSize: '15px' }}>
                  {submitted ? '✓ Message Sent!' : 'Send Message ✦'}
                </button>
              </div>
            </form>
          </div>
          <div>
            <div className="contact-info-card">
              <h3>Minerals Universe</h3>
              <div className="info-row"><span>📍</span><p>Shop no 2 Hamid Gems Chamber, Shah Qabool Street, Namak Mandi, Peshawar, Pakistan</p></div>
              <div className="info-row"><span>📞</span><p><a href="tel:+923001581210" style={{ color: 'var(--body)', textDecoration: 'none' }}>+92 300 158 1210</a></p></div>
              <div className="info-row"><span>📧</span><p><a href="mailto:info@mineralsuniverse.com" style={{ color: 'var(--body)', textDecoration: 'none' }}>info@mineralsuniverse.com</a></p></div>
              <div className="info-row"><span>🕐</span><p>Mon–Sat: 9:00 AM – 7:00 PM PKT<br />Sunday: 11:00 AM – 5:00 PM</p></div>
              <div className="social-row">
                <a className="social-btn" style={{ color: '#E1306C' }} href="https://www.instagram.com/mineralsuniverse_" target="_blank" rel="noopener" title="Instagram"><FaInstagram size={18} /></a>
                <a className="social-btn" style={{ color: '#000000' }} href="https://www.tiktok.com/@mineralsuniverse1?_r=1&_t=ZN-95hIvZ38Z30" target="_blank" rel="noopener" title="TikTok"><FaTiktok size={18} /></a>
                <a className="social-btn" style={{ color: '#FF0000' }} href="https://youtube.com/@mineralsuniverse?si=8xemeeSlWzqPvsAA" target="_blank" rel="noopener" title="YouTube"><FaYoutube size={18} /></a>
                <a className="social-btn" style={{ color: '#333333' }} href="https://www.ebay.com/usr/mineralsuniverse" target="_blank" rel="noopener" title="eBay"><FaEbay size={24} /></a>
                <a className="social-btn" style={{ color: '#25D366' }} href="https://wa.me/923001581210" target="_blank" rel="noopener" title="WhatsApp"><FaWhatsapp size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
