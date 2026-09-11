'use client';

import Image from 'next/image';
import { Users, X, Mail } from 'lucide-react';
import { UserRecord } from './types';

interface Props {
  user: UserRecord | null;
  onClose: () => void;
  onRoleChange: (user: UserRecord, newRole: 'Admin' | 'Customer') => void;
  isUpdating: boolean;
}

export default function UserDetailsDrawer({ user, onClose, onRoleChange, isUpdating }: Props) {
  if (!user) return null;

  const isAdmin = user.role === 'Admin';
  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : 'U';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(3px)'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: '480px', background: '#fff', height: '100%',
        overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f0eee9', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#1a5c4a" />
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1a5c4a', fontWeight: 700 }}>Client Account Dossier</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <div style={{ textAlign: 'center', padding: '24px 16px', background: '#faf9f7', borderRadius: '10px', marginBottom: '24px', border: '1px solid #e8e6e1' }}>
          {user.imageUrl ? (
            <Image src={user.imageUrl} alt={user.name} width={72} height={72} style={{ borderRadius: '50%', margin: '0 auto 12px', display: 'block' }} unoptimized />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#1a5c4a', color: '#c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, margin: '0 auto 12px' }}>
              {initials}
            </div>
          )}
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#222', fontWeight: 700 }}>{user.name}</h2>
          <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#666' }}>{user.email}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <span style={{
              background: isAdmin ? '#fdf3dd' : '#eaf3f0',
              color: isAdmin ? '#946c00' : '#1a5c4a',
              padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700
            }}>
              {user.role}
            </span>
            <span style={{ background: '#f0eee9', color: '#555', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
              {user.isEmailVerified ? '✓ Verified Email' : 'Standard'}
            </span>
          </div>
        </div>

        {/* Meta Items */}
        <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
          <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #eee' }}>
            <span style={{ fontSize: '11.5px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Registration Timestamp</span>
            <span style={{ fontSize: '14px', color: '#222', fontWeight: 600 }}>
              {new Date(user.createdAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' })}
            </span>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #eee' }}>
            <span style={{ fontSize: '11.5px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Last Sign-in Activity</span>
            <span style={{ fontSize: '14px', color: '#222', fontWeight: 600 }}>
              {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'Not tracked via Clerk session'}
            </span>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #eee' }}>
            <span style={{ fontSize: '11.5px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>User ID</span>
            <span style={{ fontSize: '13px', color: '#444', fontFamily: 'monospace', wordBreak: 'break-all' }}>{user.id}</span>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #eee', background: '#f8fbf9' }}>
            <span style={{ fontSize: '11.5px', color: '#1a5c4a', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Orders & Lifetime Value</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '15px', color: '#333' }}>Total Orders: <strong>{user.ordersCount}</strong></span>
              <span style={{ fontSize: '16px', color: '#1a5c4a', fontWeight: 700 }}>${user.totalSpent.toLocaleString()} USD</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href={`mailto:${user.email}?subject=Minerals Universe - Exclusive Gemstone Inquiry`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px', background: '#1a5c4a', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '14px', textAlign: 'center'
            }}
          >
            <Mail size={16} /> Send Direct VIP Email
          </a>

          <button
            onClick={() => onRoleChange(user, isAdmin ? 'Customer' : 'Admin')}
            disabled={isUpdating}
            style={{
              padding: '12px', background: '#fff', border: '1px solid #dcd7ce',
              color: isAdmin ? '#c94438' : '#1a5c4a',
              borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
            }}
          >
            {isUpdating ? 'Updating...' : isAdmin ? 'Revoke Administrator Access' : 'Promote to Administrator'}
          </button>
        </div>
      </div>
    </div>
  );
}
