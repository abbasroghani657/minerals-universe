'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Mail, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Inquiries', href: '/admin/inquiries', icon: Mail },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#1a5c4a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: 0, color: '#c5a059' }}>
            Minerals Universe
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Admin Panel
          </p>
        </div>

        <nav style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? '4px solid #c5a059' : '4px solid transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 500,
                fontSize: '15px'
              }}>
                <Icon size={18} color={isActive ? '#c5a059' : 'currentColor'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none',
            color: '#fff', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s',
            fontSize: '14px', fontWeight: 500
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', padding: '20px 40px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#1a5c4a', fontWeight: 600 }}>Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#c5a059', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>
              ZA
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>Zaheer Abbas</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Administrator</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
