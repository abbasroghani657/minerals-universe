'use client';

import { useState, useEffect } from 'react';
import { Save, Settings, Building, CreditCard, ShieldCheck } from 'lucide-react';
import { FaTiktok, FaEbay, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    ebayUrl: '',
    whatsappNumber: '',
    // Pakistani Bank & Payment Details
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    raastId: '',
    easyPaisaNumber: '',
    jazzCashNumber: '',
    paymentInstructions: '',
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
          setSettings({
            instagramUrl: data.settings.instagramUrl || '',
            tiktokUrl: data.settings.tiktokUrl || '',
            youtubeUrl: data.settings.youtubeUrl || '',
            ebayUrl: data.settings.ebayUrl || '',
            whatsappNumber: data.settings.whatsappNumber || '',
            bankName: data.settings.bankName || 'Meezan Bank Limited',
            accountTitle: data.settings.accountTitle || 'Minerals Universe / Zaheer Abbas',
            accountNumber: data.settings.accountNumber || '',
            iban: data.settings.iban || '',
            raastId: data.settings.raastId || '',
            easyPaisaNumber: data.settings.easyPaisaNumber || '',
            jazzCashNumber: data.settings.jazzCashNumber || '',
            paymentInstructions: data.settings.paymentInstructions || 'Please transfer the exact converted PKR total to our account and send the screenshot/receipt on WhatsApp with your Order ID for instant dispatch.',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({
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
      const keys = Object.keys(settings) as Array<keyof typeof settings>;
      for (const key of keys) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: settings[key] }),
        });
      }
      setMessage('✓ Settings & Bank Details saved successfully!');
      setTimeout(() => setMessage(null), 3500);
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

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', maxWidth: '850px' }}>
        {message && (
          <div style={{ background: message.startsWith('✓') ? '#d4edda' : '#fdf2f2', color: message.startsWith('✓') ? '#155724' : '#c94438', padding: '16px', borderRadius: '6px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px' }}>
          
          {/* SECTION 1: Pakistani Bank & Payment Methods */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} /> Pakistani Admin Bank & Direct Payment Accounts
            </h3>
            <p style={{ fontSize: '13px', color: '#777', margin: '0 0 18px' }}>
              These account details will be shown to customers on checkout when they select <strong>Direct Bank Transfer / Raast / EasyPaisa</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Bank Name</label>
                <input name="bankName" type="text" value={settings.bankName} onChange={handleChange} style={inputStyle} placeholder="e.g. Meezan Bank / HBL / Bank Alfalah" />
              </div>
              <div>
                <label style={labelStyle}>Account Title (Beneficiary Name)</label>
                <input name="accountTitle" type="text" value={settings.accountTitle} onChange={handleChange} style={inputStyle} placeholder="e.g. Zaheer Abbas / Minerals Universe" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Account Number</label>
                <input name="accountNumber" type="text" value={settings.accountNumber} onChange={handleChange} style={inputStyle} placeholder="e.g. 01020304050607" />
              </div>
              <div>
                <label style={labelStyle}>IBAN (International Bank Account No.)</label>
                <input name="iban" type="text" value={settings.iban} onChange={handleChange} style={inputStyle} placeholder="e.g. PK36MEZN0001020304050607" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}><ShieldCheck size={16} color="#1a5c4a" /> Raast ID</label>
                <input name="raastId" type="text" value={settings.raastId} onChange={handleChange} style={inputStyle} placeholder="e.g. 03001234567" />
              </div>
              <div>
                <label style={labelStyle}>EasyPaisa Account</label>
                <input name="easyPaisaNumber" type="text" value={settings.easyPaisaNumber} onChange={handleChange} style={inputStyle} placeholder="e.g. 03001234567" />
              </div>
              <div>
                <label style={labelStyle}>JazzCash Account</label>
                <input name="jazzCashNumber" type="text" value={settings.jazzCashNumber} onChange={handleChange} style={inputStyle} placeholder="e.g. 03001234567" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Payment Instructions for Customers</label>
              <textarea name="paymentInstructions" rows={3} value={settings.paymentInstructions} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Instructions on how customer should transfer and share receipt..." />
            </div>
          </div>

          {/* SECTION 2: Social Networks & Contacts */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> Social Networks & Contacts
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}><FaInstagram size={16} color="#E1306C" /> Instagram Page URL</label>
                <input name="instagramUrl" type="url" value={settings.instagramUrl} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.instagram.com/yourusername" />
              </div>

              <div>
                <label style={labelStyle}><FaTiktok size={16} color="#000000" /> TikTok Profile URL</label>
                <input name="tiktokUrl" type="url" value={settings.tiktokUrl} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.tiktok.com/@yourusername" />
              </div>

              <div>
                <label style={labelStyle}><FaYoutube size={16} color="#FF0000" /> YouTube Channel URL</label>
                <input name="youtubeUrl" type="url" value={settings.youtubeUrl} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.youtube.com/@yourchannel" />
              </div>

              <div>
                <label style={labelStyle}><FaEbay size={18} color="#333333" /> eBay Store URL</label>
                <input name="ebayUrl" type="url" value={settings.ebayUrl} onChange={handleChange} style={inputStyle} placeholder="e.g. https://www.ebay.com/usr/yourstore" />
              </div>

              <div>
                <label style={labelStyle}><FaWhatsapp size={16} color="#25D366" /> WhatsApp Contact Number (With Country Code)</label>
                <input name="whatsappNumber" type="text" value={settings.whatsappNumber} onChange={handleChange} style={inputStyle} placeholder="e.g. 923001581210" />
                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#888' }}>Do not include "+" or spaces (e.g. 923001581210 for Pakistan number).</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                padding: '14px 32px', 
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
              <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}

