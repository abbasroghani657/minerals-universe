'use client';

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, MessageSquare, Clock } from 'lucide-react';

const dummyOrders = [
  { id: 'ORD-001', customerName: 'Ahmed Khan', createdAt: '2026-10-24T12:00:00Z', status: 'Processing', total: 45000 },
  { id: 'ORD-002', customerName: 'Sarah W.', createdAt: '2026-10-23T12:00:00Z', status: 'Shipped', total: 12500 },
  { id: 'ORD-003', customerName: 'Ali Raza', createdAt: '2026-10-21T12:00:00Z', status: 'Delivered', total: 85000 },
  { id: 'ORD-004', customerName: 'John Doe', createdAt: '2026-10-20T12:00:00Z', status: 'Processing', total: 3000 },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(3);
  const [reviewsCount, setReviewsCount] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch orders
        const ordersRes = await fetch('/api/orders');
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.orders) {
          setOrders(ordersData.orders);
        }

        // Fetch inquiries
        const inqRes = await fetch('/api/inquiries');
        const inqData = await inqRes.json();
        if (inqData.success && inqData.inquiries) {
          const unreadCount = inqData.inquiries.filter((i: any) => i.status === 'Unread').length;
          setInquiriesCount(unreadCount);
        }

        // Fetch reviews
        const revRes = await fetch('/api/reviews');
        const revData = await revRes.json();
        if (revData.success && revData.reviews) {
          const pendingCount = revData.reviews.filter((r: any) => r.status === 'Pending').length;
          setReviewsCount(pendingCount);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const displayOrders = orders.length > 0 ? orders : dummyOrders;

  // Calculate live stats
  const totalRevenue = orders.length > 0 ? orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) : 145500;
  const totalOrdersCount = orders.length > 0 ? orders.length : 24;

  const stats = [
    { title: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#1a5c4a', bg: '#e8f3f0' },
    { title: 'Total Orders', value: String(totalOrdersCount), icon: ShoppingBag, color: '#c5a059', bg: '#fdf8ec' },
    { title: 'Pending Reviews', value: String(reviewsCount), icon: MessageSquare, color: '#4a90e2', bg: '#eef6fd' },
    { title: 'New Inquiries', value: String(inquiriesCount), icon: Clock, color: '#c94438', bg: '#fdf2f2' },
  ];

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

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>Loading Dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 24px', fontSize: '28px', color: '#333', fontFamily: "'Cormorant Garamond', serif" }}>
        Welcome back, Zaheer
      </h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e8e6e1', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={28} />
              </div>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{stat.title}</p>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#111', fontWeight: 700 }}>{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Orders Table */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Recent Orders</h3>
            <button style={{ background: 'transparent', border: 'none', color: '#1a5c4a', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '13px' }}>
                <th style={{ padding: '12px 0', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '12px 0', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '12px 0', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 0', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 0', fontWeight: 600 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.slice(0, 5).map((order, i) => (
                <tr key={i} style={{ borderBottom: i !== displayOrders.slice(0, 5).length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#1a5c4a' }}>{order.id.startsWith('#') ? order.id : `#${order.id}`}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#333', fontWeight: 500 }}>{order.customerName}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#666' }}>{formatDate(order.createdAt)}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: (order.status || 'Processing') === 'Processing' ? '#fff3cd' : (order.status || 'Processing') === 'Shipped' ? '#d1ecf1' : '#d4edda',
                      color: (order.status || 'Processing') === 'Processing' ? '#856404' : (order.status || 'Processing') === 'Shipped' ? '#0c5460' : '#155724'
                    }}>
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions / Alerts */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: '#333' }}>Pending Actions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#fdf8ec', borderLeft: '4px solid #c5a059', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#333' }}>Review Needs Approval</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Sarah K. left a 5-star review on "Aquamarine".</p>
            </div>
            <div style={{ padding: '16px', background: '#eef6fd', borderLeft: '4px solid #4a90e2', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#333' }}>New Custom Inquiry</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Ali requests a custom Tourmaline ring.</p>
            </div>
            <div style={{ padding: '16px', background: '#fdf2f2', borderLeft: '4px solid #c94438', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#333' }}>Low Stock Alert</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Imperial Topaz only has 1 item left.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
