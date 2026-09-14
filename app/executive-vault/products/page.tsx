'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, X, Upload, Check, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { CATEGORY_TREE, MAIN_CATEGORY_NAMES, getVarietiesForMain, inferMainCategory } from '@/utils/categories';

const STANDARD_BADGES = [
  { value: '', label: 'None' },
  { value: 'SALE', label: 'SALE' },
  { value: 'NEW ARRIVAL', label: 'NEW ARRIVAL' },
  { value: 'RARE SPECIMEN', label: 'RARE SPECIMEN' },
  { value: 'BEST SELLER', label: 'BEST SELLER' },
  { value: 'HOT DEAL', label: 'HOT DEAL' },
  { value: 'INVESTMENT GRADE', label: 'INVESTMENT GRADE' },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mainCatFilter, setMainCatFilter] = useState('All');
  const [varietyFilter, setVarietyFilter] = useState('All');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State: 2-Tier Hierarchy
  const [selectedMainCat, setSelectedMainCat] = useState<string>('Loose Gemstones');
  const [isCustomMainCat, setIsCustomMainCat] = useState(false);
  const [customMainCatName, setCustomMainCatName] = useState('');

  const [selectedVariety, setSelectedVariety] = useState<string>('Aquamarine');
  const [isCustomVariety, setIsCustomVariety] = useState(false);
  const [customVarietyName, setCustomVarietyName] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [priceUSD, setPriceUSD] = useState<number | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [origUSD, setOrigUSD] = useState<number | ''>('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [stockCount, setStockCount] = useState<number>(5);
  const [origin, setOrigin] = useState('Gilgit, Pakistan');
  const [treatment, setTreatment] = useState('100% Natural, Unheated');
  const [cert, setCert] = useState('GIA Certified');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      showToast('Failed to load products from database', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Active varieties available for the selected main category in the form
  const availableVarieties = useMemo(() => {
    const fromTree = getVarietiesForMain(selectedMainCat);
    // Include any existing varieties in database that have this main category
    const fromDB = products
      .filter(p => (p.mainCat || inferMainCategory(p.cat)) === selectedMainCat)
      .map(p => p.cat)
      .filter(Boolean);

    return Array.from(new Set([...fromTree, ...fromDB]));
  }, [selectedMainCat, products]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setSelectedMainCat('Loose Gemstones');
    setIsCustomMainCat(false);
    setCustomMainCatName('');

    setSelectedVariety('Aquamarine');
    setIsCustomVariety(false);
    setCustomVarietyName('');

    setImageUrl('https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80');
    setPriceUSD('');
    setOrigUSD('');
    setSelectedBadge('');
    setStockCount(5);
    setOrigin('Gilgit, Pakistan');
    setTreatment('100% Natural, Unheated');
    setCert('GIA Certified');
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    const inferredMain = product.mainCat || inferMainCategory(product.cat);

    if (MAIN_CATEGORY_NAMES.includes(inferredMain)) {
      setSelectedMainCat(inferredMain);
      setIsCustomMainCat(false);
      setCustomMainCatName('');
    } else {
      setSelectedMainCat('__custom__');
      setIsCustomMainCat(true);
      setCustomMainCatName(inferredMain);
    }

    const currentVarieties = getVarietiesForMain(inferredMain);
    if (currentVarieties.includes(product.cat)) {
      setSelectedVariety(product.cat);
      setIsCustomVariety(false);
      setCustomVarietyName('');
    } else {
      setSelectedVariety('__custom__');
      setIsCustomVariety(true);
      setCustomVarietyName(product.cat);
    }

    setImageUrl(product.img || '');
    setPriceUSD(product.priceNum || '');
    const numOrig = product.original ? Number(String(product.original).replace(/[^0-9.]/g, '')) : '';
    setOrigUSD(numOrig || '');
    setSelectedBadge(product.badge || '');
    const stockNum = product.stock ? parseInt(String(product.stock).replace(/[^0-9]/g, ''), 10) : 5;
    setStockCount(isNaN(stockNum) ? 5 : stockNum);
    setOrigin(product.origin || 'Pakistan');
    setTreatment(product.treatment || '100% Natural, Unheated');
    setCert(product.cert || 'Authentic Gem');
    setUploadError(null);
    setIsModalOpen(true);
  };

  // When main category changes in the modal, update selected variety to first available
  const handleMainCatChange = (newMain: string) => {
    if (newMain === '__custom__') {
      setIsCustomMainCat(true);
      setSelectedMainCat('__custom__');
      setCustomMainCatName('');
      setIsCustomVariety(true);
      setSelectedVariety('__custom__');
      setCustomVarietyName('');
    } else {
      setIsCustomMainCat(false);
      setSelectedMainCat(newMain);
      const vars = getVarietiesForMain(newMain);
      if (vars.length > 0) {
        setSelectedVariety(vars[0]);
        setIsCustomVariety(false);
        setCustomVarietyName('');
      }
    }
  };

  const compressImageClient = async (
    file: File,
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.85
  ): Promise<{ file: File; base64: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = (event.target?.result as string) || '';
        const img = document.createElement('img');
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ file, base64: dataUrl });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/webp', quality);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const cleanName = file.name.replace(/\.[^.]+$/, '.webp');
                const compressedFile = new File([blob], cleanName, { type: 'image/webp' });
                resolve({ file: compressedFile, base64: compressedBase64 });
              } else {
                resolve({ file, base64: dataUrl });
              }
            },
            'image/webp',
            quality
          );
        };
        img.onerror = () => resolve({ file, base64: dataUrl });
        img.src = dataUrl;
      };
      reader.onerror = () => resolve({ file, base64: '' });
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Client-side instant canvas compression (drops 10MB down to ~150KB)
      const { file: compressedFile, base64: fallbackBase64 } = await compressImageClient(rawFile, 1600, 1600, 0.85);

      let finalUrl = '';

      // 2. Try server upload API first
      try {
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('type', 'product');

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-admin-key': 'MineralsOwner2026!',
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            finalUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Server upload API failed, falling back to local compressed data URI:', uploadErr);
      }

      // 3. Fallback to client-compressed base64 if server upload didn't return a URL
      if (!finalUrl) {
        finalUrl = fallbackBase64;
      }

      if (!finalUrl) {
        throw new Error('Unable to read selected photo.');
      }

      setImageUrl(finalUrl);
      showToast('Image processed & attached successfully!');
    } catch (err: any) {
      console.error('[Upload Error]', err);
      setUploadError(err.message || 'Image upload error');
      showToast('Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
        showToast('Gemstone deleted successfully');
      } else {
        showToast(data.error || 'Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Error deleting product', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const finalMainCat = isCustomMainCat ? customMainCatName.trim() : selectedMainCat;
    const finalVariety = isCustomVariety ? customVarietyName.trim() : selectedVariety;

    if (!finalMainCat) {
      showToast('Please select or specify a Primary Category (e.g. Loose Gemstones, Minerals & Crystals, Polished Stones).', 'error');
      return;
    }

    if (!finalVariety) {
      showToast('Please select or enter the Gemstone / Mineral variety name.', 'error');
      return;
    }

    if (!imageUrl.trim()) {
      showToast('Please upload an image or provide an image URL.', 'error');
      return;
    }

    const price = Number(priceUSD);
    if (!price || price <= 0) {
      showToast('Please enter a valid base price in USD ($).', 'error');
      return;
    }

    const stockVal = stockCount <= 0 ? 'Out of Stock' : stockCount <= 2 ? `Only ${stockCount} left` : 'In Stock';

    const payload: any = {
      name: (formData.get('name') as string).trim(),
      mainCat: finalMainCat,
      cat: finalVariety,
      priceNum: price,
      sale: `$${price.toLocaleString()}`,
      original: origUSD ? `$${Number(origUSD).toLocaleString()}` : null,
      desc: (formData.get('desc') as string).trim(),
      origin: origin.trim() || 'Pakistan',
      treatment: treatment.trim() || '100% Natural, Unheated',
      cert: cert.trim() || 'Authentic Gem',
      img: imageUrl.trim(),
      stock: stockVal,
      badge: selectedBadge,
    };

    try {
      if (editingProduct) {
        payload.id = editingProduct.id;
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.product) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
          showToast('Gemstone updated successfully!');
          setIsModalOpen(false);
        } else {
          showToast(data.error || 'Failed to update product.', 'error');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.product) {
          setProducts(prev => [data.product, ...prev]);
          showToast('New gemstone added to store!');
          setIsModalOpen(false);
        } else {
          showToast(data.error || 'Failed to create product.', 'error');
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      showToast('Error saving product', 'error');
    }
  };

  const getStatus = (stock: any) => {
    if (!stock) return 'Active';
    const str = String(stock).toLowerCase();
    if (str.includes('out')) return 'Out of Stock';
    if (str.includes('only') || str.includes('low')) return 'Low Stock';
    return 'Active';
  };

  // Filter products based on search term, main category and variety
  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name?.toLowerCase().includes(q) || 
      p.cat?.toLowerCase().includes(q) ||
      p.mainCat?.toLowerCase().includes(q) ||
      p.desc?.toLowerCase().includes(q) ||
      p.origin?.toLowerCase().includes(q);

    const productMainCat = p.mainCat || inferMainCategory(p.cat);
    const matchesMain = mainCatFilter === 'All' || productMainCat === mainCatFilter;
    const matchesVariety = varietyFilter === 'All' || p.cat?.toLowerCase() === varietyFilter.toLowerCase();

    return matchesSearch && matchesMain && matchesVariety;
  });

  // Unique varieties available for the filter dropdown
  const filterVarieties = useMemo(() => {
    const subset = mainCatFilter === 'All' 
      ? products 
      : products.filter(p => (p.mainCat || inferMainCategory(p.cat)) === mainCatFilter);
    return Array.from(new Set(subset.map(p => p.cat).filter(Boolean)));
  }, [products, mainCatFilter]);

  // Total inventory value in USD
  const totalValueUSD = products.reduce((acc, p) => acc + (Number(p.priceNum) || 0), 0);

  // Counts per main category
  const looseCount = products.filter(p => (p.mainCat || inferMainCategory(p.cat)) === 'Loose Gemstones').length;
  const mineralsCount = products.filter(p => (p.mainCat || inferMainCategory(p.cat)) === 'Minerals & Crystals').length;
  const polishedCount = products.filter(p => (p.mainCat || inferMainCategory(p.cat)) === 'Polished Stones').length;

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>
        <RefreshCw className="animate-spin" size={24} style={{ display: 'inline-block', marginBottom: '8px' }} />
        <p>Loading Product Catalog...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .products-header-flex {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
          }
          .products-header-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .products-filter-bar {
            flex-direction: column !important;
          }
          .products-filter-bar select {
            width: 100% !important;
          }
          .modal-sheet-container {
            padding: 0 !important;
            align-items: flex-end !important;
          }
          .modal-sheet-content {
            max-height: 94vh !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .modal-form-padding {
            padding: 18px 16px 28px !important;
          }
          .form-grid-2col, .form-grid-3col, .form-grid-4col {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .modal-footer-btns {
            flex-direction: column-reverse !important;
            gap: 10px !important;
          }
          .modal-footer-btns button {
            width: 100% !important;
            justify-content: center !important;
          }
          .modal-sheet-content input, 
          .modal-sheet-content select, 
          .modal-sheet-content textarea {
            font-size: 16px !important;
          }
        }
      `}} />

      {/* Global Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 10000,
          background: toast.type === 'success' ? '#1a5c4a' : '#c94438',
          color: '#fff', padding: '14px 22px', borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: '14px',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header & Add Button */}
      <div className="products-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '28px', color: '#1a5c4a', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Gemstones &amp; Minerals Catalog
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#666' }}>
            Structured into <strong>Loose Gemstones</strong>, <strong>Minerals &amp; Crystals</strong>, and <strong>Polished Stones</strong>.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="products-header-btn"
          style={{
            background: '#1a5c4a', color: '#fff', border: 'none',
            padding: '12px 22px', borderRadius: '6px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600,
            boxShadow: '0 4px 12px rgba(26,92,74,0.2)', transition: 'background .2s'
          }}
        >
          <Plus size={18} /> Add New Gemstone / Specimen
        </button>
      </div>

      {/* 3 Main Category Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div 
          onClick={() => { setMainCatFilter(mainCatFilter === 'Loose Gemstones' ? 'All' : 'Loose Gemstones'); setVarietyFilter('All'); }}
          style={{ 
            background: mainCatFilter === 'Loose Gemstones' ? '#f0f7f5' : '#fff',
            border: mainCatFilter === 'Loose Gemstones' ? '2px solid #1a5c4a' : '1px solid #e8e6e1',
            borderRadius: '8px', padding: '16px 20px', cursor: 'pointer', transition: 'all .2s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#1a5c4a', fontWeight: 700, letterSpacing: '0.5px' }}>💎 Loose Gemstones</span>
            <span style={{ fontSize: '11px', background: '#e0ece9', color: '#1a5c4a', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Faceted</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', color: '#1a1a1a', fontWeight: 700 }}>{looseCount} <span style={{ fontSize: '14px', fontWeight: 400, color: '#888' }}>Items</span></h3>
        </div>

        <div 
          onClick={() => { setMainCatFilter(mainCatFilter === 'Minerals & Crystals' ? 'All' : 'Minerals & Crystals'); setVarietyFilter('All'); }}
          style={{ 
            background: mainCatFilter === 'Minerals & Crystals' ? '#f0f7f5' : '#fff',
            border: mainCatFilter === 'Minerals & Crystals' ? '2px solid #1a5c4a' : '1px solid #e8e6e1',
            borderRadius: '8px', padding: '16px 20px', cursor: 'pointer', transition: 'all .2s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#1a5c4a', fontWeight: 700, letterSpacing: '0.5px' }}>🔮 Minerals &amp; Crystals</span>
            <span style={{ fontSize: '11px', background: '#e0ece9', color: '#1a5c4a', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Rough/Matrix</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', color: '#1a1a1a', fontWeight: 700 }}>{mineralsCount} <span style={{ fontSize: '14px', fontWeight: 400, color: '#888' }}>Items</span></h3>
        </div>

        <div 
          onClick={() => { setMainCatFilter(mainCatFilter === 'Polished Stones' ? 'All' : 'Polished Stones'); setVarietyFilter('All'); }}
          style={{ 
            background: mainCatFilter === 'Polished Stones' ? '#f0f7f5' : '#fff',
            border: mainCatFilter === 'Polished Stones' ? '2px solid #1a5c4a' : '1px solid #e8e6e1',
            borderRadius: '8px', padding: '16px 20px', cursor: 'pointer', transition: 'all .2s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#1a5c4a', fontWeight: 700, letterSpacing: '0.5px' }}>🪨 Polished Stones</span>
            <span style={{ fontSize: '11px', background: '#e0ece9', color: '#1a5c4a', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Cabochons</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', color: '#1a1a1a', fontWeight: 700 }}>{polishedCount} <span style={{ fontSize: '14px', fontWeight: 400, color: '#888' }}>Items</span></h3>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: '8px', padding: '16px 20px' }}>
          <p style={{ margin: '0 0 6px', fontSize: '12px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Total Inventory Value</p>
          <h3 style={{ margin: 0, fontSize: '24px', color: '#c5a059', fontWeight: 700 }}>${totalValueUSD.toLocaleString()} USD</h3>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        
        {/* Filters Bar */}
        <div className="products-filter-bar" style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search gemstone name, variety, mine origin..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
            />
          </div>

          {/* Main Category Filter */}
          <select 
            value={mainCatFilter}
            onChange={(e) => { setMainCatFilter(e.target.value); setVarietyFilter('All'); }}
            style={{ padding: '12px 16px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff', fontSize: '13.5px', color: '#333', fontWeight: 500 }}
          >
            <option value="All">All Main Categories ({products.length})</option>
            {MAIN_CATEGORY_NAMES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Sub-Variety Filter */}
          <select 
            value={varietyFilter}
            onChange={(e) => setVarietyFilter(e.target.value)}
            style={{ padding: '12px 16px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff', fontSize: '13.5px', color: '#333' }}
          >
            <option value="All">All Varieties / Stones ({filterVarieties.length})</option>
            {filterVarieties.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 0', fontWeight: 600, width: '56px' }}>Photo</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Gemstone &amp; Title</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Variety / Stone</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Base Price (USD)</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 0', textAlign: 'center', color: '#888' }}>
                    No products found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, i) => {
                  const status = getStatus(p.stock);
                  const parentCat = p.mainCat || inferMainCategory(p.cat);

                  return (
                    <tr key={p.id} style={{ borderBottom: i !== filteredProducts.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <td style={{ padding: '12px 0' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', position: 'relative', background: '#f5f5f5', border: '1px solid #eee' }}>
                          <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: '#222' }}>
                        <div>{p.name}</div>
                        <div style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>{p.origin} • {p.cert}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#666' }}>
                        <span style={{ 
                          background: parentCat === 'Loose Gemstones' ? '#eef7f5' : parentCat === 'Minerals & Crystals' ? '#f5f0fa' : '#fcf4ec',
                          color: parentCat === 'Loose Gemstones' ? '#1a5c4a' : parentCat === 'Minerals & Crystals' ? '#5a2d82' : '#8c4b18',
                          padding: '3px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px'
                        }}>
                          {parentCat}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13.5px', fontWeight: 600, color: '#1a5c4a' }}>
                        {p.cat}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#1a5c4a' }}>
                        ${Number(p.priceNum || 0).toLocaleString()} USD
                        {p.original && (
                          <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '6px', fontWeight: 400 }}>
                            {p.original}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', color: '#555' }}>
                        {p.stock || 'In Stock'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600,
                          background: status === 'Active' ? '#d4edda' : status === 'Low Stock' ? '#fff3cd' : '#fdf2f2',
                          color: status === 'Active' ? '#155724' : status === 'Low Stock' ? '#856404' : '#c94438'
                        }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleEdit(p)} 
                          title="Edit Gemstone"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a5c4a', marginRight: '14px', padding: '4px' }}
                        >
                          <Edit size={17} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(p)} 
                          title="Delete Gemstone"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438', padding: '4px' }}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-sheet-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div className="modal-sheet-content" style={{ background: '#fff', width: '100%', maxWidth: '840px', maxHeight: '92vh', borderRadius: '12px', overflowY: 'auto', position: 'relative', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '20px 26px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#1a5c4a', fontWeight: 700 }}>
                  {editingProduct ? 'Edit Gemstone / Specimen' : 'Add New Gemstone to Collection'}
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#777' }}>
                  Select the main department, choose or type the gemstone variety, and enter pricing.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            <div className="modal-form-padding" style={{ padding: '26px' }}>
              <form onSubmit={handleSubmit}>
                
                {/* 1. Category Hierarchy Selection */}
                <h3 style={{ fontSize: '14px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={16} /> 1. Category &amp; Gemstone Variety
                </h3>

                {/* Main Category Cards / Selection */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>
                    Select Primary Department *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {MAIN_CATEGORY_NAMES.map((mainName) => {
                      const isSelected = !isCustomMainCat && selectedMainCat === mainName;
                      return (
                        <div 
                          key={mainName}
                          onClick={() => handleMainCatChange(mainName)}
                          style={{
                            border: isSelected ? '2px solid #1a5c4a' : '1px solid #d5d2cc',
                            background: isSelected ? '#f0f7f5' : '#fff',
                            borderRadius: '8px', padding: '12px 14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s'
                          }}
                        >
                          <input 
                            type="radio" 
                            name="mainCatRadio" 
                            checked={isSelected} 
                            onChange={() => handleMainCatChange(mainName)} 
                            style={{ accentColor: '#1a5c4a' }}
                          />
                          <div>
                            <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: '13.5px', color: isSelected ? '#1a5c4a' : '#333' }}>
                              {mainName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Variety & Title */}
                <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                      Gemstone / Mineral Variety *
                    </label>
                    {!isCustomVariety ? (
                      <select 
                        value={selectedVariety} 
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomVariety(true);
                            setCustomVarietyName('');
                          } else {
                            setSelectedVariety(e.target.value);
                          }
                        }}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', background: '#fff', fontSize: '14px' }}
                      >
                        {availableVarieties.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                        <option value="__custom__">✨ + Add Custom Variety / Stone...</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          value={customVarietyName}
                          onChange={(e) => setCustomVarietyName(e.target.value)}
                          placeholder="e.g. Paraiba Tourmaline, Alexandrite"
                          autoFocus
                          required
                          style={{ flex: 1, padding: '12px', border: '1px solid #1a5c4a', borderRadius: '6px', outline: 'none', fontSize: '14px' }}
                        />
                        <button 
                          type="button" 
                          onClick={() => { setIsCustomVariety(false); if (availableVarieties[0]) setSelectedVariety(availableVarieties[0]); }}
                          style={{ padding: '0 12px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#555' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#888' }}>
                      {isCustomVariety ? 'Type any custom variety for this department.' : `Pre-configured stones for ${selectedMainCat}`}
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                      Full Listing Title *
                    </label>
                    <input 
                      name="name" 
                      type="text" 
                      defaultValue={editingProduct?.name} 
                      required 
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                      placeholder="e.g. Natural Swat Emerald Cushion Cut (3.5 Cts)" 
                    />
                  </div>
                </div>

                {/* 2. Photo / Image Upload & URL */}
                <h3 style={{ fontSize: '14px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={16} /> 2. Gemstone Photo &amp; Live Preview
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '20px', marginBottom: '24px', alignItems: 'center' }}>
                  <div style={{ width: '160px', height: '160px', border: '2px dashed #d5d2cc', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#faf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imageUrl ? (
                      <Image src={imageUrl} alt="Gem Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#aaa', padding: '10px' }}>
                        <ImageIcon size={32} style={{ margin: '0 auto 6px' }} />
                        <span style={{ fontSize: '12px' }}>No Image</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp,image/jpg" 
                        style={{ display: 'none' }} 
                        onChange={handleImageUpload} 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={{
                          padding: '10px 18px', background: '#1a5c4a', color: '#fff',
                          border: 'none', borderRadius: '6px', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600
                        }}
                      >
                        <Upload size={16} /> {isUploading ? 'Uploading Image...' : 'Upload Image from Computer'}
                      </button>
                    </div>

                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#555', marginBottom: '4px' }}>
                      Or Paste Image URL directly:
                    </label>
                    <input 
                      type="url" 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or /uploads/..."
                      required
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '13.5px' }}
                    />
                    {uploadError && (
                      <p style={{ margin: '6px 0 0', color: '#c94438', fontSize: '12px' }}>⚠️ {uploadError}</p>
                    )}
                  </div>
                </div>

                {/* 3. Global Pricing (USD Base) & Badge */}
                <h3 style={{ fontSize: '14px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  3. Pricing &amp; Badges (International USD)
                </h3>

                <div className="form-grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                      Sale Price (USD $) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#777', fontWeight: 600 }}>$</span>
                      <input 
                        type="number" 
                        value={priceUSD} 
                        onChange={(e) => setPriceUSD(e.target.value ? Number(e.target.value) : '')}
                        required 
                        min="1"
                        step="any"
                        style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                        placeholder="385" 
                      />
                    </div>
                    {typeof priceUSD === 'number' && priceUSD > 0 && (
                      <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#1a5c4a', fontWeight: 500 }}>
                        ≈ PKR {(priceUSD * 280).toLocaleString()} (Auto-converted)
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                      Original / Was Price (USD $)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#777', fontWeight: 600 }}>$</span>
                      <input 
                        type="number" 
                        value={origUSD} 
                        onChange={(e) => setOrigUSD(e.target.value ? Number(e.target.value) : '')}
                        min="1"
                        step="any"
                        style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                        placeholder="480 (Optional)" 
                      />
                    </div>
                    {typeof priceUSD === 'number' && typeof origUSD === 'number' && origUSD > priceUSD && (
                      <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#c94438', fontWeight: 600 }}>
                        ✦ Save {Math.round(((origUSD - priceUSD) / origUSD) * 100)}% Discount
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                      Badge Tag (Optional)
                    </label>
                    <select 
                      value={selectedBadge} 
                      onChange={(e) => setSelectedBadge(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', background: '#fff', fontSize: '14px' }}
                    >
                      {STANDARD_BADGES.map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Specifications & Stock */}
                <h3 style={{ fontSize: '14px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  4. Gemstone Specifications &amp; Provenance
                </h3>

                <div className="form-grid-4col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Stock Quantity</label>
                    <input 
                      type="number" 
                      min="0"
                      value={stockCount}
                      onChange={(e) => setStockCount(parseInt(e.target.value, 10) || 0)}
                      required 
                      style={{ width: '100%', padding: '12px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Origin / Mine</label>
                    <input 
                      type="text" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. Swat, Pakistan"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Treatment</label>
                    <input 
                      type="text" 
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      placeholder="e.g. 100% Natural, Unheated"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Certification</label>
                    <input 
                      type="text" 
                      value={cert}
                      onChange={(e) => setCert(e.target.value)}
                      placeholder="e.g. GIA Certified"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px' }} 
                    />
                  </div>
                </div>

                {/* 5. Detailed Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                    Gemstone Description *
                  </label>
                  <textarea 
                    name="desc" 
                    defaultValue={editingProduct?.desc || 'A stunning natural specimen with exceptional clarity, vibrant color saturation, and unique crystal structure. Ideal for fine jewelry or premium mineral collections.'} 
                    rows={4} 
                    required 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #d5d2cc', borderRadius: '6px', outline: 'none', fontSize: '14px', resize: 'vertical' }} 
                    placeholder="Describe clarity, luster, facet cut, and collector appeal..." 
                  />
                </div>

                {/* Action Buttons */}
                <div className="modal-footer-btns" style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid #e8e6e1', paddingTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '14.5px', fontWeight: 600, color: '#666' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{
                      padding: '12px 28px', background: '#1a5c4a', color: '#fff',
                      border: 'none', borderRadius: '6px', cursor: 'pointer',
                      fontSize: '14.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
                      boxShadow: '0 4px 14px rgba(26,92,74,0.25)'
                    }}
                  >
                    <Check size={18} /> {editingProduct ? 'Save Gemstone Changes' : 'Publish Gemstone to Store'}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

      {/* Luxury Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 24px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fdf2f2', color: '#c94438', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif" }}>
              Remove Gemstone from Catalog?
            </h3>
            <p style={{ fontSize: '13.5px', color: '#666', margin: '0 0 24px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong> (${Number(deleteTarget.priceNum || 0).toLocaleString()} USD)? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #dcdad5', background: '#fff', color: '#555', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                style={{ padding: '10px 22px', borderRadius: '6px', border: 'none', background: '#c94438', color: '#fff', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(201,68,56,0.3)' }}
              >
                Delete Gemstone
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
