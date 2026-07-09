'use client';

import { DollarSign, ShoppingBag, MessageSquare, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Revenue', value: 'PKR 145,500', icon: DollarSign, color: '#1a5c4a', bg: '#e8f3f0' },
    { title: 'Total Orders', value: '24', icon: ShoppingBag, color: '#c5a059', bg: '#fdf8ec' },
    { title: 'Pending Reviews', value: '8', icon: MessageSquare, color: '#4a90e2', bg: '#eef6fd' },
    { title: 'New Inquiries', value: '3', icon: Clock, color: '#c94438', bg: '#fdf2f2' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Ahmed Khan', date: 'Oct 24, 2026', status: 'Processing', total: 'PKR 45,000' },
    { id: '#ORD-002', customer: 'Sarah W.', date: 'Oct 23, 2026', status: 'Shipped', total: 'PKR 12,500' },
    { id: '#ORD-003', customer: 'Ali Raza', date: 'Oct 21, 2026', status: 'Delivered', total: 'PKR 85,000' },
    { id: '#ORD-004', customer: 'John Doe', date: 'Oct 20, 2026', status: 'Processing', total: 'PKR 3,000' },
  ];

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
                <h3 style={{ margin: 0, fontSize: '24px', color: '#111' }}>{stat.value}</h3>
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
              {recentOrders.map((order, i) => (
                <tr key={i} style={{ borderBottom: i !== recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#1a5c4a' }}>{order.id}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#333' }}>{order.customer}</td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#666' }}>{order.date}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: order.status === 'Processing' ? '#fff3cd' : order.status === 'Shipped' ? '#d1ecf1' : '#d4edda',
                      color: order.status === 'Processing' ? '#856404' : order.status === 'Shipped' ? '#0c5460' : '#155724'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>{order.total}</td>
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
