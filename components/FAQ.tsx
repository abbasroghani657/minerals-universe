'use client';
import { useState, useEffect } from 'react';

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs');
        const data = await res.json();
        if (data.success && data.faqs) {
          setFaqs(data.faqs);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    }
    loadFaqs();
  }, []);

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

  if (faqs.length === 0) return null;

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
              <div key={faq.id || i} className="faq-item">
                <button className="faq-q" onClick={() => toggle(i)}>
                  {faq.question}
                  <span className={`faq-icon${openIndex === i ? ' open' : ''}`}>+</span>
                </button>
                <div className={`faq-a${openIndex === i ? ' open' : ''}`}>
                  <p>{faq.answer}</p>
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
