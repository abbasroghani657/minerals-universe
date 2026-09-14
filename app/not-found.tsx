import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'radial-gradient(circle at top, #faf7f2 0%, #ffffff 100%)'
    }}>
      <div style={{
        maxWidth: '520px',
        padding: '40px 30px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #eee8df',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          fontSize: '72px',
          fontWeight: 800,
          fontFamily: 'var(--font-playfair), serif',
          color: '#1a5c4a',
          lineHeight: 1,
          marginBottom: '12px'
        }}>
          404
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#222',
          margin: '0 0 12px',
          fontFamily: 'var(--font-playfair), serif'
        }}>
          Page Not Found
        </h1>
        <p style={{
          fontSize: '14.5px',
          color: '#666',
          lineHeight: 1.6,
          margin: '0 0 28px'
        }}>
          The page you are searching for does not exist, has been removed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '11px 22px',
              borderRadius: '8px',
              background: '#1a5c4a',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
          >
            Return to Home
          </Link>
          <Link
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '11px 22px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#1a5c4a',
              border: '1px solid #1a5c4a',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            Explore Gemstones
          </Link>
        </div>
      </div>
    </div>
  );
}
