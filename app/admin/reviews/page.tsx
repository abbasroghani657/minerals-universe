'use client';

import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminReviews() {
  const reviews = [
    { id: 1, author: 'Sarah K.', product: 'Aquamarine Emerald Cut', rating: 5, text: '"The aquamarine I received was absolutely stunning..."', status: 'Pending', date: 'Oct 25, 2026' },
    { id: 2, author: 'Marco B.', product: 'Tourmaline Cushion Cut', rating: 5, text: '"Ordered a custom tourmaline for my wife\'s ring..."', status: 'Approved', date: 'Oct 22, 2026' },
    { id: 3, author: 'SpamBot', product: 'Pyrope Garnet', rating: 1, text: '"Buy cheap watches here at this link..."', status: 'Rejected', date: 'Oct 20, 2026' },
  ];

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
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>{r.date}</div>
                </td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#1a5c4a' }}>{r.product}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#c5a059' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                <td style={{ padding: '16px 0', fontSize: '13px', color: '#555', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.text}</td>
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
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#155724', marginRight: '8px' }} title="Approve"><CheckCircle size={18} /></button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438', marginRight: '8px' }} title="Reject"><XCircle size={18} /></button>
                    </>
                  )}
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
