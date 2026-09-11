const fs = require('fs');
let code = fs.readFileSync('app/product/[id]/page.tsx', 'utf8');

// 1. Add FaWhatsapp and Award imports
if (!code.includes('FaWhatsapp')) {
  code = code.replace(
    "import { ShieldCheck, Truck, PackageCheck, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';",
    "import { ShieldCheck, Truck, PackageCheck, ArrowLeft, Heart, ShoppingBag, Award } from 'lucide-react';\nimport { FaWhatsapp } from 'react-icons/fa';"
  );
}

// 2. Add WhatsApp button and 4-point trust grid
const oldPerksStart = '<div className="perks-row">';
const oldPerksEnd = '</div>\n        </div>\n      </div>';

const whatsappAndPerks = `          {/* WhatsApp VIP Inquire & Daylight Video Button */}
          <a
            href={\`https://wa.me/923001581210?text=\${encodeURIComponent(
              \`Hello Minerals Universe, I am interested in this gemstone specimen:\\n\\n\` +
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
              marginBottom: '24px',
              boxShadow: '0 4px 16px rgba(37,211,102,0.25)',
              transition: 'all 0.3s'
            }}
          >
            <FaWhatsapp size={22} /> Inquire / Request 4K Video via WhatsApp
          </a>

          {/* 4 Luxury International Trust Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e8e6e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#faf9f7', borderRadius: '6px' }}>
              <ShieldCheck size={22} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#333', display: 'block' }}>100% Certified Natural</span>
                <span style={{ fontSize: '11px', color: '#777' }}>{product.cert || 'Authenticity Guaranteed'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#faf9f7', borderRadius: '6px' }}>
              <Truck size={22} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#333', display: 'block' }}>Worldwide Express</span>
                <span style={{ fontSize: '11px', color: '#777' }}>DHL / FedEx Insured</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#faf9f7', borderRadius: '6px' }}>
              <PackageCheck size={22} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#333', display: 'block' }}>Tamper-Proof Box</span>
                <span style={{ fontSize: '11px', color: '#777' }}>Collector Packaging</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#faf9f7', borderRadius: '6px' }}>
              <Award size={22} color="#c5a059" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#333', display: 'block' }}>Mine-Direct Source</span>
                <span style={{ fontSize: '11px', color: '#777' }}>Peshawar / Northern Mines</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;

// Replace old perks
const idx1 = code.indexOf(oldPerksStart);
const idx2 = code.indexOf(oldPerksEnd);
if (idx1 !== -1 && idx2 !== -1) {
  code = code.slice(0, idx1) + whatsappAndPerks + code.slice(idx2 + oldPerksEnd.length);
  console.log('Replaced perks row with WhatsApp and 4-point trust badges!');
} else {
  console.log('Perks markers not found, attempting alternate replace');
}

// 3. Add Google Product JSON-LD Schema
const schemaSnippet = `
      {/* Google SEO JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": [product.img],
            "description": product.desc,
            "sku": \`MU-\${product.id}\`,
            "brand": {
              "@type": "Brand",
              "name": "Minerals Universe"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.priceNum,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Minerals Universe"
              }
            }
          })
        }}
      />
`;

if (!code.includes('application/ld+json')) {
  code = code.replace('<div className="tabs-container">', schemaSnippet + '\n      <div className="tabs-container">');
  console.log('Added Google Product JSON-LD schema!');
}

fs.writeFileSync('app/product/[id]/page.tsx', code, 'utf8');
console.log('Successfully updated product page!');
