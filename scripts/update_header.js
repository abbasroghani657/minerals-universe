const fs = require('fs');
let header = fs.readFileSync('components/Header.tsx', 'utf8');

// 1. Import Menu & MobileNavDrawer
if (!header.includes('MobileNavDrawer')) {
  header = header.replace(
    "import { Search, Heart, ShoppingCart } from 'lucide-react';",
    "import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';\nimport MobileNavDrawer from '@/components/MobileNavDrawer';"
  );
}

// 2. Add state
if (!header.includes('mobileMenuOpen')) {
  header = header.replace(
    "const [searchOpen, setSearchOpen] = useState(false);",
    "const [searchOpen, setSearchOpen] = useState(false);\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"
  );
}

// 3. Add hamburger button in header-icons
const hamburgerBtn = `            {/* Mobile Hamburger Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>\n`;

if (!header.includes('mobile-hamburger-btn')) {
  header = header.replace(
    '<div className="header-icons">',
    '<div className="header-icons">\n' + hamburgerBtn
  );
}

// 4. Render MobileNavDrawer component
const drawerRender = `      {/* Mobile Slide-Over Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        cartCount={cartCount}
        wishlistCount={wishlist.size}
        currency={currency}
        setCurrency={setCurrency}
        isSignedIn={isSignedIn}
      />\n`;

if (!header.includes('<MobileNavDrawer')) {
  header = header.replace(
    '{/* Search Modal */}',
    drawerRender + '\n      {/* Search Modal */}'
  );
}

fs.writeFileSync('components/Header.tsx', header, 'utf8');
console.log('Header successfully updated with Mobile Drawer!');
