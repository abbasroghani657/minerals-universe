export interface UserRecord {
  id: string;
  dbId: string;
  email: string;
  name: string;
  imageUrl: string | null;
  role: 'Admin' | 'Customer';
  isEmailVerified: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export interface UserStats {
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  newThisWeek: number;
}
