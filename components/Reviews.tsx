'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, Upload, X } from 'lucide-react';

const initialReviews = [
  { initial: 'S', name: 'Sarah K.', location: '🇺🇸 United States', rating: 5, text: '"The aquamarine I received was absolutely stunning — the color and clarity exceeded my expectations. Beautifully packaged with the full gemological report."', photo: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=150&q=70' },
  { initial: 'M', name: 'Marco B.', location: '🇩🇪 Germany', rating: 5, text: '"Ordered a custom tourmaline for my wife\'s ring. The team was incredibly helpful and the stone arrived perfectly. Exceptional service throughout."' },
  { initial: 'A', name: 'Aisha R.', location: '🇦🇪 UAE', rating: 5, text: '"Best source for Pakistani sapphires online. Authentic, certified, and priced fairly. The WhatsApp support made the experience very personal."' },
  { initial: 'J', name: 'James T.', location: '🇬🇧 United Kingdom', rating: 4, text: '"Great quality emerald. The shipping took a bit longer than expected to the UK, but the stone itself is flawless."', photo: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=150&q=70' },
  { initial: 'L', name: 'Linda W.', location: '🇨🇦 Canada', rating: 5, text: '"I was nervous buying gems online, but Minerals Universe made it easy. The customer service via WhatsApp was excellent."' }
];

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadApprovedReviews() {
      try {
        const res = await fetch('/api/reviews?status=Approved');
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length > 0) {
          // Format custom reviews to match the display schema
          const formatted = data.reviews.map((r: any) => ({
            initial: r.author.charAt(0).toUpperCase(),
            name: r.author,
            location: '🌍 Verified Buyer',
            rating: r.rating,
            text: r.text.startsWith('"') ? r.text : `"${r.text}"`,
          }));
          setReviews([...formatted, ...initialReviews.filter(ir => !formatted.some((fr: any) => fr.name === ir.name))]);
        }
      } catch (err) {
        console.error('Failed to load approved reviews, using initial placeholders:', err);
      }
    }
    loadApprovedReviews();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg('Please select a star rating.');
      return;
    }
    if (!name || !email || !text) return;

    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: name,
          product: 'General Collection',
          rating,
          text,
        }),
      });

      if (res.ok) {
        alert('Thank you! Your review has been submitted for moderation and will appear once approved.');
        
        // Optimistically add to local state as pending indicator or simple addition
        const newReview = {
          initial: name.charAt(0).toUpperCase(),
          name: `${name} (Pending Approval)`,
          location: '🌍 Verified Buyer',
          rating,
          text: `"${text}"`,
        };
        setReviews(prev => [newReview, ...prev]);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }

    // Reset and close
    setName('');
    setEmail('');
    setRating(0);
    setText('');
    setPhotoBase64(null);
    setErrorMsg('');
    setIsFormOpen(false);
  };

  // Calculate statistics dynamically
  const totalReviews = reviews.length;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1);
  const getPct = (stars: number) => {
    const count = reviews.filter(r => r.rating === stars).length;
    return Math.round((count / totalReviews) * 100) + '%';
  };

  const bars = [
    { label: '5 ★', pct: getPct(5) },
    { label: '4 ★', pct: getPct(4) },
    { label: '3 ★', pct: getPct(3) },
    { label: '2 ★', pct: getPct(2) },
    { label: '1 ★', pct: getPct(1) },
  ];

  return (
    <>
      <section id="reviews" style={{ background: 'var(--bg2)' }}>
        <div className="section-inner">
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Testimonials</p>
            <h2 className="section-title">What Our Customers <span>Say</span></h2>
            <div className="teal-line"></div>
          </div>
          <div className="reviews-inner">
            <div>
              <div className="rating-big">
                <div className="rating-num">{avgRating}</div>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} fill={i < Math.round(Number(avgRating)) ? '#c5a059' : 'transparent'} color="#c5a059" />
                  ))}
                </div>
                <p className="rating-count">Based on {totalReviews} reviews</p>
                {bars.map((bar, i) => (
                  <div key={i} className="bar-row">
                    <span className="bar-label">{bar.label}</span>
                    <div className="bar-bg"><div className="bar-fill" style={{ width: bar.pct }}></div></div>
                    <span style={{ color: 'var(--muted)', fontSize: '12px', width: '32px' }}>{bar.pct}</span>
                  </div>
                ))}
                <button onClick={() => setIsFormOpen(true)} className="btn-outline-teal" style={{ marginTop: '22px', display: 'block', width: '100%', padding: '12px', fontSize: '13px', textAlign: 'center', cursor: 'pointer' }}>
                  Write a Review
                </button>
              </div>
            </div>
            <div>
              <div className="review-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {reviews.slice(0, visibleCount).map((r, i) => (
                  <div key={i} className="review-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="reviewer">
                      <div className="reviewer-avatar">{r.initial}</div>
                      <div className="reviewer-info">
                        <h4>{r.name}</h4>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {r.location}
                          <span style={{ color: '#c5a059', fontSize: '12px', marginLeft: '6px' }}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="review-text" style={{ flexGrow: 1 }}>{r.text}</p>
                    {r.photo && (
                      <div style={{ marginTop: '16px', borderRadius: '6px', overflow: 'hidden' }}>
                        <Image src={r.photo} alt={`Review by ${r.name}`} width={280} height={180} style={{ width: '100%', height: '140px', objectFit: 'cover' }} unoptimized />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {visibleCount < reviews.length && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 4)}
                    style={{ background: 'transparent', color: '#1a5c4a', border: '1px solid #1a5c4a', padding: '10px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1a5c4a'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a5c4a'; }}
                  >
                    See More Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="teal-divider"></div>

      {/* Review Modal */}
      {isFormOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
            <button onClick={() => setIsFormOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={24} /></button>
            <h3 style={{ fontSize: '24px', color: '#1a5c4a', marginBottom: '20px', fontFamily: "'Cormorant Garamond', serif" }}>Write a Review</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#555' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => { setRating(star); setErrorMsg(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Star size={28} fill={star <= rating ? '#c5a059' : 'transparent'} color={star <= rating ? '#c5a059' : '#ccc'} />
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && <div style={{ color: '#c94438', fontSize: '13px', fontWeight: 600 }}>⚠️ {errorMsg}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#555' }}>Name</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={{ width: '100%', padding: '10px', border: '1px solid #e8e6e1', borderRadius: '4px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#555' }}>Email</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #e8e6e1', borderRadius: '4px', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#555' }}>Review</label>
                <textarea required rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Tell us about your gemstone..." style={{ width: '100%', padding: '10px', border: '1px solid #e8e6e1', borderRadius: '4px', outline: 'none', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#555' }}>Attach a Photo (Optional)</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f8f7f5', border: '1px solid #e8e6e1', borderRadius: '4px', cursor: 'pointer', color: '#555' }}>
                  <Upload size={16} /> {photoBase64 ? 'Photo Selected' : 'Upload Photo'}
                </button>
                {photoBase64 && (
                  <div style={{ marginTop: '10px' }}>
                    <Image src={photoBase64} alt="Preview" width={60} height={60} style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} unoptimized />
                  </div>
                )}
              </div>

              <button type="submit" style={{ background: '#1a5c4a', color: '#fff', border: 'none', padding: '14px', borderRadius: '4px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
