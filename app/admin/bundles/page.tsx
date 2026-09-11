'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, Search, Edit, Trash2, X, Upload, Check, Sparkles, 
  Layers, AlertCircle, RefreshCw, Eye, EyeOff, Tag, DollarSign,
  PackageCheck
} from 'lucide-react';

interface Bundle {
  id: number;
  name: string;
  description: string | null;
  badge: string | null;
  originalUSD: number;
  saleUSD: number;
  imgs: string[];
  items: string | null;
  stock: string | null;
  isActive: boolean;
  createdAt?: string;
}

const BADGE_PRESETS = [
  '✦ Save 10%',
  '✦ Save 15%',
  '✦ Save 20%',
  '✦ Save 25%',
  'Rare Specimen Duo',
  'Collector’s Suite',
  'Limited Edition 1 of 1',
  'Himalayan Pair',
  'Museum Grade Set',
];

const STOCK_PRESETS = [
  'Only 1 Set Available',
  'In Stock',
  '2 Sets Left',
  'Limited Quantity',
  'Made to Order',
];

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('✦ Save 10%');
  const [formOriginalUSD, setFormOriginalUSD] = useState<number | ''>('');
  const [formSaleUSD, setFormSaleUSD] = useState<number | ''>('');
  const [formItems, setFormItems] = useState('');
  const [formStock, setFormStock] = useState('Only 1 Set Available');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formImgs, setFormImgs] = useState<string[]>([]);
  const [inputImgUrl, setInputImgUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<Bundle | null>(null);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bundles?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.bundles)) {
        setBundles(data.bundles);
      } else if (Array.isArray(data.bundles)) {
        setBundles(data.bundles);
      }
    } catch (err) {
      console.error('Error fetching bundles:', err);
      showToast('Failed to load bundles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const handleOpenCreate = () => {
    setEditingBundle(null);
    setFormName('');
    setFormDescription('');
    setFormBadge('✦ Save 10%');
    setFormOriginalUSD('');
    setFormSaleUSD('');
    setFormItems('');
    setFormStock('Only 1 Set Available');
    setFormIsActive(true);
    setFormImgs([
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80',
      'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=600&q=80'
    ]);
    setInputImgUrl('');
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setFormName(bundle.name);
    setFormDescription(bundle.description || '');
    setFormBadge(bundle.badge || '✦ Save 10%');
    setFormOriginalUSD(bundle.originalUSD);
    setFormSaleUSD(bundle.saleUSD);
    setFormItems(bundle.items || '');
    setFormStock(bundle.stock || 'In Stock');
    setFormIsActive(bundle.isActive);
    setFormImgs(bundle.imgs && bundle.imgs.length > 0 ? [...bundle.imgs] : []);
    setInputImgUrl('');
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleAddImgUrl = () => {
    if (!inputImgUrl.trim()) return;
    setFormImgs(prev => [...prev, inputImgUrl.trim()]);
    setInputImgUrl('');
  };

  const handleRemoveImg = (index: number) => {
    setFormImgs(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFormImgs(prev => [...prev, data.url]);
        } else {
          setUploadError(data.error || 'Failed to upload image');
        }
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Set title is required', 'error');
      return;
    }
    if (formOriginalUSD === '' || formSaleUSD === '') {
      showToast('Both original and sale prices are required', 'error');
      return;
    }
    if (formImgs.length === 0) {
      showToast('Please add at least one image for the set', 'error');
      return;
    }

    const payload = {
      id: editingBundle ? editingBundle.id : undefined,
      name: formName.trim(),
      description: formDescription.trim(),
      badge: formBadge.trim(),
      originalUSD: Number(formOriginalUSD),
      saleUSD: Number(formSaleUSD),
      imgs: formImgs,
      items: formItems.trim(),
      stock: formStock.trim(),
      isActive: formIsActive,
    };

    try {
      const url = '/api/bundles';
      const method = editingBundle ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingBundle ? 'Complete Set updated successfully!' : 'New Complete Set created successfully!', 'success');
        setIsModalOpen(false);
        fetchBundles();
      } else {
        showToast(data.error || 'Failed to save set', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error saving set', 'error');
    }
  };

  const handleToggleActive = async (bundle: Bundle) => {
    try {
      const res = await fetch('/api/bundles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bundle.id, isActive: !bundle.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setBundles(prev => prev.map(b => b.id === bundle.id ? { ...b, isActive: !bundle.isActive } : b));
        showToast(`Set is now ${!bundle.isActive ? 'Active on Storefront' : 'Hidden as Draft'}`, 'success');
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/bundles?id=${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBundles(prev => prev.filter(b => b.id !== deleteTarget.id));
        showToast('Complete Set deleted successfully', 'success');
      } else {
        showToast(data.error || 'Failed to delete set', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting set', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredBundles = useMemo(() => {
    return bundles.filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.items && b.items.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'active' ? b.isActive :
        !b.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [bundles, searchTerm, statusFilter]);

  const totalSets = bundles.length;
  const activeSets = bundles.filter(b => b.isActive).length;
  const avgSavings = useMemo(() => {
    if (bundles.length === 0) return 0;
    const totalSavingsPct = bundles.reduce((acc, b) => {
      const orig = b.originalUSD || 1;
      const pct = Math.max(0, Math.round(((orig - b.saleUSD) / orig) * 100));
      return acc + pct;
    }, 0);
    return Math.round(totalSavingsPct / bundles.length);
  }, [bundles]);

  const totalCatalogValue = useMemo(() => {
    return bundles.reduce((acc, b) => acc + (b.saleUSD || 0), 0);
  }, [bundles]);

  const formSavings = useMemo(() => {
    const orig = Number(formOriginalUSD);
    const sale = Number(formSaleUSD);
    if (!orig || !sale || orig <= sale) return null;
    const diff = orig - sale;
    const pct = Math.round((diff / orig) * 100);
    return { diff, pct };
  }, [formOriginalUSD, formSaleUSD]);
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          padding: '14px 24px', borderRadius: '8px',
          background: toast.type === 'success' ? '#0f5132' : '#842029',
          color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600
        }}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header & Main Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ background: 'rgba(26,92,74,0.1)', color: '#1a5c4a', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              ✦ Catalog Sets
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', margin: 0, color: '#1a5c4a', fontWeight: 700 }}>
            Complete Sets &amp; Bundles Management
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14.5px' }}>
            Curate, price, and showcase luxury multi-gemstone pairings and mineral suites displayed on the storefront.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{
            background: 'linear-gradient(135deg, #1a5c4a 0%, #114134 100%)',
            color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px',
            cursor: 'pointer', fontWeight: 600, fontSize: '15px',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 14px rgba(26,92,74,0.25)', transition: 'all 0.2s'
          }}
        >
          <Plus size={18} /> Add New Complete Set
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e8e6e1', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', fontSize: '13px', fontWeight: 600 }}>
            <span>TOTAL COMPLETE SETS</span>
            <Layers size={18} color="#1a5c4a" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a5c4a', marginTop: '8px', fontFamily: "'Cormorant Garamond', serif" }}>
            {totalSets}
          </div>
          <div style={{ fontSize: '12.5px', color: '#666', marginTop: '4px' }}>
            Multi-stone pairs &amp; suites in catalog
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e8e6e1', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', fontSize: '13px', fontWeight: 600 }}>
            <span>ACTIVE ON STOREFRONT</span>
            <Eye size={18} color="#0f5132" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#0f5132', marginTop: '8px', fontFamily: "'Cormorant Garamond', serif" }}>
            {activeSets}
          </div>
          <div style={{ fontSize: '12.5px', color: '#666', marginTop: '4px' }}>
            Live on homepage &quot;Complete the Set&quot;
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e8e6e1', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', fontSize: '13px', fontWeight: 600 }}>
            <span>AVG. BUNDLE SAVINGS</span>
            <Tag size={18} color="#c5a059" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#c5a059', marginTop: '8px', fontFamily: "'Cormorant Garamond', serif" }}>
            {avgSavings}%
          </div>
          <div style={{ fontSize: '12.5px', color: '#666', marginTop: '4px' }}>
            Discount incentive for buyers
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e8e6e1', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', fontSize: '13px', fontWeight: 600 }}>
            <span>TOTAL CATALOG VALUE</span>
            <DollarSign size={18} color="#1a5c4a" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a5c4a', marginTop: '8px', fontFamily: "'Cormorant Garamond', serif" }}>
            ${totalCatalogValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12.5px', color: '#666', marginTop: '4px' }}>
            Cumulative set inventory price
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e8e6e1', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="#999" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search sets by title or included specimens..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 42px', borderRadius: '6px',
              border: '1px solid #ddd', fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>Status:</span>
          {(['all', 'active', 'draft'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '7px 14px', borderRadius: '4px', border: '1px solid #ddd',
                background: statusFilter === tab ? '#1a5c4a' : '#fff',
                color: statusFilter === tab ? '#fff' : '#555',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'all' ? 'All Sets' : tab === 'active' ? 'Active Only' : 'Drafts / Hidden'}
            </button>
          ))}
          <button
            onClick={fetchBundles}
            title="Refresh list"
            style={{
              padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd',
              background: '#fff', color: '#555', cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
      {/* Complete Sets Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
          <RefreshCw size={30} className="gem-spin" style={{ margin: '0 auto 12px', display: 'block', color: '#1a5c4a' }} />
          Loading complete sets from database...
        </div>
      ) : filteredBundles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px', border: '1px dashed #ccc' }}>
          <PackageCheck size={40} color="#c5a059" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: '18px', margin: '0 0 6px', color: '#333' }}>No Complete Sets Found</h3>
          <p style={{ color: '#777', fontSize: '14px', margin: '0 0 16px' }}>
            {searchTerm ? 'No sets match your search query.' : 'You haven’t added any complete sets yet.'}
          </p>
          <button
            onClick={handleOpenCreate}
            style={{
              background: '#1a5c4a', color: '#fff', border: 'none', padding: '10px 20px',
              borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '14px'
            }}
          >
            + Create First Complete Set
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredBundles.map(bundle => {
            const savings = Math.max(0, Math.round(((bundle.originalUSD - bundle.saleUSD) / bundle.originalUSD) * 100));
            return (
              <div
                key={bundle.id}
                style={{
                  background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1',
                  overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', position: 'relative'
                }}
              >
                {/* Images Preview Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(bundle.imgs.length, 3)}, 1fr)`, height: '220px', background: '#f5f4f0', borderBottom: '1px solid #eee', overflow: 'hidden' }}>
                  {bundle.imgs.slice(0, 3).map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: '100%', height: '100%', borderRight: i < bundle.imgs.length - 1 ? '1px solid #fff' : 'none' }}>
                      <Image
                        src={img}
                        alt={`${bundle.name} part ${i + 1}`}
                        fill
                        sizes="300px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  ))}
                  {bundle.imgs.length === 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '13px' }}>
                      No images attached
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      background: 'rgba(197,160,89,0.15)', color: '#9a752c',
                      padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px',
                      fontWeight: 700, letterSpacing: '0.5px'
                    }}>
                      {bundle.badge || `✦ Save ${savings}%`}
                    </span>

                    <button
                      onClick={() => handleToggleActive(bundle)}
                      title={bundle.isActive ? 'Click to set as Draft' : 'Click to publish on Storefront'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: bundle.isActive ? 'rgba(15,81,50,0.1)' : 'rgba(108,117,125,0.1)',
                        color: bundle.isActive ? '#0f5132' : '#6c757d',
                        border: 'none', padding: '4px 10px', borderRadius: '4px',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      {bundle.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                      {bundle.isActive ? 'Active' : 'Draft (Hidden)'}
                    </button>
                  </div>

                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', margin: '0 0 8px', color: '#1a5c4a', fontWeight: 700, lineHeight: 1.2 }}>
                    {bundle.name}
                  </h3>

                  {bundle.items && (
                    <div style={{ background: '#faf9f6', padding: '8px 12px', borderRadius: '6px', border: '1px solid #f0eee9', marginBottom: '12px', fontSize: '12px', color: '#555' }}>
                      <strong style={{ color: '#1a5c4a' }}>Set Inclusions:</strong> {bundle.items}
                    </div>
                  )}

                  {bundle.description && (
                    <p style={{ color: '#777', fontSize: '13px', margin: '0 0 14px', lineHeight: 1.4, flex: 1 }}>
                      {bundle.description.length > 120 ? bundle.description.slice(0, 120) + '...' : bundle.description}
                    </p>
                  )}

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a5c4a' }}>
                          ${bundle.saleUSD.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                          ${bundle.originalUSD.toLocaleString()}
                        </span>
                        <span style={{ background: '#d4edda', color: '#155724', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
                          {savings}% OFF
                        </span>
                      </div>
                      <span style={{ fontSize: '11.5px', color: '#888', display: 'block', marginTop: '2px' }}>
                        Stock: {bundle.stock || 'In Stock'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(bundle)}
                        title="Edit Set"
                        style={{
                          background: '#f8f9fa', border: '1px solid #ddd', padding: '8px 12px',
                          borderRadius: '5px', cursor: 'pointer', color: '#1a5c4a', display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '13px', fontWeight: 600
                        }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(bundle)}
                        title="Delete Set"
                        style={{
                          background: '#fff', border: '1px solid #f5c2c7', padding: '8px 10px',
                          borderRadius: '5px', cursor: 'pointer', color: '#dc3545'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal: Add or Edit Complete Set */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '720px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e8e6e1', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{
              padding: '20px 28px', borderBottom: '1px solid #eee', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', background: '#faf9f6'
            }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#c5a059', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {editingBundle ? 'Edit Existing Set' : '✦ New Catalog Bundle'}
                </span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: '2px 0 0', color: '#1a5c4a', fontWeight: 700 }}>
                  {editingBundle ? 'Modify Complete Set' : 'Create New Complete Set'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Set Title / Duo Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aquamarine + Garnet Royal Duo"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14.5px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Original Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 620"
                    value={formOriginalUSD}
                    onChange={e => setFormOriginalUSD(e.target.value === '' ? '' : Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14.5px', outline: 'none' }}
                  />
                  <span style={{ fontSize: '11.5px', color: '#888' }}>Individual prices combined</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Bundle Sale Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 558"
                    value={formSaleUSD}
                    onChange={e => setFormSaleUSD(e.target.value === '' ? '' : Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14.5px', outline: 'none' }}
                  />
                  <span style={{ fontSize: '11.5px', color: '#888' }}>Special bundle deal price</span>
                </div>
              </div>

              {formSavings && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '13px' }}>
                  <Sparkles size={16} color="#16a34a" />
                  <span>
                    <strong>Buyer Incentive:</strong> Customer saves <strong>${formSavings.diff}</strong> ({formSavings.pct}% OFF regular price).
                  </span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Badge / Offer Tag
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    placeholder="e.g. ✦ Save 15%"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', marginBottom: '6px' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {BADGE_PRESETS.slice(0, 4).map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormBadge(preset)}
                        style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #ddd', background: '#faf9f6', cursor: 'pointer' }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Inventory / Stock Note
                  </label>
                  <select
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: '#fff' }}
                  >
                    {STOCK_PRESETS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Set Inclusions (What stones/specimens are included?)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1x 4.2ct Natural Aquamarine Crystal, 1x 2.8ct Faceted Spessartine Garnet"
                  value={formItems}
                  onChange={e => setFormItems(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                />
                <span style={{ fontSize: '11.5px', color: '#888' }}>Provides clarity to international gemstone collectors</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Set Description &amp; Curated Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the provenance, cut, pairing synergy, and mineral authenticity..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  Set Gemstone Images ({formImgs.length} attached) *
                </label>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Paste image URL (https://...)"
                    value={inputImgUrl}
                    onChange={e => setInputImgUrl(e.target.value)}
                    style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13.5px', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImgUrl}
                    style={{ padding: '9px 16px', borderRadius: '6px', border: '1px solid #1a5c4a', background: '#f0fdf4', color: '#1a5c4a', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                  >
                    + Add URL
                  </button>
                  <label style={{
                    padding: '9px 16px', borderRadius: '6px', background: '#1a5c4a', color: '#fff',
                    fontWeight: 600, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <Upload size={15} /> {isUploading ? 'Uploading...' : 'Upload File'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {uploadError && (
                  <p style={{ color: '#dc3545', fontSize: '12px', margin: '0 0 10px' }}>{uploadError}</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', padding: '12px', background: '#faf9f6', borderRadius: '8px', border: '1px solid #eee' }}>
                  {formImgs.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ddd' }}>
                      <Image src={img} alt={`Preview ${idx}`} fill sizes="120px" style={{ objectFit: 'cover' }} unoptimized />
                      <button
                        type="button"
                        onClick={() => handleRemoveImg(idx)}
                        style={{
                          position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px',
                          borderRadius: '50%', background: 'rgba(220,53,69,0.9)', color: '#fff',
                          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={12} />
                      </button>
                      <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '1px 5px', borderRadius: '3px' }}>
                        Stone #{idx + 1}
                      </span>
                    </div>
                  ))}
                  {formImgs.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', fontSize: '13px', padding: '16px' }}>
                      No images added yet. Please add at least 2 images for the complete set duo/trio.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: '#fbfbfb', padding: '12px 16px', borderRadius: '6px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={e => setFormIsActive(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#1a5c4a', cursor: 'pointer' }}
                />
                <label htmlFor="formIsActive" style={{ fontSize: '14px', fontWeight: 600, color: '#333', cursor: 'pointer' }}>
                  Publish &amp; make visible on storefront homepage
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '6px', border: 'none', background: '#1a5c4a', color: '#fff', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,92,74,0.3)' }}
                >
                  {editingBundle ? 'Save Changes' : 'Publish Complete Set'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '28px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', color: '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={26} />
            </div>
            <h3 style={{ fontSize: '20px', margin: '0 0 8px', color: '#111' }}>Delete Complete Set?</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.4 }}>
              Are you sure you want to delete <strong>&quot;{deleteTarget.name}&quot;</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', color: '#555', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '10px 22px', borderRadius: '6px', border: 'none', background: '#dc3545', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                Yes, Delete Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}