const fs = require('fs');

// 1. Update app/admin/layout.tsx
let layout = fs.readFileSync('app/admin/layout.tsx', 'utf8');
if (!layout.includes('Users,')) {
  layout = layout.replace('Settings }', 'Settings, Users }');
}
const ordersTarget = "{ name: 'Orders', href: '/admin/orders', icon: ShoppingCart },";
const usersNav = "{ name: 'Orders', href: '/admin/orders', icon: ShoppingCart },\n    { name: 'Users', href: '/admin/users', icon: Users },";
if (layout.includes(ordersTarget) && !layout.includes('/admin/users')) {
  layout = layout.replace(ordersTarget, usersNav);
  fs.writeFileSync('app/admin/layout.tsx', layout, 'utf8');
  console.log('Admin layout updated with Users!');
} else {
  console.log('Layout already has Users or target not found.');
}
