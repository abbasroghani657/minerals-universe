'use client';

import { MailOpen, Mail, Trash2 } from 'lucide-react';

export default function AdminInquiries() {
  const inquiries = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Custom Order', subject: 'Looking for a 3ct Ruby', date: 'Oct 25', status: 'Unread' },
    { id: 2, name: 'Ali Raza', email: 'ali@example.com', type: 'General', subject: 'Shipping to UAE?', date: 'Oct 24', status: 'Read' },
    { id: 3, name: 'Sarah W.', email: 'sarah@example.com', type: 'Custom Order', subject: 'Engagement Ring Stone', date: 'Oct 20', status: 'Replied' },
  ];

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
                <td style={{ padding: '16px 0', fontSize: '13px', color: '#888' }}>{inq.date}</td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button style={{ background: '#1a5c4a', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontSize: '13px', marginRight: '8px' }}>Reply</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
