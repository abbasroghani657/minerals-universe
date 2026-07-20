'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Check } from 'lucide-react';

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const handleEdit = (faq: any) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
      } else {
        alert(data.error || 'Failed to delete FAQ.');
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
    };

    try {
      if (editingFaq) {
        const res = await fetch('/api/faqs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingFaq.id, ...payload }),
        });
        const data = await res.json();
        if (data.success && data.faq) {
          setFaqs(prev => prev.map(f => f.id === editingFaq.id ? data.faq : f));
        } else {
          alert(data.error || 'Failed to update FAQ.');
        }
      } else {
        const res = await fetch('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.faq) {
          setFaqs(prev => [...prev, data.faq]);
        } else {
          alert(data.error || 'Failed to create FAQ.');
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving FAQ:', err);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading FAQs...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>FAQs Manager</h2>
        <button onClick={handleAddNew} style={{ background: '#1a5c4a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <Plus size={18} /> Add New FAQ
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} 
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '13px' }}>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Question</th>
              <th style={{ padding: '12px 0', fontWeight: 600, width: '60%' }}>Answer</th>
              <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaqs.map((faq, i) => (
              <tr key={faq.id} style={{ borderBottom: i !== filteredFaqs.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#1a5c4a' }}>{faq.question}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{faq.answer}</td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(faq)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a90e2', marginRight: '12px' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(faq.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ Form Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#1a5c4a' }}>
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={24} /></button>
            </div>

            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Question</label>
                  <input name="question" type="text" defaultValue={editingFaq?.question} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. Do you ship internationally?" />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Answer</label>
                  <textarea name="answer" defaultValue={editingFaq?.answer} rows={5} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', resize: 'vertical' }} placeholder="Provide a detailed answer..." />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #e8e6e1', paddingTop: '24px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#555' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '12px 24px', background: '#1a5c4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={18} /> {editingFaq ? 'Save Changes' : 'Create FAQ'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
