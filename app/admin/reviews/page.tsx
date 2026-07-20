'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(rev => rev.id !== id));
      }
    } catch (err) {
      console.error('Error deleting review:', err);
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
                  <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} title="Delete"><Trash2 size={18} /></button>
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
    </div>
  );
}
