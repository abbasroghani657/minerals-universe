'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MailOpen, 
  Mail, 
  Trash2, 
  CheckCheck, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  Phone, 
  Search, 
  X, 
  Check, 
  AlertCircle, 
  Eye, 
  RefreshCw, 
  Sparkles,
  Clock,
  User,
  DollarSign,
  Gem,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  type: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Replied' | string;
  stoneType?: string | null;
  caratWeight?: string | null;
  preferredColor?: string | null;
  maxBudget?: string | null;
  intendedUse?: string | null;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Unread' | 'Custom Order' | 'Replied'>('all');

  // Modals state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyModalInq, setReplyModalInq] = useState<Inquiry | null>(null);
  const [deleteModalInq, setDeleteModalInq] = useState<Inquiry | null>(null);

  // Reply form state
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Status feedback toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const loadInquiries = async () => {
    try {
      setLoading(true);
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
      showToast('Failed to load inquiries. Please check your network connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status } : null);
        }
        showToast(`Inquiry marked as ${status}`);
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err: any) {
      console.error('Failed to update inquiry status:', err);
      showToast('Error updating status', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        if (replyModalInq?.id === id) setReplyModalInq(null);
        setDeleteModalInq(null);
        showToast('Inquiry deleted successfully');
      } else {
        showToast(data.error || 'Failed to delete inquiry', 'error');
      }
    } catch (err: any) {
      console.error('Failed to delete inquiry:', err);
      showToast('Error deleting inquiry', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenReplyModal = (inq: Inquiry) => {
    setReplyModalInq(inq);
    setReplySubject(inq.subject ? `Re: ${inq.subject}` : 'Regarding your inquiry with Minerals Universe');
    setReplyText(`Dear ${inq.name || 'Valued Customer'},\n\nThank you for contacting Minerals Universe. We are pleased to assist you regarding "${inq.subject}".\n\n`);
  };

  const applyTemplate = (type: 'stock' | 'custom' | 'specs' | 'meeting') => {
    if (!replyModalInq) return;
    const name = replyModalInq.name || 'Customer';
    const sub = replyModalInq.subject || 'your request';

    switch (type) {
      case 'stock':
        setReplyText(
          `Dear ${name},\n\nThank you for reaching out to Minerals Universe.\n\nWe are pleased to confirm that the items regarding "${sub}" are in stock, 100% natural, and certified. We can prepare your selection for immediate secure dispatch with insured courier tracking.\n\nPlease let us know if you would like high-definition video inspections or if you have any questions before confirming your order.\n\nBest regards,\nMinerals Universe Team`
        );
        break;
      case 'custom':
        setReplyText(
          `Dear ${name},\n\nThank you for your bespoke gemstone sourcing inquiry regarding "${sub}".\n\nOur gemology specialists in Namak Mandi, Peshawar are currently sourcing matching natural lots from our verified mining partners to meet your exact specifications (Color: ${replyModalInq.preferredColor || 'As requested'}, Target Carat: ${replyModalInq.caratWeight || 'Natural'}).\n\nWe will share certified options along with exact wholesale quote breakdowns within 24 hours.\n\nWarm regards,\nMinerals Universe Team`
        );
        break;
      case 'specs':
        setReplyText(
          `Dear ${name},\n\nThank you for getting in touch with Minerals Universe.\n\nTo ensure we provide you with the most accurate pricing and gemstone selection, could you please confirm your preferred dimensions, cut style, and certification preference (e.g. GIA, GRS, or Peshawar Gem Lab)?\n\nWe look forward to curating the finest natural gemstones for you.\n\nBest regards,\nMinerals Universe Team`
        );
        break;
      case 'meeting':
        setReplyText(
          `Dear ${name},\n\nThank you for contacting Minerals Universe.\n\nWe would be honored to arrange an in-person viewing of our gemstone collection at our showroom (Office # F23, 2nd Floor, Asghar Gemstones Market, Namak Mandi, Peshawar) or schedule a private WhatsApp video inspection at your convenience.\n\nPlease let us know what time works best for you.\n\nBest regards,\nZaheer Abbas | Minerals Universe`
        );
        break;
    }
  };

  const handleSendEmailReply = async () => {
    if (!replyModalInq) return;
    if (!replyText.trim()) {
      showToast('Please type a reply message before sending.', 'error');
      return;
    }

    try {
      setSendingReply(true);
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: replyModalInq.id,
          action: 'reply',
          replyMessage: replyText.trim(),
          subject: replySubject.trim(),
          toEmail: replyModalInq.email,
          customerName: replyModalInq.name,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(prev => prev.map(inq => inq.id === replyModalInq.id ? { ...inq, status: 'Replied' } : inq));
        if (selectedInquiry?.id === replyModalInq.id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: 'Replied' } : null);
        }
        showToast(`Reply sent successfully to ${replyModalInq.email}!`);
        setReplyModalInq(null);
      } else {
        showToast(data.error || 'Failed to send reply email', 'error');
      }
    } catch (err: any) {
      console.error('Error sending reply:', err);
      showToast('Failed to send reply email: ' + (err.message || 'Network error'), 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const cleanPhoneNumber = (rawPhone?: string | null): string => {
    if (!rawPhone) return '';
    let digits = rawPhone.replace(/[^0-9]/g, '');
    if (digits.startsWith('00')) {
      digits = digits.substring(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = '92' + digits.substring(1);
    } else if (digits.length === 10 && digits.startsWith('3')) {
      digits = '92' + digits;
    }
    return digits;
  };

  const getWhatsAppLink = (inq: Inquiry) => {
    const cleaned = cleanPhoneNumber(inq.phone);
    if (!cleaned) return null;
    const greeting = encodeURIComponent(
      `Hello ${inq.name || 'there'},\n\nThank you for reaching out to Minerals Universe regarding "${inq.subject || 'your inquiry'}".\n\nHow can our gemstone specialists assist you today?`
    );
    return `https://wa.me/${cleaned}?text=${greeting}`;
  };

  const getMailtoLink = (inq: Inquiry) => {
    if (!inq.email) return '#';
    const sub = encodeURIComponent(inq.subject ? `Re: ${inq.subject}` : 'Regarding your inquiry with Minerals Universe');
    const body = encodeURIComponent(
      `Dear ${inq.name || 'Customer'},\n\nThank you for contacting Minerals Universe.\n\n---\nOriginal Inquiry:\n"${inq.message}"\n`
    );
    return `mailto:${inq.email}?subject=${sub}&body=${body}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (inq.name && inq.name.toLowerCase().includes(q)) ||
        (inq.email && inq.email.toLowerCase().includes(q)) ||
        (inq.phone && inq.phone.toLowerCase().includes(q)) ||
        (inq.subject && inq.subject.toLowerCase().includes(q)) ||
        (inq.message && inq.message.toLowerCase().includes(q)) ||
        (inq.stoneType && inq.stoneType.toLowerCase().includes(q))
      );

      // Tab filter
      let matchesTab = true;
      if (activeFilter === 'Unread') {
        matchesTab = inq.status === 'Unread';
      } else if (activeFilter === 'Custom Order') {
        matchesTab = inq.type === 'Custom Order';
      } else if (activeFilter === 'Replied') {
        matchesTab = inq.status === 'Replied';
      }

      return matchesSearch && matchesTab;
    });
  }, [inquiries, searchQuery, activeFilter]);

  const unreadCount = inquiries.filter(i => i.status === 'Unread').length;
  const customOrdersCount = inquiries.filter(i => i.type === 'Custom Order').length;
  const repliedCount = inquiries.filter(i => i.status === 'Replied').length;

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Toast alert banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#991b1b' : '#065f46',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 500,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, marginLeft: '8px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '28px', color: '#1a332d', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Inquiries &amp; Customer Quotes
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#666' }}>
            Respond to customer messages directly via 1-click WhatsApp, verified email dispatch, or phone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={loadInquiries}
            disabled={loading}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#fff', 
              border: '1px solid #dcdad5', 
              padding: '8px 14px', 
              borderRadius: '6px', 
              fontSize: '13px', 
              color: '#444', 
              cursor: 'pointer',
              fontWeight: 500,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <Link 
            href="/#contact" 
            target="_blank" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#0f5c53', 
              color: '#fff', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontSize: '13px', 
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(15,92,83,0.2)'
            }}
          >
            <ExternalLink size={14} />
            View Storefront Contact Form
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div 
          onClick={() => setActiveFilter('all')}
          style={{ 
            background: '#fff', 
            borderRadius: '10px', 
            border: activeFilter === 'all' ? '2px solid #0f5c53' : '1px solid #e8e6e1', 
            padding: '18px 20px', 
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12.5px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Inquiries</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#eef3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f5c53' }}>
              <Mail size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1a332d' }}>{inquiries.length}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('Unread')}
          style={{ 
            background: '#fff', 
            borderRadius: '10px', 
            border: activeFilter === 'Unread' ? '2px solid #c94438' : '1px solid #e8e6e1', 
            padding: '18px 20px', 
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12.5px', color: '#c94438', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Needs Attention (Unread)</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c94438' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: unreadCount > 0 ? '#c94438' : '#1a332d' }}>
            {unreadCount}
          </div>
        </div>

        <div 
          onClick={() => setActiveFilter('Custom Order')}
          style={{ 
            background: '#fff', 
            borderRadius: '10px', 
            border: activeFilter === 'Custom Order' ? '2px solid #c5a059' : '1px solid #e8e6e1', 
            padding: '18px 20px', 
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12.5px', color: '#8a6d2b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Gemstone Requests</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#faf5ea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059' }}>
              <Gem size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#8a6d2b' }}>{customOrdersCount}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('Replied')}
          style={{ 
            background: '#fff', 
            borderRadius: '10px', 
            border: activeFilter === 'Replied' ? '2px solid #15803d' : '1px solid #e8e6e1', 
            padding: '18px 20px', 
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12.5px', color: '#15803d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Replied &amp; Solved</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
              <CheckCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#15803d' }}>{repliedCount}</div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        
        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Search bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search by customer, email, phone, or stone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #dcdad5',
                fontSize: '13.5px',
                outline: 'none',
                background: '#faf9f7'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['all', 'Unread', 'Custom Order', 'Replied'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeFilter === f ? '#0f5c53' : '#f2f0eb',
                  color: activeFilter === f ? '#fff' : '#555',
                  transition: 'all 0.15s ease'
                }}
              >
                {f === 'all' ? 'All Messages' : f}
              </button>
            ))}
          </div>

        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#0f5c53', fontWeight: 600 }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
            Loading Inquiries &amp; Customer Requests...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#faf9f7', borderRadius: '8px', border: '1px dashed #dedbd4' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eef3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#0f5c53' }}>
              <Mail size={26} />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#222', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              {searchQuery ? 'No Inquiries Match Your Search' : 'No Customer Inquiries in this Category'}
            </h4>
            <p style={{ margin: '0 auto 20px', fontSize: '13.5px', color: '#777', maxWidth: '420px', lineHeight: 1.5 }}>
              {searchQuery 
                ? 'Try searching with a different term, customer name, or clear the search field.' 
                : 'Customer inquiries submitted through your website contact forms and custom order requests will appear here.'}
            </p>
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: '#0f5c53', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                Clear Search Filter
              </button>
            ) : (
              <Link 
                href="/#contact" 
                target="_blank" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0f5c53', color: '#fff', padding: '9px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
              >
                Test Contact Form
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '12px' }}>
                  <th style={{ padding: '12px 10px', width: '36px' }}></th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Subject &amp; Message</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600, textAlign: 'right' }}>Actions &amp; Direct Reply</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, i) => {
                  const isUnread = inq.status === 'Unread';
                  const isReplied = inq.status === 'Replied';
                  const whatsappLink = getWhatsAppLink(inq);
                  const mailtoLink = getMailtoLink(inq);

                  return (
                    <tr 
                      key={inq.id || i} 
                      style={{ 
                        borderBottom: i !== filteredInquiries.length - 1 ? '1px solid #f0eeea' : 'none', 
                        background: isUnread ? '#fefdfa' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* Status Icon */}
                      <td style={{ padding: '14px 10px', verticalAlign: 'top', color: isUnread ? '#c5a059' : isReplied ? '#15803d' : '#aaa' }}>
                        {isUnread ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Mail size={19} />
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '7px', height: '7px', borderRadius: '50%', background: '#c94438' }}></span>
                          </div>
                        ) : isReplied ? (
                          <CheckCheck size={19} color="#15803d" />
                        ) : (
                          <MailOpen size={19} />
                        )}
                      </td>

                      {/* Customer Details */}
                      <td style={{ padding: '14px 10px', verticalAlign: 'top', minWidth: '170px' }}>
                        <p style={{ margin: 0, fontSize: '13.5px', color: '#222', fontWeight: isUnread ? 700 : 600 }}>
                          {inq.name || 'Anonymous Visitor'}
                        </p>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#666' }}>
                          <a href={mailtoLink} style={{ color: '#0f5c53', textDecoration: 'none' }} title="Send direct email">
                            {inq.email}
                          </a>
                        </p>
                        {inq.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>
                              {inq.phone}
                            </span>
                            {whatsappLink && (
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat with customer on WhatsApp"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  background: '#25D366',
                                  color: '#fff',
                                  borderRadius: '4px',
                                  padding: '2px 5px',
                                  fontSize: '10.5px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                }}
                              >
                                WhatsApp
                              </a>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Inquiry Type */}
                      <td style={{ padding: '14px 10px', verticalAlign: 'top', minWidth: '120px' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.4px',
                          background: inq.type === 'Custom Order' ? '#eef7f4' : '#f3f4f6', 
                          color: inq.type === 'Custom Order' ? '#0f5c53' : '#555',
                          border: inq.type === 'Custom Order' ? '1px solid #b7dfd5' : '1px solid #e5e7eb'
                        }}>
                          {inq.type}
                        </span>
                        {inq.stoneType && (
                          <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#8a6d2b', fontWeight: 600 }}>
                            💎 {inq.stoneType}
                          </p>
                        )}
                      </td>

                      {/* Subject & Details */}
                      <td style={{ padding: '14px 10px', verticalAlign: 'top', maxWidth: '340px' }}>
                        <div 
                          onClick={() => setSelectedInquiry(inq)}
                          style={{ cursor: 'pointer' }}
                        >
                          <p style={{ margin: '0 0 4px', fontSize: '13.5px', color: '#222', fontWeight: isUnread ? 700 : 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{inq.subject || 'Customer Message'}</span>
                          </p>
                          <p style={{ margin: 0, fontSize: '12.5px', color: '#666', lineHeight: 1.45, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {inq.message}
                          </p>
                        </div>

                        {/* Custom order specific chips */}
                        {inq.type === 'Custom Order' && (inq.maxBudget || inq.caratWeight || inq.preferredColor) && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {inq.caratWeight && (
                              <span style={{ fontSize: '11px', background: '#faf9f7', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px', color: '#666' }}>
                                Weight: <strong>{inq.caratWeight}</strong>
                              </span>
                            )}
                            {inq.preferredColor && (
                              <span style={{ fontSize: '11px', background: '#faf9f7', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px', color: '#666' }}>
                                Color: <strong>{inq.preferredColor}</strong>
                              </span>
                            )}
                            {inq.maxBudget && (
                              <span style={{ fontSize: '11px', background: '#f0faf9', border: '1px solid #b7dfd5', padding: '2px 6px', borderRadius: '4px', color: '#0f5c53' }}>
                                Budget: <strong>${inq.maxBudget}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td style={{ padding: '14px 10px', verticalAlign: 'top', fontSize: '12px', color: '#777', whiteSpace: 'nowrap' }}>
                        {formatDate(inq.createdAt)}
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 600, 
                            color: isReplied ? '#15803d' : isUnread ? '#c94438' : '#777' 
                          }}>
                            {inq.status}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '14px 10px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>

                          {/* 1-Click WhatsApp Button */}
                          {whatsappLink ? (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp with customer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#25D366',
                                color: '#fff',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                            >
                              <MessageSquare size={13} />
                              WhatsApp
                            </a>
                          ) : (
                            <button
                              disabled
                              title="No phone number provided by customer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#f5f5f5',
                                color: '#bbb',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                border: '1px solid #e0e0e0',
                                cursor: 'not-allowed'
                              }}
                            >
                              No Phone
                            </button>
                          )}

                          {/* Compose Email Reply Button */}
                          <button
                            onClick={() => handleOpenReplyModal(inq)}
                            title="Compose and send reply email"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#0f5c53',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0 1px 3px rgba(15,92,83,0.2)'
                            }}
                          >
                            <Send size={12} />
                            Reply
                          </button>

                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            title="View full customer & inquiry details"
                            style={{
                              background: '#fff',
                              border: '1px solid #dcdad5',
                              color: '#555',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Mark Read/Replied toggles */}
                          {isUnread && (
                            <button
                              onClick={() => handleUpdateStatus(inq.id, 'Read')}
                              title="Mark as Read"
                              style={{
                                background: '#fbf8f2',
                                border: '1px solid #dfd4be',
                                color: '#8a6d2b',
                                padding: '6px 9px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11.5px',
                                fontWeight: 600
                              }}
                            >
                              Read
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteModalInq(inq)}
                            title="Delete Inquiry"
                            style={{
                              background: '#fff',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. COMPOSE REPLY MODAL (Direct Email / Template Dispatch) */}
      {/* ========================================================= */}
      {replyModalInq && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#1a332d', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                  Reply to {replyModalInq.name}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#666' }}>
                  Send an official branded email response or connect via WhatsApp
                </p>
              </div>
              <button 
                onClick={() => setReplyModalInq(null)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>

              {/* Customer summary pill */}
              <div style={{ background: '#f8f7f4', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#222' }}>
                    To: {replyModalInq.email}
                  </div>
                  {replyModalInq.phone && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      Phone / WhatsApp: {replyModalInq.phone}
                    </div>
                  )}
                </div>

                {replyModalInq.phone && (
                  <a 
                    href={getWhatsAppLink(replyModalInq) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#25D366',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <MessageSquare size={13} />
                    Open WhatsApp Chat
                  </a>
                )}
              </div>

              {/* Original message reference box */}
              <div style={{ marginBottom: '20px', background: '#faf9f7', borderLeft: '4px solid #0f5c53', padding: '12px 16px', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '11.5px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>
                  Original Message ({replyModalInq.subject || 'Inquiry'})
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{replyModalInq.message}"
                </p>
              </div>

              {/* Quick Template Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                  ⚡ Quick Response Templates:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('stock')}
                    style={{ background: '#eef7f4', border: '1px solid #b7dfd5', color: '#0f5c53', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    📦 In-Stock &amp; Pricing
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('custom')}
                    style={{ background: '#faf5ea', border: '1px solid #dfd4be', color: '#8a6d2b', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    💎 Custom Sourcing Quote
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('specs')}
                    style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#374151', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    📋 Request Specifications
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('meeting')}
                    style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#374151', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    🤝 Namak Mandi Viewing
                  </button>
                </div>
              </div>

              {/* Email Subject Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Email Subject:
                </label>
                <input 
                  type="text"
                  value={replySubject}
                  onChange={e => setReplySubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #dcdad5',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Email Body Textarea */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Your Message to Customer:
                </label>
                <textarea
                  rows={8}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the customer..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #dcdad5',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e6e1', background: '#faf9f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <a
                href={getMailtoLink(replyModalInq)}
                style={{
                  fontSize: '12.5px',
                  color: '#0f5c53',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}
              >
                <ExternalLink size={13} />
                Open in your Mail Client / Gmail
              </a>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setReplyModalInq(null)}
                  style={{
                    padding: '9px 16px',
                    background: '#fff',
                    border: '1px solid #dcdad5',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#555',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={sendingReply}
                  onClick={handleSendEmailReply}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    background: '#0f5c53',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: sendingReply ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(15,92,83,0.25)',
                    opacity: sendingReply ? 0.7 : 1
                  }}
                >
                  <Send size={14} className={sendingReply ? 'animate-spin' : ''} />
                  {sendingReply ? 'Dispatching Email...' : 'Send Official Email & Mark Replied'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FULL INQUIRY DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedInquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ 
                  display: 'inline-block',
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  background: selectedInquiry.type === 'Custom Order' ? '#eef7f4' : '#f3f4f6', 
                  color: selectedInquiry.type === 'Custom Order' ? '#0f5c53' : '#555',
                  marginBottom: '6px'
                }}>
                  {selectedInquiry.type}
                </span>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#1a332d', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                  {selectedInquiry.subject}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              
              {/* Customer info card */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', background: '#faf9f7', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Customer</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginTop: '2px' }}>{selectedInquiry.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                  <div style={{ fontSize: '13.5px', color: '#0f5c53', marginTop: '2px' }}>{selectedInquiry.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Phone / WhatsApp</div>
                  <div style={{ fontSize: '13.5px', color: '#222', marginTop: '2px' }}>{selectedInquiry.phone || 'Not provided'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Submitted Date</div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>{formatDate(selectedInquiry.createdAt)}</div>
                </div>
              </div>

              {/* Custom Order Attributes (if applicable) */}
              {selectedInquiry.type === 'Custom Order' && (
                <div style={{ marginBottom: '20px', border: '1px solid #b7dfd5', background: '#f0faf9', borderRadius: '8px', padding: '16px' }}>
                  <h5 style={{ margin: '0 0 12px', fontSize: '14px', color: '#0f5c53', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Gem size={16} /> Bespoke Sourcing Specifications:
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '13px' }}>
                    {selectedInquiry.stoneType && (
                      <div>
                        <span style={{ color: '#666' }}>Stone:</span> <strong>{selectedInquiry.stoneType}</strong>
                      </div>
                    )}
                    {selectedInquiry.caratWeight && (
                      <div>
                        <span style={{ color: '#666' }}>Carat Weight:</span> <strong>{selectedInquiry.caratWeight}</strong>
                      </div>
                    )}
                    {selectedInquiry.preferredColor && (
                      <div>
                        <span style={{ color: '#666' }}>Color / Clarity:</span> <strong>{selectedInquiry.preferredColor}</strong>
                      </div>
                    )}
                    {selectedInquiry.maxBudget && (
                      <div>
                        <span style={{ color: '#666' }}>Target Budget:</span> <strong>${selectedInquiry.maxBudget}</strong>
                      </div>
                    )}
                    {selectedInquiry.intendedUse && (
                      <div>
                        <span style={{ color: '#666' }}>Intended Use:</span> <strong>{selectedInquiry.intendedUse}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Message */}
              <div style={{ marginBottom: '24px' }}>
                <h5 style={{ margin: '0 0 8px', fontSize: '13px', color: '#555', fontWeight: 600, textTransform: 'uppercase' }}>
                  Full Message from Customer:
                </h5>
                <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: '8px', padding: '16px', fontSize: '14px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Update Options */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Update Status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'Unread')}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: selectedInquiry.status === 'Unread' ? '#fdf2f2' : '#f5f5f5',
                    color: selectedInquiry.status === 'Unread' ? '#c94438' : '#555',
                    border: selectedInquiry.status === 'Unread' ? '1px solid #fca5a5' : '1px solid #e0e0e0',
                    fontWeight: 600
                  }}
                >
                  Unread
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'Read')}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: selectedInquiry.status === 'Read' ? '#faf5ea' : '#f5f5f5',
                    color: selectedInquiry.status === 'Read' ? '#8a6d2b' : '#555',
                    border: selectedInquiry.status === 'Read' ? '1px solid #dfd4be' : '1px solid #e0e0e0',
                    fontWeight: 600
                  }}
                >
                  Read
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'Replied')}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: selectedInquiry.status === 'Replied' ? '#eef7f4' : '#f5f5f5',
                    color: selectedInquiry.status === 'Replied' ? '#0f5c53' : '#555',
                    border: selectedInquiry.status === 'Replied' ? '1px solid #b7dfd5' : '1px solid #e0e0e0',
                    fontWeight: 600
                  }}
                >
                  Replied
                </button>
              </div>

            </div>

            {/* Footer with action buttons */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e6e1', background: '#faf9f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  const toDelete = selectedInquiry;
                  setSelectedInquiry(null);
                  setDeleteModalInq(toDelete);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={14} />
                Delete Inquiry
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {getWhatsAppLink(selectedInquiry) && (
                  <a
                    href={getWhatsAppLink(selectedInquiry)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#25D366',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <MessageSquare size={14} />
                    WhatsApp
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const toReply = selectedInquiry;
                    setSelectedInquiry(null);
                    handleOpenReplyModal(toReply);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    background: '#0f5c53',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Send size={13} />
                  Reply via Email
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {deleteModalInq && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Trash2 size={22} />
            </div>

            <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1a332d', fontWeight: 700 }}>
              Delete Customer Inquiry?
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#666', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete the inquiry from <strong>{deleteModalInq.name}</strong> ({deleteModalInq.email})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteModalInq(null)}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  border: '1px solid #dcdad5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#555',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingId === deleteModalInq.id}
                onClick={() => handleDeleteInquiry(deleteModalInq.id)}
                style={{
                  padding: '8px 18px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: deletingId === deleteModalInq.id ? 'not-allowed' : 'pointer'
                }}
              >
                {deletingId === deleteModalInq.id ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
