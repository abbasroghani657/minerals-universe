'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  MessageSquare, 
  Clock, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  Plus, 
  Truck,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [calculatedStats, setCalculatedStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch('/api/admin/overview');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.recentOrders || []);
            setInquiries(data.unreadInquiries || []);
            setReviews(data.pendingReviews || []);
            setProducts(data.lowStockProducts || []);
            if (data.stats) {
              setCalculatedStats(data.stats);
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Overview fetch error, falling back:', err);
      }

      // Fallback
      try {
        const [ordersRes, inqRes, revRes, prodRes] = await Promise.all([
          fetch('/api/orders').catch(() => null),
          fetch('/api/inquiries').catch(() => null),
          fetch('/api/reviews').catch(() => null),
          fetch('/api/products').catch(() => null),
        ]);

        if (ordersRes?.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success && Array.isArray(ordersData.orders)) {
            setOrders(ordersData.orders);
          }
        }

        if (inqRes?.ok) {
          const inqData = await inqRes.json();
          if (inqData.success && Array.isArray(inqData.inquiries)) {
            setInquiries(inqData.inquiries);
          }
        }

        if (revRes?.ok) {
          const revData = await revRes.json();
          if (revData.success && Array.isArray(revData.reviews)) {
            setReviews(revData.reviews);
          }
        }

        if (prodRes?.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.products)) {
            setProducts(prodData.products);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Real live calculations (instant from overview stats)
  const totalRevenue = calculatedStats?.totalRevenue ?? orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = calculatedStats?.totalOrdersCount ?? orders.length;
  const processingCount = calculatedStats?.processingOrdersCount ?? orders.filter(o => (o.status || 'Processing') === 'Processing').length;
  const deliveredCount = calculatedStats?.deliveredOrdersCount ?? orders.filter(o => o.status === 'Delivered').length;
  const unreadCount = calculatedStats?.unreadInquiriesCount ?? inquiries.filter((i: any) => i.status === 'Unread').length;
  const pendingCount = calculatedStats?.pendingReviewsCount ?? reviews.filter((r: any) => r.status === 'Pending').length;

  const processingOrders = orders.filter(o => (o.status || 'Processing') === 'Processing');
  const unreadInquiries = inquiries.filter(i => (i.status || 'Unread') === 'Unread');
  const pendingReviews = reviews.filter(r => (r.status || 'Pending') === 'Pending');

  // Identify low stock products
  const lowStockProducts = products.filter((p: any) => {
    if (!p.stock) return false;
    const s = String(p.stock).toLowerCase().trim();
    if (s.includes('only') || s.includes('left') || s.includes('out') || s === '0' || s === '1' || s === '2') {
      return true;
    }
    const num = parseInt(s);
    return !isNaN(num) && num <= 2;
  });

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `PKR ${totalRevenue.toLocaleString()}`, 
      subtitle: totalOrdersCount === 0 ? 'No sales recorded yet' : `${totalOrdersCount} verified order${totalOrdersCount === 1 ? '' : 's'}`,
      icon: DollarSign, 
      color: '#1a5c4a', 
      bg: '#e8f3f0' 
    },
    { 
      title: 'Total Orders', 
      value: String(totalOrdersCount), 
      subtitle: totalOrdersCount === 0 ? '0 pending fulfillments' : `${processingCount} processing • ${deliveredCount} delivered`,
      icon: ShoppingBag, 
      color: '#c5a059', 
      bg: '#fdf8ec' 
    },
    { 
      title: 'Pending Reviews', 
      value: String(pendingCount), 
      subtitle: pendingCount === 0 ? 'All reviews moderated' : 'Awaiting admin approval',
      icon: MessageSquare, 
      color: '#4a90e2', 
      bg: '#eef6fd' 
    },
    { 
      title: 'New Inquiries', 
      value: String(unreadCount), 
      subtitle: unreadCount === 0 ? 'All messages answered' : 'Requires customer reply',
      icon: Clock, 
      color: '#c94438', 
      bg: '#fdf2f2' 
    },
  ];

  const formatPrice = (p: string | number, paymentMethod?: string) => {
    if (typeof p === 'number') {
      const pm = (paymentMethod || '').toUpperCase();
      if (pm.includes('USD') || pm.includes('$')) {
        return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (pm.includes('EUR') || pm.includes('€')) {
        return `€${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (pm.includes('GBP') || pm.includes('£')) {
        return `£${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (pm.includes('AED')) {
        return `AED ${p.toLocaleString()}`;
      }
      return `PKR ${p.toLocaleString()}`;
    }
    return p;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: '36px', marginBottom: '14px' }}>💎</div>
        Loading live store statistics...
      </div>
    );
  }

  const hasPendingActions = unreadCount > 0 || pendingCount > 0 || processingCount > 0 || lowStockProducts.length > 0;

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '28px', color: '#1a5c4a', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Welcome back, Zaheer
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#666' }}>
            Live Store Operations &amp; Performance Overview • <span style={{ color: '#1a5c4a', fontWeight: 600 }}>MariaDB Live Sync</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1a5c4a',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(26,92,74,0.15)'
            }}
          >
            <Plus size={16} /> Add Product
          </Link>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fff',
              color: '#444',
              border: '1px solid #dcdad4',
              padding: '10px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Storefront <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Stats Cards (100% Real-Time Database Counts) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              style={{ 
                background: '#fff', 
                padding: '22px 24px', 
                borderRadius: '12px', 
                border: '1px solid #e8e6e1', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '18px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)' 
              }}
            >
              <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={26} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{stat.title}</p>
                <h3 style={{ margin: '0 0 4px', fontSize: '22px', color: '#111', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.value}</h3>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#888' }}>{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Orders & Live Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '24px' }}>
        
        {/* Left Column: Recent Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#333', fontWeight: 600 }}>Recent Orders</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Latest transactions received on Minerals Universe</p>
            </div>
            {orders.length > 0 && (
              <Link 
                href="/admin/orders" 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#1a5c4a', 
                  fontWeight: 600, 
                  fontSize: '13px', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All ({orders.length}) <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            /* Professional Empty State */
            <div style={{ textAlign: 'center', padding: '54px 20px', background: '#faf9f7', borderRadius: '8px', border: '1px dashed #dedbd4', marginTop: '10px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eef3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1a5c4a' }}>
                <ShoppingBag size={26} />
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#222', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>No Orders Recorded Yet</h4>
              <p style={{ margin: '0 auto 20px', fontSize: '13.5px', color: '#777', maxWidth: '420px', lineHeight: '1.5' }}>
                When customers purchase gemstones on your website via PayPal or bank transfer, their order receipts will appear here in real time with instant tracking tools.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link 
                  href="/admin/products" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: '#1a5c4a', 
                    color: '#fff', 
                    padding: '9px 16px', 
                    borderRadius: '6px', 
                    textDecoration: 'none', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  <Package size={15} /> Check Products ({products.length})
                </Link>
                <Link 
                  href="/shop" 
                  target="_blank" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: '#fff', 
                    color: '#444', 
                    border: '1px solid #ccc', 
                    padding: '9px 16px', 
                    borderRadius: '6px', 
                    textDecoration: 'none', 
                    fontSize: '13px', 
                    fontWeight: 600 
                  }}
                >
                  Test Store Checkout <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          ) : (
            /* Live Orders Table */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8e6e1', textAlign: 'left', color: '#888', fontSize: '12px' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Order ID</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((order, i) => (
                    <tr key={order.id || i} style={{ borderBottom: i !== Math.min(orders.length, 6) - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <td style={{ padding: '14px 8px', fontSize: '13.5px', fontWeight: 600, color: '#1a5c4a' }}>
                        <Link href="/admin/orders" style={{ color: '#1a5c4a', textDecoration: 'none' }}>
                          {order.id.startsWith('#') ? order.id : `#${order.id}`}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 8px', fontSize: '13.5px', color: '#333', fontWeight: 500 }}>
                        {order.customerName}
                        {order.customerEmail && (
                          <span style={{ display: 'block', fontSize: '11.5px', color: '#888' }}>{order.customerEmail}</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 8px', fontSize: '13px', color: '#666' }}>{formatDate(order.createdAt)}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '11.5px', 
                          fontWeight: 600,
                          background: (order.status || 'Processing') === 'Processing' ? '#fff3cd' : (order.status || 'Processing') === 'Shipped' ? '#d1ecf1' : '#d4edda',
                          color: (order.status || 'Processing') === 'Processing' ? '#856404' : (order.status || 'Processing') === 'Shipped' ? '#0c5460' : '#155724'
                        }}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px', fontSize: '13.5px', fontWeight: 700, color: '#111', textAlign: 'right' }}>
                        {formatPrice(order.total, order.paymentMethod)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Alerts & Operations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Real-time Alerts Card */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '17px', color: '#333', fontWeight: 600 }}>Action Required</h3>
            
            {!hasPendingActions ? (
              <div style={{ padding: '24px 16px', background: '#f6fbf8', border: '1px solid #d8ede3', borderRadius: '8px', textAlign: 'center' }}>
                <CheckCircle2 size={32} color="#1a5c4a" style={{ margin: '0 auto 10px', display: 'block' }} />
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1a5c4a', fontWeight: 600 }}>Store Operations All Clear</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#555', lineHeight: 1.5 }}>
                  No pending customer inquiries, reviews to moderate, or low-stock emergencies.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {processingOrders.length > 0 && (
                  <Link 
                    href="/admin/orders" 
                    style={{ 
                      padding: '14px 16px', 
                      background: '#fdf8ec', 
                      borderLeft: '4px solid #c5a059', 
                      borderRadius: '4px', 
                      textDecoration: 'none', 
                      display: 'block' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 600, color: '#856404' }}>Fulfillment Pending</p>
                      <span style={{ fontSize: '11px', background: '#c5a059', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        {processingOrders.length} order{processingOrders.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Requires parcel dispatch &amp; courier tracking ID.</p>
                  </Link>
                )}

                {unreadInquiries.length > 0 && (
                  <Link 
                    href="/admin/inquiries" 
                    style={{ 
                      padding: '14px 16px', 
                      background: '#fdf2f2', 
                      borderLeft: '4px solid #c94438', 
                      borderRadius: '4px', 
                      textDecoration: 'none', 
                      display: 'block' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 600, color: '#c94438' }}>Unread Customer Inquiries</p>
                      <span style={{ fontSize: '11px', background: '#c94438', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        {unreadInquiries.length} new
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Latest: {unreadInquiries[0]?.name || 'Customer'} ({unreadInquiries[0]?.type || 'Inquiry'})
                    </p>
                  </Link>
                )}

                {pendingReviews.length > 0 && (
                  <Link 
                    href="/admin/reviews" 
                    style={{ 
                      padding: '14px 16px', 
                      background: '#eef6fd', 
                      borderLeft: '4px solid #4a90e2', 
                      borderRadius: '4px', 
                      textDecoration: 'none', 
                      display: 'block' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 600, color: '#1a5999' }}>Reviews Awaiting Approval</p>
                      <span style={{ fontSize: '11px', background: '#4a90e2', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        {pendingReviews.length}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {pendingReviews[0]?.author} left a {pendingReviews[0]?.rating}★ review.
                    </p>
                  </Link>
                )}

                {lowStockProducts.length > 0 && (
                  <Link 
                    href="/admin/products" 
                    style={{ 
                      padding: '14px 16px', 
                      background: '#fff9e6', 
                      borderLeft: '4px solid #f39c12', 
                      borderRadius: '4px', 
                      textDecoration: 'none', 
                      display: 'block' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 600, color: '#a06500' }}>Low Stock Gemstones</p>
                      <span style={{ fontSize: '11px', background: '#f39c12', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        {lowStockProducts.length} items
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      "{lowStockProducts[0]?.name}" is running low.
                    </p>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Quick Operations Shortcuts */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e6e1', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: '#333', fontWeight: 600 }}>Quick Navigation</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link 
                href="/admin/products" 
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #eee', 
                  textDecoration: 'none', 
                  color: '#333', 
                  fontSize: '13px', 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fcfcfc',
                  transition: 'background 0.2s'
                }}
              >
                <Package size={16} color="#1a5c4a" /> Products ({products.length})
              </Link>
              <Link 
                href="/admin/orders" 
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #eee', 
                  textDecoration: 'none', 
                  color: '#333', 
                  fontSize: '13px', 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fcfcfc'
                }}
              >
                <Truck size={16} color="#c5a059" /> Orders ({orders.length})
              </Link>
              <Link 
                href="/admin/faqs" 
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #eee', 
                  textDecoration: 'none', 
                  color: '#333', 
                  fontSize: '13px', 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fcfcfc'
                }}
              >
                <Sparkles size={16} color="#4a90e2" /> Manage FAQs
              </Link>
              <Link 
                href="/admin/settings" 
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #eee', 
                  textDecoration: 'none', 
                  color: '#333', 
                  fontSize: '13px', 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fcfcfc'
                }}
              >
                <AlertCircle size={16} color="#c94438" /> Store Settings
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
