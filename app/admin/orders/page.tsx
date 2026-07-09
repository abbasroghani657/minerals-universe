'use client';

import { useState } from 'react';
import { Search, Eye, X, Check, Truck, Package, CreditCard, MapPin } from 'lucide-react';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    { 
      id: '#ORD-001', customer: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+92 300 1234567',
      address: '123 Defense Housing Authority, Phase 5, Lahore, Pakistan',
      date: 'Oct 24, 2026', total: 'PKR 45,000', status: 'Processing',
      paymentMethod: 'Stripe / Card', paymentStatus: 'Paid',
      items: [
        { name: 'Natural Aquamarine Emerald Cut', qty: 1, price: 'PKR 38,000' },
        { name: 'Silver Polishing Cloth', qty: 2, price: 'PKR 3,500' }
      ]
    },
    { 
      id: '#ORD-002', customer: 'Sarah W.', email: 'sarah@example.com', phone: '+1 555 987 6543',
      address: '456 Gemstone Blvd, New York, NY 10001, USA',
      date: 'Oct 23, 2026', total: 'PKR 12,500', status: 'Shipped', tracking: 'DHL-88371923',
      paymentMethod: 'PayPal', paymentStatus: 'Paid',
      items: [
        { name: 'Deep Red Pyrope Garnet Oval', qty: 1, price: 'PKR 12,500' }
      ]
    },
    { 
      id: '#ORD-003', customer: 'Ali Raza', email: 'ali@example.com', phone: '+971 50 123 4567',
      address: 'Villa 14, Jumeirah 1, Dubai, UAE',
      date: 'Oct 21, 2026', total: 'PKR 85,000', status: 'Delivered', tracking: 'FEDEX-9182374',
      paymentMethod: 'Stripe / Card', paymentStatus: 'Paid',
      items: [
        { name: 'Pink Tourmaline Cushion Cut', qty: 1, price: 'PKR 75,000' },
        { name: 'Custom Gold Ring Setting', qty: 1, price: 'PKR 10,000' }
      ]
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>Orders Management</h2>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input type="text" placeholder="Search orders by ID or customer..." style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none' }} />
          </div>
          <select style={{ padding: '12px 20px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff' }}>
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
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
            {orders.map((o, i) => (
              <tr key={o.id} style={{ borderBottom: i !== orders.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#1a5c4a' }}>{o.id}</td>
                <td style={{ padding: '16px 0' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', fontWeight: 500 }}>{o.customer}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{o.email}</p>
                </td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#666' }}>{o.date}</td>
                <td style={{ padding: '16px 0', fontSize: '14px', color: '#333' }}>{o.items.length} items</td>
                <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>{o.total}</td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: o.status === 'Processing' ? '#fff3cd' : o.status === 'Shipped' ? '#d1ecf1' : '#d4edda',
                    color: o.status === 'Processing' ? '#856404' : o.status === 'Shipped' ? '#0c5460' : '#155724'
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button onClick={() => setSelectedOrder(o)} style={{ background: '#f8f9fa', border: '1px solid #e8e6e1', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#333', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={14} /> View
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
                    background: selectedOrder.status === 'Processing' ? '#fff3cd' : selectedOrder.status === 'Shipped' ? '#d1ecf1' : '#d4edda',
                    color: selectedOrder.status === 'Processing' ? '#856404' : selectedOrder.status === 'Shipped' ? '#0c5460' : '#155724'
                  }}>
                    {selectedOrder.status}
                  </span>
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Placed on {selectedOrder.date}</p>
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
                  <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600, color: '#333' }}>{selectedOrder.customer}</p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#555' }}>{selectedOrder.email}</p>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#555' }}>{selectedOrder.phone}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.5' }}><strong>Shipping Address:</strong><br/>{selectedOrder.address}</p>
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
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#155724', background: '#d4edda', padding: '2px 8px', borderRadius: '12px' }}>{selectedOrder.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Items & Fulfillment */}
              <div>
                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} /> Order Items
                </h3>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e8e6e1', marginBottom: '24px' }}>
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: idx !== selectedOrder.items.length - 1 ? '12px' : 0, paddingBottom: idx !== selectedOrder.items.length - 1 ? '12px' : 0, borderBottom: idx !== selectedOrder.items.length - 1 ? '1px solid #ddd' : 'none' }}>
                      <div>
                        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 500, color: '#333' }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Qty: {item.qty}</p>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a5c4a' }}>{item.price}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ccc' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>Total Paid</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a5c4a' }}>{selectedOrder.total}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '15px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} /> Fulfillment Actions
                </h3>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e8e6e1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Update Order Status</label>
                  <select defaultValue={selectedOrder.status} style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', background: '#fff', marginBottom: '16px' }}>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Tracking Number</label>
                  <input type="text" defaultValue={selectedOrder.tracking} placeholder="e.g. DHL-123456789" style={{ width: '100%', padding: '12px', border: '1px solid #e8e6e1', borderRadius: '6px', outline: 'none', marginBottom: '16px' }} />

                  <button type="button" onClick={() => setSelectedOrder(null)} style={{ width: '100%', padding: '12px', background: '#1a5c4a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Check size={18} /> Update Fulfillment
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
