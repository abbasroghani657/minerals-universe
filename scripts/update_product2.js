const fs = require('fs');
let code = fs.readFileSync('app/product/[id]/page.tsx', 'utf8');

const targetOld = `          <div className="perks-row">
            <div className="perk">
              <ShieldCheck size={28} />
              <span>{product.cert}</span>
            </div>
            <div className="perk">
              <Truck size={28} />
              <span>Free Insured Shipping</span>
            </div>
            <div className="perk">
              <PackageCheck size={28} />
              <span>Secure Packaging</span>
            </div>
          </div>`;

const newWhatsAppAndTrust = `          {/* WhatsApp VIP Inquire & Daylight Video Request */}
          <a
            href={\`https://wa.me/923001581210?text=\${encodeURIComponent(
              \`Hello Minerals Universe, I am interested in inquiring about this gemstone specimen:\\n\\n\` +
              \`💎 Item: \${product.name}\\n\` +
              \`📂 Category: \${product.cat}\\n\` +
              \`💰 Price: \${formatPrice(product.priceNum, currency, exchangeRates)}\\n\\n\` +
              \`Could you please share daylight 4K videos, certificate details, and international shipping options?\`
            )}\`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '16px 24px',
              background: '#25D366',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '0.5px',
              margin: '0 0 24px 0',
              boxShadow: '0 4px 16px rgba(37,211,102,0.25)',
              transition: 'all 0.3s'
            }}
          >
            <FaWhatsapp size={22} /> Inquire / Request 4K Video via WhatsApp
          </a>

          {/* 4 Luxury International Trust Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #e8e6e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#faf9f7', borderRadius: '6px' }}>
              <ShieldCheck size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', display: 'block' }}>100% Certified Natural</span>
                <span style={{ fontSize: '11px', color: '#777' }}>{product.cert || 'Authenticity Guaranteed'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#faf9f7', borderRadius: '6px' }}>
              <Truck size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', display: 'block' }}>Worldwide Express</span>
                <span style={{ fontSize: '11px', color: '#777' }}>DHL / FedEx Insured</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#faf9f7', borderRadius: '6px' }}>
              <PackageCheck size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', display: 'block' }}>Tamper-Proof Box</span>
                <span style={{ fontSize: '11px', color: '#777' }}>Collector Packaging</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#faf9f7', borderRadius: '6px' }}>
              <Award size={24} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', display: 'block' }}>Mine-Direct Source</span>
                <span style={{ fontSize: '11px', color: '#777' }}>Peshawar / Northern Mines</span>
              </div>
            </div>
          </div>`;

if (code.includes(targetOld)) {
  code = code.replace(targetOld, newWhatsAppAndTrust);
  fs.writeFileSync('app/product/[id]/page.tsx', code, 'utf8');
  console.log('Successfully added WhatsApp button & 4 trust badges to product page!');
} else {
  console.error('Target old block not found!');
}
