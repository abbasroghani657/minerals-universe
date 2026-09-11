const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

// Replace the frosted glass card block with clean, box-free luxury typography
const oldCardBlock = `/* Frosted Glass Luxury Capsule for Slide Content (Prevents any text clash) */
.slide-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 26px 36px;
  max-width: 760px;
  background: rgba(6, 20, 18, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45);
  margin-bottom: 48px !important;
}`;

const newCleanTypography = `/* Pure Luxury Box-Free Hero Typography (Direct on photo, zero card container) */
.slide-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 20px;
  max-width: 880px;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  margin: 0 auto 30px !important;
}`;

if (css.includes(oldCardBlock)) {
  css = css.replace(oldCardBlock, newCleanTypography);
  console.log('Successfully replaced oldCardBlock!');
} else {
  console.log('oldCardBlock not found directly, performing regex replacement');
  css = css.replace(/\.slide-content\s*\{[^}]*background:\s*rgba\(6,\s*20,\s*18,\s*0\.62\)[^}]*\}/s, newCleanTypography);
}

// Enhance typography shadows so text is ultra-crisp without any card
const oldTypography = `.slide-tag {
  color: #9ee4de;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.slide-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(24px, 3.8vw, 48px) !important;
  color: #fff;
  line-height: 1.18;
  margin-bottom: 10px !important;
}
.slide-content h1 span {
  color: #9ee4de;
}
.slide-content p {
  font-size: clamp(13px, 1.3vw, 15px) !important;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 20px !important;
  line-height: 1.6;
}`;

const newTypography = `.slide-tag {
  color: #c5a059 !important;
  font-size: 13px !important;
  letter-spacing: 4px !important;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 14px !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7);
}
.slide-content h1 {
  font-family: 'Cormorant Garamond', 'Playfair Display', serif;
  font-size: clamp(34px, 5.5vw, 64px) !important;
  font-weight: 600;
  color: #ffffff !important;
  line-height: 1.15 !important;
  margin-bottom: 18px !important;
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.9), 0 1px 6px rgba(0, 0, 0, 0.95);
  letter-spacing: -0.5px;
}
.slide-content h1 span {
  color: #9ee4de !important;
  font-style: italic;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9);
}
.slide-content p {
  font-size: clamp(15px, 1.5vw, 18px) !important;
  color: #ffffff !important;
  margin: 0 auto 30px !important;
  max-width: 680px;
  line-height: 1.65 !important;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 0.95);
  font-weight: 400;
}
.slide-content .btn-teal {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(26, 92, 74, 0.4);
}`;

if (css.includes(oldTypography)) {
  css = css.replace(oldTypography, newTypography);
  console.log('Successfully replaced oldTypography!');
} else {
  console.log('oldTypography exact match not found, appending clean typography');
  css += '\n' + newTypography;
}

// Ensure smooth subtle vignette overlay
css = css.replace(
  /\.slide-overlay\s*\{[^}]*\}/s,
  `.slide-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 80%, rgba(0, 0, 0, 0.65) 100%), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.5) 100%);
  z-index: 3;
  pointer-events: none;
}`
);

fs.writeFileSync('app/globals.css', css, 'utf8');
console.log('globals.css updated: Card box completely eliminated!');
