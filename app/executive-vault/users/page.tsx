'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  Users, UserCheck, Shield, Clock, Search, Download, 
  RefreshCw, Copy, Check, ChevronRight, AlertCircle,
  ShieldCheck, ShieldAlert, X, Loader2
} from 'lucide-react';
import { UserRecord, UserStats } from './types';
import UserDetailsDrawer from './UserDetailsDrawer';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalUsers: 0, totalCustomers: 0, totalAdmins: 0, newThisWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Customer' | 'Admin'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'orders' | 'name'>('newest');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [updatingRoleFor, setUpdatingRoleFor] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ user: UserRecord; targetRole: 'Admin' | 'Customer' } | null>(null);

  async function loadUsers(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleOpenRoleModal = (user: UserRecord, targetRole: 'Admin' | 'Customer') => {
    if (user.role === targetRole) return;
    setConfirmModal({ user, targetRole });
  };

  const executeRoleChange = async () => {
    if (!confirmModal) return;
    const { user, targetRole } = confirmModal;

    setUpdatingRoleFor(user.email);
    setActionMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, role: targetRole })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ 
          text: `Privileges Updated: ${user.name} (${user.email}) is now assigned as ${targetRole}.`, 
          type: 'success' 
        });
        setUsers(prev => prev.map(u => u.email === user.email ? { ...u, role: targetRole } : u));
        if (selectedUser?.email === user.email) {
          setSelectedUser(prev => prev ? { ...prev, role: targetRole } : null);
        }
        setStats(prev => ({
          ...prev,
          totalCustomers: targetRole === 'Customer' ? prev.totalCustomers + 1 : Math.max(0, prev.totalCustomers - 1),
          totalAdmins: targetRole === 'Admin' ? prev.totalAdmins + 1 : Math.max(0, prev.totalAdmins - 1)
        }));
        setConfirmModal(null);
      } else {
        setActionMessage({ text: data.error || 'Failed to update account role.', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'An error occurred while updating permissions.', type: 'error' });
    } finally {
      setUpdatingRoleFor(null);
      setTimeout(() => setActionMessage(null), 6000);
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) return;
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Email Verified', 'Created At', 'Last Sign In', 'Orders Count', 'Total Spent (USD)'];
    const rows = filteredUsers.map(u => [
      `"${u.id}"`, `"${u.name.replace(/"/g, '""')}"`, `"${u.email}"`, `"${u.role}"`,
      u.isEmailVerified ? 'Yes' : 'No', `"${new Date(u.createdAt).toLocaleString()}"`,
      u.lastSignInAt ? `"${new Date(u.lastSignInAt).toLocaleString()}"` : 'Never',
      u.ordersCount, u.totalSpent
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `minerals_universe_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'orders') return b.ordersCount - a.ordersCount || b.totalSpent - a.totalSpent;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [users, searchQuery, roleFilter, sortBy]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffHr = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
      if (diffHr < 1) return 'Just now';
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return isoString; }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#1a5c4a', fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>
              User &amp; Customer Accounts
            </h1>
            <span style={{ background: '#eaf3f0', color: '#1a5c4a', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
              Live Tracking
            </span>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Track registered client accounts, sign-up timestamps, orders, and administrative permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => loadUsers(true)} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fff', border: '1px solid #dcd7ce', borderRadius: '6px', color: '#1a5c4a', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={exportToCSV} disabled={users.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#1a5c4a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {actionMessage && (
        <div style={{ padding: '14px 20px', borderRadius: '8px', marginBottom: '24px', background: actionMessage.type === 'success' ? '#eaf8f1' : '#fdf2f2', border: actionMessage.type === 'success' ? '1px solid #b7e4cf' : '1px solid #f8d7da', color: actionMessage.type === 'success' ? '#155724' : '#721c24', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {actionMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {actionMessage.text}
        </div>
      )}

      {/* 4 Executive KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e8e6e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>Total Registered</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eaf3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a' }}><Users size={20} /></div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a5c4a', lineHeight: 1 }}>{stats.totalUsers}</div>
          <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#888' }}>All authenticated customer &amp; team accounts</p>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e8e6e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>Store Customers</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059' }}><UserCheck size={20} /></div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#222', lineHeight: 1 }}>{stats.totalCustomers}</div>
          <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#888' }}>Registered gemstone buyers worldwide</p>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e8e6e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>Admin Team</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fdf6e7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8860b' }}><Shield size={20} /></div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#b8860b', lineHeight: 1 }}>{stats.totalAdmins}</div>
          <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#888' }}>Full store management access</p>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e8e6e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>New Signups (7d)</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eaf3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a5c4a' }}><Clock size={20} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#1a5c4a', lineHeight: 1 }}>{stats.newThisWeek}</span>
            {stats.newThisWeek > 0 && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28a745' }}></span>}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#888' }}>Accounts joined within the last 7 days</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e6e1', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '6px', border: '1px solid #dcd7ce', outline: 'none', fontSize: '14px', background: '#faf9f7' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', background: '#f5f3ef', padding: '4px', borderRadius: '8px' }}>
            {(['ALL', 'Customer', 'Admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  background: roleFilter === role ? '#fff' : 'transparent',
                  color: roleFilter === role ? '#1a5c4a' : '#666',
                  boxShadow: roleFilter === role ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {role === 'ALL' ? 'All Roles' : `${role}s`}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#777', fontWeight: 500 }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '9px 14px', borderRadius: '6px', border: '1px solid #dcd7ce', fontSize: '13px', color: '#333', background: '#fff', cursor: 'pointer' }}>
              <option value="newest">Newest Joined</option>
              <option value="oldest">Oldest Joined</option>
              <option value="orders">Most Orders</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f0eee9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#777' }}>
          <span>Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> registered accounts</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#1a5c4a', cursor: 'pointer', fontWeight: 600 }}>
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Users Data Table */}
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e6e1', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#1a5c4a', fontWeight: 600 }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
            Loading registered users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Users size={40} color="#bbb" style={{ margin: '0 auto 14px', display: 'block' }} />
            <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 6px' }}>No Users Found</h3>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              {searchQuery ? `No registered user matches "${searchQuery}"` : 'No registered users in this category yet.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#faf9f7', borderBottom: '1px solid #e8e6e1', color: '#555', fontSize: '12.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 24px' }}>User Details</th>
                  <th style={{ padding: '16px 20px' }}>Email Address</th>
                  <th style={{ padding: '16px 20px' }}>Role</th>
                  <th style={{ padding: '16px 20px' }}>Joined Date</th>
                  <th style={{ padding: '16px 20px' }}>Orders</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : 'U';
                  const isAdmin = user.role === 'Admin';
                  const createdDate = new Date(user.createdAt);
                  const isRecent = (Date.now() - createdDate.getTime()) < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={user.email} style={{ borderBottom: '1px solid #f0eee9' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {user.imageUrl ? (
                            <Image src={user.imageUrl} alt={user.name} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isAdmin ? '#fdf3dd' : '#eaf3f0', color: isAdmin ? '#b8860b' : '#1a5c4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                              {initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: '#222', fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {user.name}
                              {isRecent && <span style={{ fontSize: '10.5px', background: '#d4edda', color: '#155724', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>NEW</span>}
                            </div>
                            <div style={{ fontSize: '12px', color: '#888' }}>ID: <span style={{ fontFamily: 'monospace' }}>{user.id.slice(0, 14)}...</span></div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#444', fontWeight: 500 }}>{user.email}</span>
                          <button onClick={() => handleCopyEmail(user.email)} title="Copy Email" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', color: copiedEmail === user.email ? '#28a745' : '#aaa' }}>
                            {copiedEmail === user.email ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <div style={{ fontSize: '11.5px', color: user.isEmailVerified ? '#28a745' : '#888' }}>
                          {user.isEmailVerified ? '✓ Verified Email' : 'Standard'}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '14px', fontSize: '12.5px', fontWeight: 600, background: isAdmin ? '#fdf3dd' : '#eaf3f0', color: isAdmin ? '#946c00' : '#1a5c4a' }}>
                          {isAdmin ? <Shield size={12} /> : <Users size={12} />}
                          {user.role}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ color: '#333', fontWeight: 500 }}>{createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ({formatRelativeTime(user.createdAt)})</div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        {user.ordersCount > 0 ? (
                          <div>
                            <span style={{ fontWeight: 600, color: '#1a5c4a' }}>{user.ordersCount} Orders</span>
                            <div style={{ fontSize: '12px', color: '#666' }}>Total: <strong>${user.totalSpent.toLocaleString()}</strong></div>
                          </div>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '13px' }}>0 Orders</span>
                        )}
                      </td>

                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenRoleModal(user, isAdmin ? 'Customer' : 'Admin')}
                            disabled={updatingRoleFor === user.email}
                            style={{ padding: '6px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1px solid #dcd7ce', background: '#fff', color: isAdmin ? '#721c24' : '#1a5c4a' }}
                          >
                            {updatingRoleFor === user.email ? 'Updating...' : isAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button onClick={() => setSelectedUser(user)} style={{ padding: '6px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1px solid #1a5c4a', background: '#1a5c4a', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Details <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserDetailsDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onRoleChange={handleOpenRoleModal}
        isUpdating={updatingRoleFor === selectedUser?.email}
      />

      {/* Luxury Role Confirmation Modal */}
      {confirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 18, 14, 0.78)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && updatingRoleFor === null) {
              setConfirmModal(null);
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'linear-gradient(180deg, #112d23 0%, #071712 100%)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              borderRadius: '18px',
              padding: '36px 32px',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7), 0 0 35px rgba(197, 160, 89, 0.15)',
              color: '#fff',
              position: 'relative',
              textAlign: 'center'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setConfirmModal(null)}
              disabled={updatingRoleFor !== null}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
            >
              <X size={16} />
            </button>

            {/* Central Security Shield Icon */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: confirmModal.targetRole === 'Admin' ? 'rgba(197, 160, 89, 0.15)' : 'rgba(220, 53, 69, 0.15)',
                border: `1.5px solid ${confirmModal.targetRole === 'Admin' ? 'rgba(197, 160, 89, 0.5)' : 'rgba(220, 53, 69, 0.5)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: confirmModal.targetRole === 'Admin' ? '#c5a059' : '#ff6b6b',
                boxShadow: confirmModal.targetRole === 'Admin' ? '0 0 25px rgba(197, 160, 89, 0.25)' : '0 0 25px rgba(220, 53, 69, 0.25)'
              }}
            >
              {confirmModal.targetRole === 'Admin' ? <ShieldCheck size={36} /> : <ShieldAlert size={36} />}
            </div>

            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                margin: '0 0 8px',
                color: '#fff',
                letterSpacing: '0.5px',
                fontWeight: 700
              }}
            >
              {confirmModal.targetRole === 'Admin' ? 'Grant Administrator Privileges' : 'Revoke Administrator Access'}
            </h3>

            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 24px', lineHeight: 1.5 }}>
              {confirmModal.targetRole === 'Admin' 
                ? 'Elevate this user account with verified Administrator credentials and executive store control.'
                : 'Remove administrative clearance from this account and restore standard Customer access.'}
            </p>

            {/* Target Account Badge */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                textAlign: 'left'
              }}
            >
              {confirmModal.user.imageUrl ? (
                <Image src={confirmModal.user.imageUrl} alt={confirmModal.user.name} width={46} height={46} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
              ) : (
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: confirmModal.targetRole === 'Admin' ? '#c5a059' : '#3a4b44', color: '#071510', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
                  {(confirmModal.user.name || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {confirmModal.user.name}
                </div>
                <div style={{ fontSize: '13px', color: '#c5a059', wordBreak: 'break-all' }}>
                  {confirmModal.user.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '11.5px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Current: <strong>{confirmModal.user.role}</strong></span>
                  <span style={{ color: confirmModal.targetRole === 'Admin' ? '#70e0a5' : '#ff8787', fontWeight: 700 }}>
                    ➔ Target: {confirmModal.targetRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div
              style={{
                background: 'rgba(197, 160, 89, 0.08)',
                borderLeft: '3px solid #c5a059',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.82)',
                lineHeight: 1.5,
                textAlign: 'left',
                marginBottom: '26px'
              }}
            >
              {confirmModal.targetRole === 'Admin' ? (
                <>
                  <strong style={{ color: '#c5a059' }}>✦ Administrator Permissions:</strong> This user will gain full privileges to manage product listings, pricing, customer orders, client accounts, and store settings.
                </>
              ) : (
                <>
                  <strong style={{ color: '#ff6b6b' }}>✦ Revocation Notice:</strong> This user will immediately lose access to the Admin Portal, sales analytics, customer dossiers, and management APIs.
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={updatingRoleFor !== null}
                style={{
                  flex: 1,
                  padding: '13px 18px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeRoleChange}
                disabled={updatingRoleFor !== null}
                style={{
                  flex: 1.5,
                  padding: '13px 20px',
                  background: confirmModal.targetRole === 'Admin'
                    ? 'linear-gradient(135deg, #c5a059 0%, #dfba73 100%)'
                    : 'linear-gradient(135deg, #dc3545 0%, #bd2130 100%)',
                  border: 'none',
                  color: confirmModal.targetRole === 'Admin' ? '#071510' : '#fff',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: updatingRoleFor !== null ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: confirmModal.targetRole === 'Admin' ? '0 4px 18px rgba(197, 160, 89, 0.35)' : '0 4px 18px rgba(220, 53, 69, 0.35)',
                  transition: 'opacity 0.2s'
                }}
              >
                {updatingRoleFor === confirmModal.user.email ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Applying Role...
                  </>
                ) : confirmModal.targetRole === 'Admin' ? (
                  <>
                    <ShieldCheck size={17} />
                    Confirm &amp; Make Admin
                  </>
                ) : (
                  <>
                    <ShieldAlert size={17} />
                    Confirm Revoke Access
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
