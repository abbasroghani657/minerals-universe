'use client';

import { useState, useEffect } from 'react';
import { Save, Check, ExternalLink, Settings } from 'lucide-react';
import { FaTiktok, FaEbay, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function AdminSettings() {
  const [socials, setSocials] = useState({
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    ebayUrl: '',
    whatsappNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSocials({
            instagramUrl: data.settings.instagramUrl || '',
            tiktokUrl: data.settings.tiktokUrl || '',
            youtubeUrl: data.settings.youtubeUrl || '',
            ebayUrl: data.settings.ebayUrl || '',
            whatsappNumber: data.settings.whatsappNumber || '',
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Upsert each setting
      const keys = Object.keys(socials) as Array<keyof typeof socials>;
      for (const key of keys) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: socials[key] }),
        });
      }
      setMessage('✓ Settings saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setMessage('⚠️ Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Settings...</div>;
  }

  const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' };
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>Store Settings</h2>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', maxWidth: '800px' }}>
        <h3 style={{ fontSize: '16px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} /> Social Networks & Contacts
        </h3>

        {message && (
          <div style={{ background: message.startsWith('✓') ? '#d4edda' : '#fdf2f2', color: message.startsWith('✓') ? '#155724' : '#c94438', padding: '16px', borderRadius: '6px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
          
          <div>
            <label style={labelStyle}><FaInstagram size={16} color="#E1306C" /> Instagram Page URL</label>
            <input 
              name="instagramUrl" 
              type="url" 
              value={socials.instagramUrl} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="e.g. https://www.instagram.com/yourusername" 
            />
          </div>

          <div>
            <label style={labelStyle}><FaTiktok size={16} color="#000000" /> TikTok Profile URL</label>
            <input 
              name="tiktokUrl" 
              type="url" 
              value={socials.tiktokUrl} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="e.g. https://www.tiktok.com/@yourusername" 
            />
          </div>

          <div>
            <label style={labelStyle}><FaYoutube size={16} color="#FF0000" /> YouTube Channel URL</label>
            <input 
              name="youtubeUrl" 
              type="url" 
              value={socials.youtubeUrl} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="e.g. https://www.youtube.com/@yourchannel" 
            />
          </div>

          <div>
            <label style={labelStyle}><FaEbay size={18} color="#333333" /> eBay Store URL</label>
            <input 
              name="ebayUrl" 
              type="url" 
              value={socials.ebayUrl} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="e.g. https://www.ebay.com/usr/yourstore" 
            />
          </div>

          <div>
            <label style={labelStyle}><FaWhatsapp size={16} color="#25D366" /> WhatsApp Contact Number (With Country Code)</label>
            <input 
              name="whatsappNumber" 
              type="text" 
              value={socials.whatsappNumber} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="e.g. 923001581210" 
            />
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#888' }}>Do not include "+" or spaces (e.g. 923001581210 for Pakistan number).</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                padding: '12px 28px', 
                background: '#1a5c4a', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: saving ? 0.7 : 1
              }}
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
