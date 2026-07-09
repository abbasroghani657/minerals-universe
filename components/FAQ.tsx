'use client';
import { useState } from 'react';

const faqs = [
  { q: 'Are your gemstones natural and untreated?', a: 'All our gemstones are 100% natural. We clearly disclose the treatment status of each stone in the product listing and certification. Untreated stones are specifically labelled and priced accordingly.' },
  { q: 'Do you provide certificates for your stones?', a: 'Yes. We offer certificates from internationally recognized laboratories including GIA, AGL, and Gübelin. Certificate options are indicated on each product page.' },
  { q: 'How long does international shipping take?', a: 'Standard insured shipping takes 7–14 business days internationally. Express DHL/FedEx (3–5 days) is available at an additional charge. All shipments are fully insured and tracked.' },
  { q: 'Can I request a specific stone or custom order?', a: 'Absolutely. Our custom order service lets you specify stone type, carat weight, color, origin preference, and budget. Use our Custom Order form or contact us on WhatsApp.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, PayPal, Western Union, and direct bank transfer. All online transactions are SSL-encrypted.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <>
      <section id="faq" style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Support</p>
            <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
            <div className="teal-line"></div>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => toggle(i)}>
                  {faq.q}
                  <span className={`faq-icon${openIndex === i ? ' open' : ''}`}>+</span>
                </button>
                <div className={`faq-a${openIndex === i ? ' open' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>
    </>
  );
}
