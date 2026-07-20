'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Check } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const priceNum = Number(formData.get('priceNum'));
    const payload: any = {
      name: formData.get('name') as string,
      cat: formData.get('cat') as string,
      priceNum,
      sale: `PKR ${priceNum.toLocaleString()}`,
      original: formData.get('original') ? `PKR ${Number(formData.get('original')).toLocaleString()}` : null,
      desc: formData.get('desc') as string,
      origin: formData.get('origin') as string || 'Pakistan',
      treatment: formData.get('treatment') as string || 'None',
      cert: formData.get('cert') as string || 'None',
      img: editingProduct?.img || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
      stock: formData.get('stock') as string || '10',
      badge: '',
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
        } else {
          alert(data.error || 'Failed to update product.');
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
        } else {
          alert(data.error || 'Failed to create product.');
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const getStatus = (stock: any) => {
    const s = Number(stock || 0);
    if (s === 0) return 'Out of Stock';
    if (s <= 2) return 'Low Stock';
    return 'Active';
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || p.cat === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(products.map(p => p.cat)));

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Products...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>Products Manager</h2>
        <button onClick={handleAddNew} style={{ background: '#1a5c4a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} 
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '12px 20px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff' }}
          >
            <option>All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '13px' }}>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Product Name</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Stock</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, i) => {
              const status = getStatus(p.stock);
              return (
                <tr key={p.id} style={{ borderBottom: i !== filteredProducts.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#333' }}>{p.name}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#666' }}>{p.cat}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#1a5c4a' }}>PKR {p.priceNum?.toLocaleString()}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#333' }}>{p.stock || '0'}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: status === 'Active' ? '#d4edda' : status === 'Low Stock' ? '#fff3cd' : '#fdf2f2',
                      color: status === 'Active' ? '#155724' : status === 'Low Stock' ? '#856404' : '#c94438'
                    }}>
                      {status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a90e2', marginRight: '12px' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '12px', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '24px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#1a5c4a' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={24} /></button>
            </div>

            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSubmit}>
                
                {/* Basic Info */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Basic Info</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Product Title</label>
                    <input name="name" type="text" defaultValue={editingProduct?.name} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. Natural Aquamarine Emerald Cut" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Category</label>
                    <select name="cat" defaultValue={editingProduct?.cat} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff' }}>
                      <option>Aquamarine</option>
                      <option>Tourmaline</option>
                      <option>Garnet</option>
                      <option>Topaz</option>
                      <option>Sapphire</option>
                      <option>Lapis Lazuli</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Stock Quantity</label>
                    <input name="stock" type="number" defaultValue={editingProduct?.stock || 0} required min="0" style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} />
                  </div>
                </div>

                {/* Pricing */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Pricing (PKR)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Sale Price (Current)</label>
                    <input name="priceNum" type="number" defaultValue={editingProduct?.priceNum} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. 38500" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Original Price (Crossed Out)</label>
                    <input name="original" type="number" defaultValue={editingProduct?.original ? Number(editingProduct.original.replace(/[^0-9]/g, '')) : ''} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. 48000" />
                  </div>
                </div>

                {/* Detailed Information */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Detailed Information (Product Tabs)</h3>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Main Description</label>
                  <textarea name="desc" defaultValue={editingProduct?.desc} rows={4} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', resize: 'vertical' }} placeholder="Describe the gemstone..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Origin</label>
                    <input name="origin" type="text" defaultValue={editingProduct?.origin} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. Gilgit, Pakistan" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Treatment</label>
                    <input name="treatment" type="text" defaultValue={editingProduct?.treatment} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. 100% Natural, Unheated" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Certification</label>
                    <input name="cert" type="text" defaultValue={editingProduct?.cert} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. GIA Certified" />
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #e8e6e1', paddingTop: '24px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#555' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '12px 24px', background: '#1a5c4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={18} /> {editingProduct ? 'Save Changes' : 'Create Product'}
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
