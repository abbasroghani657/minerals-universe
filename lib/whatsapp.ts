export interface OrderDetails {
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  customerName: string;
  phone: string;
  address: string;
}

const WHATSAPP_NUMBER = '923001581210';

export function buildWhatsAppURL(order: OrderDetails): string {
  let message = `New Order Confirmed!\n`;
  message += `Order ID: #${order.orderId}\n`;
  message += `Items:\n`;
  
  order.items.forEach(item => {
    message += `- ${item.name} x${item.quantity} — PKR ${(item.price * item.quantity).toLocaleString()}\n`;
  });
  
  message += `Total: PKR ${order.total.toLocaleString()}\n`;
  message += `Customer: ${order.customerName}\n`;
  message += `Phone: ${order.phone}\n`;
  message += `Address: ${order.address}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
