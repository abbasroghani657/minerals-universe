'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, X, Check, Truck, Package, CreditCard, MapPin, Trash2 } from 'lucide-react';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const formatPrice = (p: string | number) => {
    if (typeof p === 'number') return `PKR ${p.toLocaleString()}`;
    return p;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleUpdateFulfillment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const formData = new FormData(e.currentTarget);
    const status = formData.get('status') as string;
    const tracking = formData.get('tracking') as string;

    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOrder.id, status, tracking }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status, tracking } : o));
        setSelectedOrder(null);
      } else {
        alert(data.error || 'Failed to update order fulfillment.');
      }
    } catch (err) {
      console.error('Error updating fulfillment:', err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`Are you sure you want to delete order ${id}?`)) return;
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== id));
      } else {
        alert(data.error || 'Failed to delete order.');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Orders...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>Orders Management</h2>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search orders by ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '12px 20px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff' }}
          >
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '13px' }}>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Order ID</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Items</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Total</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, i) => (
              <tr key={o.id} style={{ borderBottom: i !== filteredOrders.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#1a5c4a' }}>{o.id}</td>
                <td style={{ padding: '16px 0' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', fontWeight: 500 }}>{o.customerName}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{o.customerEmail}</p>
                </td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#666' }}>{formatDate(o.createdAt)}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#333' }}>{o.items?.length || 0} items</td>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>{formatPrice(o.total)}</td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: (o.status || 'Processing') === 'Processing' ? '#fff3cd' : (o.status || 'Processing') === 'Shipped' ? '#d1ecf1' : (o.status || 'Processing') === 'Cancelled' ? '#fdf2f2' : '#d4edda',
                    color: (o.status || 'Processing') === 'Processing' ? '#856404' : (o.status || 'Processing') === 'Shipped' ? '#0c5460' : (o.status || 'Processing') === 'Cancelled' ? '#c94438' : '#155724'
                  }}>
                    {o.status || 'Processing'}
                  </span>
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button onClick={() => setSelectedOrder(o)} style={{ background: '#f8f9fa', border: '1px solid #e8e6e1', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#333', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
                    <Eye size={14} /> View
                  </button>
                  <button onClick={() => handleDeleteOrder(o.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c94438' }} title="Delete Order">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '12px', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '24px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#1a5c4a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Order {selectedOrder.id}
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    background: (selectedOrder.status || 'Processing') === 'Processing' ? '#fff3cd' : (selectedOrder.status || 'Processing') === 'Shipped' ? '#d1ecf1' : (selectedOrder.status || 'Processing') === 'Cancelled' ? '#fdf2f2' : '#d4edda',
                    color: (selectedOrder.status || 'Processing') === 'Processing' ? '#856404' : (selectedOrder.status || 'Processing') === 'Shipped' ? '#0c5460' : (selectedOrder.status || 'Processing') === 'Cancelled' ? '#c94438' : '#155724'
                  }}>
                    {selectedOrder.status || 'Processing'}
                  </span>
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={24} /></button>
            </div>

            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Left Column: Customer & Shipping */}
              <div>
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} /> Customer Details
                </h3>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e8e6e1', marginBottom: '24px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600, color: '#333' }}>{selectedOrder.customerName}</p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#555' }}>{selectedOrder.customerEmail}</p>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#555' }}>{selectedOrder.customerPhone}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.5' }}><strong>Shipping Address:</strong><br/>{selectedOrder.shippingAddress}</p>
                </div>

                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} /> Payment Info
                </h3>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e8e6e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#555' }}>Method</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#555' }}>Status</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: selectedOrder.paymentStatus === 'Paid' ? '#155724' : '#856404', background: selectedOrder.paymentStatus === 'Paid' ? '#d4edda' : '#fff3cd', padding: '2px 8px', borderRadius: '12px' }}>{selectedOrder.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Items & Fulfillment */}
              <div>
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} /> Order Items
                </h3>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e8e6e1', marginBottom: '24px' }}>
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: idx !== selectedOrder.items.length - 1 ? '12px' : 0, paddingBottom: idx !== selectedOrder.items.length - 1 ? '12px' : 0, borderBottom: idx !== selectedOrder.items.length - 1 ? '1px solid #ddd' : 'none' }}>
                      <div>
                        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 500, color: '#333' }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Qty: {item.quantity}</p>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a5c4a' }}>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ccc' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>Total Paid</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a5c4a' }}>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} /> Fulfillment Actions
                </h3>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e8e6e1' }}>
                  <form onSubmit={handleUpdateFulfillment}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Update Order Status</label>
                    <select name="status" defaultValue={selectedOrder.status || 'Processing'} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff', marginBottom: '16px' }}>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>

                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Tracking Number</label>
                    <input name="tracking" type="text" defaultValue={selectedOrder.tracking || ''} placeholder="e.g. DHL-123456789" style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', marginBottom: '16px' }} />

                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#1a5c4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Check size={18} /> Update Fulfillment
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
