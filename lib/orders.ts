import fs from 'fs/promises';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export async function saveOrder(order: SavedOrder): Promise<void> {
  try {
    // Ensure data directory exists
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }

    // Read existing orders
    let orders: SavedOrder[] = [];
    try {
      const raw = await fs.readFile(ORDERS_FILE, 'utf8');
      orders = JSON.parse(raw);
    } catch {
      orders = [];
    }

    orders.push(order);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    // Log but do not throw — order save failure must not fail the customer transaction
    console.error('[saveOrder] Failed to write order to disk:', err);
  }
}

export async function getAllOrders(): Promise<SavedOrder[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function generateOrderId(): string {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}
