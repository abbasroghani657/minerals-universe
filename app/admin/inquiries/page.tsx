'use client';

import { useState, useEffect } from 'react';
import { MailOpen, Mail, Trash2, CheckCheck } from 'lucide-react';

const dummyInquiries = [
  { id: 'INQ-1', name: 'John Doe', email: 'john@example.com', type: 'Custom Order', subject: 'Looking for a 3ct Ruby', createdAt: '2026-10-25T12:00:00Z', status: 'Unread' },
  { id: 'INQ-2', name: 'Ali Raza', email: 'ali@example.com', type: 'General', subject: 'Shipping to UAE?', createdAt: '2026-10-24T12:00:00Z', status: 'Read' },
  { id: 'INQ-3', name: 'Sarah W.', email: 'sarah@example.com', type: 'Custom Order', subject: 'Engagement Ring Stone', createdAt: '2026-10-20T12:00:00Z', status: 'Replied' },
];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInquiries() {
      try {
        const res = await fetch('/api/inquiries');
        const data = await res.json();
        if (data.success && data.inquiries && data.inquiries.length > 0) {
          setInquiries(data.inquiries);
        } else {
          setInquiries(dummyInquiries);
        }
      } catch (err) {
        console.error('Failed to load inquiries:', err);
        setInquiries(dummyInquiries);
      } finally {
        setLoading(false);
      }
    }
    loadInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      }
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Inquiries...</div>;
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>Inquiries & Custom Orders</h2>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '13px' }}>
              <th style={{ padding: '12px 0', width: '40px' }}></th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Subject</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq, i) => (
              <tr key={inq.id} style={{ borderBottom: i !== inquiries.length - 1 ? '1px solid #f5f5f5' : 'none', background: inq.status === 'Unread' ? '#fdfcf8' : 'transparent' }}>
                <td style={{ padding: '16px 0', color: inq.status === 'Unread' ? '#c5a059' : '#ccc' }}>
                  {inq.status === 'Unread' ? <Mail size={18} /> : <MailOpen size={18} />}
                </td>
                <td style={{ padding: '16px 0' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', fontWeight: inq.status === 'Unread' ? 600 : 400 }}>{inq.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{inq.email}</p>
                </td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', background: inq.type === 'Custom Order' ? '#e8f3f0' : '#f5f5f5', color: inq.type === 'Custom Order' ? '#1a5c4a' : '#666' }}>
                    {inq.type}
                  </span>
                </td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#333', fontWeight: inq.status === 'Unread' ? 600 : 400 }}>{inq.subject}</td>
                <td style={{ padding: '16px 0', fontSize: '13px', color: '#888' }}>{formatDate(inq.createdAt)}</td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  {inq.status === 'Unread' && (
                    <button 
                      onClick={() => handleUpdateStatus(inq.id, 'Read')} 
                      style={{ background: '#f5faf9', border: '1px solid #1a5c4a', color: '#1a5c4a', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginRight: '8px', fontWeight: 500 }}
                      title="Mark as Read"
                    >
                      Read
                    </button>
                  )}
                  {inq.status !== 'Replied' && (
                    <button 
                      onClick={() => handleUpdateStatus(inq.id, 'Replied')} 
                      style={{ background: '#1a5c4a', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontSize: '13px', marginRight: '8px' }}
                    >
                      Reply
                    </button>
                  )}
                  {inq.status === 'Replied' && (
                    <span style={{ color: '#155724', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '12px' }}>
                      <CheckCheck size={14} /> Replied
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
