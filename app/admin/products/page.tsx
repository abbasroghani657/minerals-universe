'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Check } from 'lucide-react';

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const products = [
    { id: 1, name: 'Natural Aquamarine Emerald Cut', category: 'Aquamarine', price: '385', originalPrice: '480', stock: 4, status: 'Active', desc: 'A stunning natural aquamarine with exceptional clarity...', origin: 'Pakistan', treatment: 'Unheated', cert: 'GIA' },
    { id: 2, name: 'Deep Red Pyrope Garnet Oval', category: 'Garnet', price: '245', originalPrice: '320', stock: 12, status: 'Active', desc: 'A rich, fiery deep red pyrope garnet...', origin: 'Afghanistan', treatment: 'None', cert: 'Local Lab' },
    { id: 3, name: 'Pink Tourmaline Cushion Cut', category: 'Tourmaline', price: '740', originalPrice: '920', stock: 0, status: 'Out of Stock', desc: 'A vibrant pink tourmaline weighing over 6 carats...', origin: 'Brazil', treatment: 'Heated', cert: 'IGI' },
    { id: 4, name: 'Imperial Topaz Pear Shape', category: 'Topaz', price: '510', originalPrice: '650', stock: 1, status: 'Low Stock', desc: 'A rare and valuable imperial topaz...', origin: 'Russia', treatment: 'Irradiated', cert: 'GIA' },
  ];

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

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
            <input type="text" placeholder="Search products..." style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} />
          </div>
          <select style={{ padding: '12px 20px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff' }}>
            <option>All Categories</option>
            <option>Aquamarine</option>
            <option>Garnet</option>
            <option>Tourmaline</option>
            <option>Topaz</option>
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
            {products.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i !== products.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#333' }}>{p.name}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#666' }}>{p.category}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#1a5c4a' }}>PKR {p.price}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#333' }}>{p.stock}</td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: p.status === 'Active' ? '#d4edda' : p.status === 'Low Stock' ? '#fff3cd' : '#fdf2f2',
                    color: p.status === 'Active' ? '#155724' : p.status === 'Low Stock' ? '#856404' : '#c94438'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a90e2', marginRight: '12px' }}><Edit size={16} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
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
              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                
                {/* Basic Info */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Basic Info</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Product Title</label>
                    <input type="text" defaultValue={editingProduct?.name} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. Natural Aquamarine Emerald Cut" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Category</label>
                    <select defaultValue={editingProduct?.category} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff' }}>
                      <option>Aquamarine</option>
                      <option>Tourmaline</option>
                      <option>Garnet</option>
                      <option>Topaz</option>
                      <option>Sapphire</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Stock Quantity</label>
                    <input type="number" defaultValue={editingProduct?.stock || 0} required min="0" style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} />
                  </div>
                </div>

                {/* Pricing */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Pricing (PKR)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Sale Price (Current)</label>
                    <input type="number" defaultValue={editingProduct?.price} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. 385" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Original Price (Crossed Out)</label>
                    <input type="number" defaultValue={editingProduct?.originalPrice} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. 480" />
                  </div>
                </div>

                {/* Detailed Information */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Detailed Information (Product Tabs)</h3>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Main Description</label>
                  <textarea defaultValue={editingProduct?.desc} rows={4} required style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', resize: 'vertical' }} placeholder="Describe the gemstone..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Origin</label>
                    <input type="text" defaultValue={editingProduct?.origin} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. Gilgit, Pakistan" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Treatment</label>
                    <input type="text" defaultValue={editingProduct?.treatment} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. 100% Natural, Unheated" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Certification</label>
                    <input type="text" defaultValue={editingProduct?.cert} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. GIA Certified" />
                  </div>
                </div>

                {/* Media & Placement */}
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Media & Placement</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Product Images</label>
                    <div style={{ border: '2px dashed #ccc', padding: '30px', textAlign: 'center', borderRadius: '6px', cursor: 'pointer', background: '#faf9f7' }}>
                      <Upload size={24} color="#888" style={{ marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Click to upload images</p>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Store Placement</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={true} style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '14px', color: '#333' }}>Show in "Featured Products"</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={false} style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '14px', color: '#333' }}>Mark as "Bundle Offer"</span>
                    </label>
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
