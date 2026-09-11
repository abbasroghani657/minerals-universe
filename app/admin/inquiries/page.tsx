'use client';

import { useState, useEffect } from 'react';
import { MailOpen, Mail, Trash2, CheckCheck, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInquiries() {
      try {
        const res = await fetch('/api/inquiries');
        const data = await res.json();
        if (data.success && Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
        } else {
          setInquiries([]);
        }
      } catch (err) {
        console.error('Failed to load inquiries:', err);
        setInquiries([]);
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
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div style={{ padding: '60px 20px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Inquiries...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Inquiries &amp; Custom Orders
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
            Customer quotes, bespoke gemstone requests, and contact inquiries
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        {inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#faf9f7', borderRadius: '8px', border: '1px dashed #dedbd4' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eef3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1a5c4a' }}>
              <Mail size={26} />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#222', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>No Customer Inquiries Yet</h4>
            <p style={{ margin: '0 auto 20px', fontSize: '13.5px', color: '#777', maxWidth: '420px', lineHeight: 1.5 }}>
              When visitors submit questions via your Contact Us form or request custom gemstones via the Bespoke Sourcing form, they will appear here instantly.
            </p>
            <Link 
              href="/#contact" 
              target="_blank" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1a5c4a', color: '#fff', padding: '9px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
            >
              Test Contact Form
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '12px' }}>
                  <th style={{ padding: '12px 8px', width: '36px' }}></th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Subject &amp; Details</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq, i) => (
                  <tr key={inq.id || i} style={{ borderBottom: i !== inquiries.length - 1 ? '1px solid #f5f5f5' : 'none', background: inq.status === 'Unread' ? '#fdfcf8' : 'transparent' }}>
                    <td style={{ padding: '14px 8px', color: inq.status === 'Unread' ? '#c5a059' : '#ccc' }}>
                      {inq.status === 'Unread' ? <Mail size={18} /> : <MailOpen size={18} />}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#333', fontWeight: inq.status === 'Unread' ? 600 : 500 }}>{inq.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#777' }}>{inq.email}</p>
                      {inq.phone && <p style={{ margin: 0, fontSize: '11.5px', color: '#999' }}>{inq.phone}</p>}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        background: inq.type === 'Custom Order' ? '#e8f3f0' : '#f5f5f5', 
                        color: inq.type === 'Custom Order' ? '#1a5c4a' : '#666' 
                      }}>
                        {inq.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '13.5px', color: '#222', fontWeight: inq.status === 'Unread' ? 600 : 500 }}>{inq.subject}</p>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#666', maxWidth: '380px', lineHeight: 1.4 }}>{inq.message}</p>
                    </td>
                    <td style={{ padding: '14px 8px', fontSize: '12.5px', color: '#888' }}>{formatDate(inq.createdAt)}</td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      {inq.status === 'Unread' && (
                        <button 
                          onClick={() => handleUpdateStatus(inq.id, 'Read')} 
                          style={{ background: '#f5faf9', border: '1px solid #1a5c4a', color: '#1a5c4a', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '6px', fontWeight: 600 }}
                          title="Mark as Read"
                        >
                          Read
                        </button>
                      )}
                      {inq.status !== 'Replied' && (
                        <button 
                          onClick={() => handleUpdateStatus(inq.id, 'Replied')} 
                          style={{ background: '#1a5c4a', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontSize: '12px', marginRight: '6px', fontWeight: 600 }}
                        >
                          Mark Replied
                        </button>
                      )}
                      {inq.status === 'Replied' && (
                        <span style={{ color: '#155724', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
                          <CheckCheck size={14} /> Replied
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
