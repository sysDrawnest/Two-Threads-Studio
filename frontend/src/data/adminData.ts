// Mock data for Admin Dashboard

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  difficulty: string;
  collection: string;
  image: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  totalSpent: number;
  membership: 'none' | 'artisan' | 'master';
  avatar: string;
}

export interface AdminTutorial {
  id: string;
  title: string;
  instructor: string;
  difficulty: string;
  duration: string;
  enrollments: number;
  status: 'published' | 'draft';
  thumbnail: string;
}

export interface AdminReview {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'flagged';
}

export const mockAdminProducts: AdminProduct[] = [
  { id: 'p1', name: 'Botanical Meadow Kit', category: 'Embroidery Kit', price: 68, inventory: 42, status: 'active', difficulty: 'Beginner', collection: 'Botanical', image: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=200&auto=format&fit=crop' },
  { id: 'p2', name: 'Cottage Garden Hoop', category: 'Embroidery Kit', price: 82, inventory: 18, status: 'active', difficulty: 'Intermediate', collection: 'Cottage', image: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=200&auto=format&fit=crop' },
  { id: 'p3', name: 'Heritage Linen Wall Hanging', category: 'Home Decor', price: 124, inventory: 7, status: 'active', difficulty: 'Advanced', collection: 'Linen', image: 'https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=200&auto=format&fit=crop' },
  { id: 'p4', name: 'Wildflower Thread Painting', category: 'Pattern', price: 24, inventory: 200, status: 'active', difficulty: 'Intermediate', collection: 'Botanical', image: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=200&auto=format&fit=crop' },
  { id: 'p5', name: 'Seasonal Harvest Wreath Kit', category: 'Embroidery Kit', price: 95, inventory: 0, status: 'draft', difficulty: 'Advanced', collection: 'Seasonal', image: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=200&auto=format&fit=crop' },
  { id: 'p6', name: 'Celestial Silk Pattern', category: 'Pattern', price: 18, inventory: 500, status: 'active', difficulty: 'Beginner', collection: 'Linen', image: 'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=200&auto=format&fit=crop' },
];

export const mockAdminOrders: AdminOrder[] = [
  { id: '#TT-10041', customer: 'Julia Hampton', email: 'julia@example.com', amount: 150, date: '2026-06-01', status: 'delivered', items: 2 },
  { id: '#TT-10042', customer: 'Aria Chen', email: 'aria@example.com', amount: 68, date: '2026-06-02', status: 'shipped', items: 1 },
  { id: '#TT-10043', customer: 'Sofia Martinez', email: 'sofia@example.com', amount: 214, date: '2026-06-02', status: 'processing', items: 3 },
  { id: '#TT-10044', customer: 'Lena Weber', email: 'lena@example.com', amount: 82, date: '2026-06-03', status: 'pending', items: 1 },
  { id: '#TT-10045', customer: 'Mila Nkosi', email: 'mila@example.com', amount: 95, date: '2026-06-03', status: 'cancelled', items: 1 },
  { id: '#TT-10046', customer: 'Priya Sharma', email: 'priya@example.com', amount: 42, date: '2026-06-03', status: 'pending', items: 2 },
  { id: '#TT-10047', customer: 'Chloe Dupont', email: 'chloe@example.com', amount: 186, date: '2026-06-03', status: 'processing', items: 2 },
];

export const mockAdminCustomers: AdminCustomer[] = [
  { id: 'c1', name: 'Julia Hampton', email: 'julia@example.com', joined: '2024-01-15', orders: 12, totalSpent: 960, membership: 'master', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=60&auto=format&fit=crop' },
  { id: 'c2', name: 'Aria Chen', email: 'aria@example.com', joined: '2024-03-22', orders: 5, totalSpent: 420, membership: 'artisan', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=60&auto=format&fit=crop' },
  { id: 'c3', name: 'Sofia Martinez', email: 'sofia@example.com', joined: '2024-06-10', orders: 8, totalSpent: 680, membership: 'master', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop' },
  { id: 'c4', name: 'Lena Weber', email: 'lena@example.com', joined: '2025-01-05', orders: 2, totalSpent: 150, membership: 'none', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=60&auto=format&fit=crop' },
  { id: 'c5', name: 'Mila Nkosi', email: 'mila@example.com', joined: '2025-02-18', orders: 3, totalSpent: 214, membership: 'artisan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop' },
];

export const mockAdminTutorials: AdminTutorial[] = [
  { id: 't1', title: 'Botanical Thread Painting', instructor: 'Elara Vance', difficulty: 'Intermediate', duration: '4h 30m', enrollments: 1240, status: 'published', thumbnail: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=200&auto=format&fit=crop' },
  { id: 't2', title: 'Beginner Hoop Essentials', instructor: 'Sophie Laurent', difficulty: 'Beginner', duration: '2h 15m', enrollments: 2860, status: 'published', thumbnail: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=200&auto=format&fit=crop' },
  { id: 't3', title: 'Advanced Silk Shading', instructor: 'Yuki Tanaka', difficulty: 'Advanced', duration: '6h 00m', enrollments: 480, status: 'published', thumbnail: 'https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=200&auto=format&fit=crop' },
  { id: 't4', title: 'Heritage Stitch Patterns', instructor: 'Elara Vance', difficulty: 'Intermediate', duration: '3h 45m', enrollments: 0, status: 'draft', thumbnail: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=200&auto=format&fit=crop' },
];

export const mockAdminReviews: AdminReview[] = [
  { id: 'r1', customer: 'Julia H.', product: 'Botanical Meadow Kit', rating: 5, comment: 'Absolutely stunning kit! The linen quality is exceptional.', date: '2026-05-28', status: 'published' },
  { id: 'r2', customer: 'Aria C.', product: 'Cottage Garden Hoop', rating: 4, comment: 'Beautiful design, though some threads were slightly tangled.', date: '2026-05-30', status: 'published' },
  { id: 'r3', customer: 'Anonymous', product: 'Heritage Linen Wall Hanging', rating: 1, comment: 'Spam content here...', date: '2026-06-01', status: 'flagged' },
  { id: 'r4', customer: 'Sofia M.', product: 'Wildflower Thread Painting', rating: 5, comment: 'Perfect for an intermediate crafter. Will buy again!', date: '2026-06-02', status: 'pending' },
];

// Dashboard stats
export const dashboardStats = {
  totalRevenue: 48620,
  revenueGrowth: 12.4,
  totalOrders: 284,
  ordersGrowth: 8.2,
  totalCustomers: 1847,
  customersGrowth: 5.7,
  totalProducts: 48,
  activeMembers: 623,
  membersGrowth: 18.9,
  tutorialEnrollments: 5240,
};

// Revenue chart data (last 7 months)
export const revenueChartData = [
  { month: 'Dec', revenue: 3200 },
  { month: 'Jan', revenue: 4100 },
  { month: 'Feb', revenue: 3800 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 4900 },
  { month: 'May', revenue: 6800 },
  { month: 'Jun', revenue: 7400 },
];

export const popularProducts = [
  { name: 'Botanical Meadow Kit', sales: 142, revenue: 9656 },
  { name: 'Cottage Garden Hoop', sales: 98, revenue: 8036 },
  { name: 'Heritage Linen Wall Hanging', sales: 54, revenue: 6696 },
  { name: 'Wildflower Thread Painting', sales: 210, revenue: 5040 },
];
