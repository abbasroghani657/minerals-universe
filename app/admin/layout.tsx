'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { 
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Mail, 
  LogOut, HelpCircle, Settings, Users, Layers, ShieldCheck, KeyRound, ArrowLeft, Loader2
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

  // 1. Direct check from Clerk profile
  const allClerkEmails = (clerkUser?.emailAddresses || []).map(e => e.emailAddress.toLowerCase().trim());
  const isDirectAdmin = allClerkEmails.some(e => ADMIN_EMAILS.includes(e));
  const activeEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() || allClerkEmails[0] || null;

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

  // If user is not authorized, show authorization card
  if (!hasAdminClearance) {
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
                href="/sign-in?redirect_url=/admin" 
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
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px',
              color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '13.5px', marginBottom: '8px'
            }}
          >
            <ArrowLeft size={15} /> Storefront
          </Link>
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
          <h1 style={{ margin: 0, fontSize: '20px', color: '#1a5c4a', fontWeight: 600 }}>
            {navItems.find(i => i.href === pathname)?.name || 'Admin Overview'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#c5a059', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>
              {(userName || 'ZA').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>{userName || 'Zaheer Abbas'}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Administrator ({activeEmail || 'Owner'})</p>
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
