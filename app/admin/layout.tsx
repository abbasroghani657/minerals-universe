'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Mail, LogOut, HelpCircle, Settings, Users, Layers } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [role, setRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('/api/auth/role');
        const data = await res.json();
        if (data.success && data.role) {
          setRole(data.role);
          if (data.email) setUserEmail(data.email);
        } else if (data.email) {
          setUserEmail(data.email);
        }
      } catch (err) {
        console.error('Error checking user role:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5', color: '#1a5c4a', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
        Verifying security clearance...
      </div>
    );
  }

  if (role !== 'Admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
        <div style={{ width: '100%', maxWidth: '440px', background: '#fff', border: '1px solid #e8e6e1', borderRadius: '12px', padding: '36px 28px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fdf2f2', color: '#c94438', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>
            🔒
          </div>
          <h2 style={{ color: '#1a5c4a', fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', margin: '0 0 10px' }}>Owner Authorization Required</h2>
          
          {userEmail ? (
            <div style={{ background: '#f0f7f5', border: '1px solid #d4ede6', borderRadius: '6px', padding: '12px', margin: '14px 0 20px', fontSize: '13.5px', color: '#1a5c4a' }}>
              Logged in as: <strong style={{ wordBreak: 'break-all' }}>{userEmail}</strong>
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>This email does not have Admin privileges yet.</div>
            </div>
          ) : (
            <p style={{ color: '#666', fontSize: '14.5px', margin: '0 0 24px', lineHeight: 1.5 }}>
              This portal is restricted to authorized store managers. Please sign in with your Administrator account.
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/sign-in?redirect_url=/admin" style={{ background: '#1a5c4a', color: '#fff', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '14.5px', display: 'block' }}>
              Sign In as Store Owner →
            </Link>
            <Link href="/" style={{ background: '#f8f7f5', color: '#666', border: '1px solid #e8e6e1', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 500, fontSize: '13.5px', display: 'block' }}>
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Complete Sets', href: '/admin/bundles', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Inquiries', href: '/admin/inquiries', icon: Mail },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none',
              color: '#fff', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s',
              fontSize: '14px', fontWeight: 500
            }}
          >
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
