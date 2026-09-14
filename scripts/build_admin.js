const fs = require('fs');

// 1. Update app/admin/layout.tsx
let layout = fs.readFileSync('app/executive-vault/layout.tsx', 'utf8');
if (!layout.includes('Users,')) {
  layout = layout.replace('Settings }', 'Settings, Users }');
}
const ordersTarget = "{ name: 'Orders', href: '/executive-vault/orders', icon: ShoppingCart },";
const usersNav = "{ name: 'Orders', href: '/executive-vault/orders', icon: ShoppingCart },\n    { name: 'Users', href: '/executive-vault/users', icon: Users },";
if (layout.includes(ordersTarget) && !layout.includes('/executive-vault/users')) {
  layout = layout.replace(ordersTarget, usersNav);
  fs.writeFileSync('app/executive-vault/layout.tsx', layout, 'utf8');
  console.log('Admin layout updated with Users!');
} else {
  console.log('Layout already has Users or target not found.');
}
