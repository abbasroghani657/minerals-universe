const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

const mobileStyles = `
/* Mobile Hamburger Menu & Drawer Animations */
.mobile-hamburger-btn {
  display: none;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--teal-dark, #1a5c4a);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}
.mobile-hamburger-btn:hover {
  background: rgba(26, 92, 74, 0.08);
  color: var(--teal, #1a7f74);
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
`;

if (!css.includes('.mobile-hamburger-btn')) {
  css = css.replace('.header-icons {', mobileStyles + '\n.header-icons {');
}

// Inside @media(max-width:900px)
const mediaTarget = 'nav { display: none; }';
const mediaReplacement = 'nav { display: none; }\n  .mobile-hamburger-btn { display: flex !important; }';

if (css.includes(mediaTarget) && !css.includes('.mobile-hamburger-btn { display: flex')) {
  css = css.replace(mediaTarget, mediaReplacement);
}

fs.writeFileSync('app/globals.css', css, 'utf8');
console.log('globals.css updated with mobile navigation styles!');
