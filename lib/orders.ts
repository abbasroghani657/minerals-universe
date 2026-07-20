import prisma from './prisma';

export interface SavedOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export async function saveOrder(order: SavedOrder): Promise<void> {
  try {
    await prisma.order.create({
      data: {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: new Date(order.createdAt),
        items: {
          create: order.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });
  } catch (err) {
    console.error('[saveOrder] Failed to save order to MySQL:', err);
  }
}

export async function getAllOrders(): Promise<SavedOrder[]> {
  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return dbOrders.map(o => ({
      id: o.id,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      shippingAddress: o.shippingAddress,
      total: Number(o.total),
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price)
      }))
    }));
  } catch (err) {
    console.error('[getAllOrders] Failed to get orders from MySQL:', err);
    return [];
  }
}

export function generateOrderId(): string {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}
