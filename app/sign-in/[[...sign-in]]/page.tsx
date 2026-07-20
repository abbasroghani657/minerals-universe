import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '24px' }}>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>

      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', border: '1px solid #e8e6e1', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1a5c4a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🔑 Demo Accounts
        </h3>
        
        <div style={{ display: 'grid', gap: '12px', fontSize: '13.5px', color: '#444' }}>
          <div style={{ borderBottom: '1px solid #f0edf8', paddingBottom: '10px' }}>
            <span style={{ fontWeight: 700, color: '#c5a059' }}>Admin Account:</span>
            <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>
              <strong>Email:</strong> admin@mineralsuniverse.com
            </div>
            <div style={{ fontFamily: 'monospace' }}>
              <strong>Password:</strong> AdminPassword123!
            </div>
          </div>
          
          <div>
            <span style={{ fontWeight: 700, color: '#1a5c4a' }}>Customer Account:</span>
            <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>
              <strong>Email:</strong> customer@mineralsuniverse.com
            </div>
            <div style={{ fontFamily: 'monospace' }}>
              <strong>Password:</strong> CustomerPassword123!
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '14px', fontSize: '11px', color: '#666', borderTop: '1px solid #f0edf8', paddingTop: '10px', lineHeight: '1.4' }}>
          💡 These demo credentials represent seeded records in the local MySQL database mapped to roles (`Admin` / `Customer`).
        </div>
      </div>
    </div>
  );
}
