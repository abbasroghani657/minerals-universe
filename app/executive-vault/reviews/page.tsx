'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetReview, setDeleteTargetReview] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(rev => rev.id === id ? { ...rev, status } : rev));
      }
    } catch (err) {
      console.error('Error updating review status:', err);
    }
  };

  const confirmDeleteReview = async () => {
    if (!deleteTargetReview) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reviews?id=${deleteTargetReview.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(rev => rev.id !== deleteTargetReview.id));
        setDeleteTargetReview(null);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Reviews...</div>;
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>Reviews Moderation</h2>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '13px' }}>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Reviewer</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Product</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Rating</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Review Text</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i !== reviews.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  {r.author}
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>{formatDate(r.createdAt)}</div>
                </td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#1a5c4a' }}>{r.product}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#c5a059' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                <td style={{ padding: '16px 0', fontSize: '13px', color: '#555', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.text}>{r.text}</td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: r.status === 'Approved' ? '#d4edda' : r.status === 'Pending' ? '#fff3cd' : '#fdf2f2',
                    color: r.status === 'Approved' ? '#155724' : r.status === 'Pending' ? '#856404' : '#c94438'
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  {r.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(r.id, 'Approved')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#155724', marginRight: '8px' }} title="Approve"><CheckCircle size={18} /></button>
                      <button onClick={() => handleUpdateStatus(r.id, 'Rejected')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438', marginRight: '8px' }} title="Reject"><XCircle size={18} /></button>
                    </>
                  )}
                  {r.status === 'Rejected' && (
                    <button onClick={() => handleUpdateStatus(r.id, 'Approved')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#155724', marginRight: '8px' }} title="Approve"><CheckCircle size={18} /></button>
                  )}
                  {r.status === 'Approved' && (
                    <button onClick={() => handleUpdateStatus(r.id, 'Rejected')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438', marginRight: '8px' }} title="Reject"><XCircle size={18} /></button>
                  )}
                  <button onClick={() => setDeleteTargetReview(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Luxury Delete Confirmation Modal */}
      {deleteTargetReview && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(5, 18, 14, 0.78)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '460px',
            background: 'linear-gradient(180deg, #112d23 0%, #071712 100%)',
            border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px',
            padding: '32px 28px', color: '#fff', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(220, 53, 69, 0.15)', border: '1.5px solid rgba(220, 53, 69, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              color: '#ff6b6b'
            }}>
              <Trash2 size={26} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: '0 0 8px', color: '#fff' }}>
              Delete Customer Review?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete the review from <strong>{deleteTargetReview.author}</strong> on {deleteTargetReview.product}?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeleteTargetReview(null)}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '12px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)',
                  borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteReview}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '12px', background: 'linear-gradient(135deg, #dc3545 0%, #bd2130 100%)',
                  border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px'
                }}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
