'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { 
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Mail, 
  LogOut, HelpCircle, Settings, Users, Layers, ShieldCheck, KeyRound, ArrowLeft, Loader2,
  Menu, X
} from 'lucide-react';

const ADMIN_EMAILS = [
  'abbasroghani869@gmail.com',
  'abbasroghani657@gmail.com',
  'drtoolofficial@gmail.com',
  '22pwbcs0904@uetpeshawar.edu.pk',
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Zaheer Abbas');
  const [apiChecking, setApiChecking] = useState(true);

  // Passkey unlock state
  const [passkeyInput, setPasskeyInput] = useState('');
  const [isSubmittingPasskey, setIsSubmittingPasskey] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [passkeySuccess, setPasskeySuccess] = useState<string | null>(null);

  // Responsive mobile navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // 1. Direct check from Clerk profile
  const allClerkEmails = (clerkUser?.emailAddresses || []).map(e => e.emailAddress.toLowerCase().trim());
  const isDirectAdmin = allClerkEmails.some(e => ADMIN_EMAILS.includes(e)) || (clerkUser?.publicMetadata as any)?.role === 'Admin';
  const activeEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() || allClerkEmails[0] || null;

  // Set dedicated clean browser tab title for every admin route (no AI hyphens)
  useEffect(() => {
    const titles: Record<string, string> = {
      '/executive-vault': 'Admin Dashboard | Minerals Universe',
      '/executive-vault/products': 'Products | Minerals Universe Admin',
      '/executive-vault/orders': 'Orders & Shipments | Minerals Universe Admin',
      '/executive-vault/inquiries': 'Customer Inquiries | Minerals Universe Admin',
      '/executive-vault/users': 'Customer Management | Minerals Universe Admin',
      '/executive-vault/reviews': 'Reviews Moderation | Minerals Universe Admin',
      '/executive-vault/settings': 'Store Settings | Minerals Universe Admin',
      '/executive-vault/faqs': 'FAQs Management | Minerals Universe Admin',
      '/executive-vault/bundles': 'Complete Sets | Minerals Universe Admin',
    };
    document.title = titles[pathname] || 'Admin Panel | Minerals Universe';
  }, [pathname]);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('/api/auth/role');
        const data = await res.json();
        if (data.success && data.role) {
          setRole(data.role);
          if (data.name) setUserName(data.name);
        }
      } catch (err) {
        console.warn('Non-fatal role check error:', err);
      } finally {
        setApiChecking(false);
      }
    }

    if (isSignedIn) {
      fetchRole();
    } else {
      setApiChecking(false);
    }
  }, [isSignedIn]);

  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      setPasskeyError('Please enter your Master Passkey.');
      return;
    }

    try {
      setIsSubmittingPasskey(true);
      setPasskeyError(null);
      const res = await fetch('/api/auth/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPasskeySuccess('Access granted! Unlocking Admin Portal...');
        setRole('Admin');
        setTimeout(() => {
          router.refresh();
        }, 800);
      } else {
        setPasskeyError(data.error || 'Invalid master passkey.');
      }
    } catch (err: any) {
      setPasskeyError(err.message || 'Verification failed.');
    } finally {
      setIsSubmittingPasskey(false);
    }
  };

  // Loading state while Clerk or initial check initializes (skip if direct admin detected)
  if (!isLoaded || (apiChecking && !isDirectAdmin)) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a1f18', color: '#c5a059', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", gap: '12px' }}>
        <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <span>Verifying Security Clearance...</span>
      </div>
    );
  }

  const hasAdminClearance = isDirectAdmin || role === 'Admin';

  // If user is not authorized, show 404 decoy (or passkey claim if explicit claim=1 param)
  if (!hasAdminClearance) {
    const isClaimMode = typeof window !== 'undefined' && window.location.search.includes('claim=1');
    if (!isClaimMode) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#1a5c4a', margin: '0 0 10px', letterSpacing: '-1px' }}>404</h1>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#222', margin: '0 0 12px' }}>Page Not Found</h2>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '420px', margin: '0 0 24px', lineHeight: 1.5 }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/" style={{ display: 'inline-block', background: '#1a5c4a', color: '#fff', padding: '10px 22px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Back to Home
          </Link>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top, #14352b 0%, #071510 100%)', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '460px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(16px)', textAlign: 'center' }}>
          
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid rgba(197, 160, 89, 0.4)', color: '#c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <KeyRound size={26} />
          </div>

          <h2 style={{ color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', margin: '0 0 8px', letterSpacing: '0.5px' }}>
            Store Owner Authorization
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '13.5px', margin: '0 0 24px', lineHeight: 1.5 }}>
            This administrative control system is strictly restricted to verified owners of Minerals Universe.
          </p>

          {!isSignedIn ? (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '16px' }}>
                Please sign in with your store owner Google account.
              </p>
              <Link 
                href="/sign-in?redirect_url=/executive-vault" 
                style={{ 
                  display: 'inline-block', 
                  background: 'linear-gradient(135deg, #c5a059 0%, #dfba73 100%)', 
                  color: '#071510', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  fontSize: '14px', 
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)'
                }}
              >
                Sign In as Store Owner →
              </Link>
            </div>
          ) : (
            <>
              {activeEmail && (
                <div style={{ background: 'rgba(26, 92, 74, 0.25)', border: '1px solid rgba(197, 160, 89, 0.25)', borderRadius: '8px', padding: '12px', marginBottom: '22px', fontSize: '13px', color: '#e0d8c3', textAlign: 'left' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Active Account</div>
                  <strong style={{ color: '#fff', wordBreak: 'break-all' }}>{activeEmail}</strong>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>Enter your master owner passkey below to unlock Administrator access:</div>
                </div>
              )}

              <form onSubmit={handleClaimAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Master Owner Passkey
                  </label>
                  <input 
                    type="password"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter secret passkey"
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#c5a059')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                  />
                </div>

                {passkeyError && (
                  <div style={{ color: '#ff6b6b', fontSize: '12.5px', background: 'rgba(255, 107, 107, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                    {passkeyError}
                  </div>
                )}

                {passkeySuccess && (
                  <div style={{ color: '#51cf66', fontSize: '12.5px', background: 'rgba(81, 207, 102, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(81, 207, 102, 0.2)' }}>
                    {passkeySuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingPasskey}
                  style={{
                    background: 'linear-gradient(135deg, #c5a059 0%, #dfba73 100%)',
                    color: '#071510',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: isSubmittingPasskey ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)',
                    transition: 'opacity 0.2s',
                    marginTop: '4px',
                  }}
                >
                  {isSubmittingPasskey ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Unlock Admin Access
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <Link 
              href="/" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c5a059')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
            >
              <ArrowLeft size={14} /> Return to Public Storefront
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/executive-vault', icon: LayoutDashboard },
    { name: 'Products', href: '/executive-vault/products', icon: Package },
    { name: 'Complete Sets', href: '/executive-vault/bundles', icon: Layers },
    { name: 'Orders', href: '/executive-vault/orders', icon: ShoppingCart },
    { name: 'Users', href: '/executive-vault/users', icon: Users },
    { name: 'Reviews', href: '/executive-vault/reviews', icon: MessageSquare },
    { name: 'Inquiries', href: '/executive-vault/inquiries', icon: Mail },
    { name: 'FAQs', href: '/executive-vault/faqs', icon: HelpCircle },
    { name: 'Settings', href: '/executive-vault/settings', icon: Settings },
  ];

  return (
    <div className="admin-root-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 280px !important;
            z-index: 1050 !important;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
            box-shadow: 4px 0 25px rgba(0,0,0,0.3) !important;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-backdrop {
            display: block !important;
          }
          .admin-topbar {
            padding: 12px 16px !important;
          }
          .admin-content-inner {
            padding: 16px 14px 60px !important;
          }
          .admin-mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (min-width: 901px) {
          .admin-mobile-menu-btn {
            display: none !important;
          }
          .admin-backdrop {
            display: none !important;
          }
        }
      `}} />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="admin-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 1040,
          }}
        />
      )}

      {/* Sidebar (Desktop persistent, Mobile slide-over drawer) */}
      <div className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ width: '260px', background: '#1a5c4a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', margin: 0, color: '#c5a059' }}>
              Minerals Universe
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Executive Vault
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="admin-mobile-menu-btn"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/executive-vault');
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 24px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  textDecoration: 'none',
                  borderLeft: isActive ? '4px solid #c5a059' : '4px solid transparent',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14.5px'
                }}
              >
                <Icon size={18} color={isActive ? '#c5a059' : 'currentColor'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px',
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '13px', marginBottom: '8px'
            }}
          >
            <ArrowLeft size={15} /> Storefront
          </Link>
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: 'none',
              color: '#fff', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s',
              fontSize: '13px', fontWeight: 500
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
        {/* Topbar */}
        <div className="admin-topbar" style={{ background: '#fff', padding: '18px 36px', borderBottom: '1px solid #e8e6e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="admin-mobile-menu-btn"
              style={{
                background: '#f0eee9',
                border: 'none',
                color: '#1a5c4a',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#1a5c4a', fontWeight: 700, letterSpacing: '-0.3px' }}>
              {navItems.find(i => i.href === pathname)?.name || 'Executive Vault'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: '#c5a059', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
              {(userName || 'ZA').substring(0, 2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#333', lineHeight: 1.2 }}>{userName || 'Zaheer Abbas'}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Owner</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-content-inner" style={{ padding: '32px 36px', overflowY: 'auto', flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
