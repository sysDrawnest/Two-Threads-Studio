import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Package, 
  Plus, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  Star,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminData';
import { 
  AdminSkeleton, 
  AdminBadge, 
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow
} from '../../components/admin/ui';

// AnimatedNumber component
const AnimatedNumber: React.FC<{ value: string | number }> = ({ value }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="font-sans font-bold tracking-tight text-[#1f1610] dark:text-[#ffffff]"
    >
      {value}
    </motion.span>
  );
};

// Custom inline sparkline helper
const MiniSparkline: React.FC<{ type: 'up' | 'down' | 'neutral' }> = ({ type }) => {
  const points = type === 'up' 
    ? '0,14 6,12 12,15 18,10 24,12 30,5 36,8 42,2 48,0' 
    : type === 'down'
    ? '0,2 6,8 12,5 18,12 24,9 30,15 36,12 42,16 48,18'
    : '0,10 6,11 12,9 18,10 24,9 30,10 36,9 42,10 48,10';
  const color = type === 'up' ? '#2e7d32' : type === 'down' ? '#c62828' : '#7f6d50';
  return (
    <svg className="w-16 h-8 text-current" viewBox="0 0 50 20" fill="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// Simulated real-time events logs
const initialEvents = [
  { id: 1, type: 'order', title: 'Order #TTS10043 received', detail: 'Sofia Martinez • 3 items • ₹214', time: '5m ago', icon: ShoppingBag, color: 'text-[#8c6b3e] bg-[#faf5eb] dark:text-[#ccb08a] dark:bg-[#261f18]' },
  { id: 2, type: 'payment', title: 'Payment Captured', detail: 'Razorpay payment capture verified', time: '8m ago', icon: CheckCircle2, color: 'text-[#2e7d32] bg-[#ebeee9] dark:text-[#a0baa8] dark:bg-[#1a231f]' },
  { id: 3, type: 'label', title: 'Shipping Label Generated', detail: 'Ready for pickup via Delhivery', time: '1h ago', icon: FileText, color: 'text-[#4f5c6c] bg-[#ebeeef] dark:text-[#9bb1c8] dark:bg-[#181d22]' },
  { id: 4, type: 'risk', title: 'Risk Check Passed', detail: 'Trust Score 95/100 • Low Risk Profile', time: '2h ago', icon: ShieldAlert, color: 'text-[#2e7d32] bg-[#ebeee9] dark:text-[#a0baa8] dark:bg-[#1a231f]' },
  { id: 5, type: 'inventory', title: 'Inventory Alert', detail: 'Cottage Garden Hoop is low in stock (2 left)', time: '4h ago', icon: AlertCircle, color: 'text-[#c62828] bg-[#f7ece7] dark:text-[#dda092] dark:bg-[#261713]' },
];

export const AdminDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useAdminDashboard();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <AdminSkeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminSkeleton className="h-96 w-full" />
          <AdminSkeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="rounded-lg border border-[#fce8e6] bg-[#fce8e6]/50 p-6 text-[#a15543]">
        <h3 className="font-semibold mb-2">Error loading dashboard</h3>
        <p>There was a problem fetching the dashboard data. Please try again.</p>
      </div>
    );
  }

  const { data } = dashboardData;
  const { revenue, orders, customers, inventory, riskAlerts, recentOrders } = data;

  // Custom values calculated by timeframe for interactivity
  const getPeriodRevenue = () => {
    switch (timeframe) {
      case 'week': return revenue.thisWeek;
      case 'month': return revenue.thisMonth;
      case 'year': return revenue.allTime;
      default: return revenue.today;
    }
  };

  const getPeriodOrders = () => {
    switch (timeframe) {
      case 'week': return orders.today * 6 + 1;
      case 'month': return orders.today * 24 + 4;
      case 'year': return orders.today * 290 + 12;
      default: return orders.today;
    }
  };

  const getPeriodCustomers = () => {
    switch (timeframe) {
      case 'week': return customers.newThisWeek;
      case 'month': return customers.newThisWeek * 4 + 2;
      case 'year': return customers.total;
      default: return customers.newToday;
    }
  };

  const getPeriodAOV = () => {
    const rev = getPeriodRevenue();
    const ords = getPeriodOrders();
    return ords > 0 ? rev / ords : 0;
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* 1. Business Health Banner */}
      <div className="rounded-md border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#211c18] px-4 py-3 text-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors duration-200">
        <div className="flex items-center gap-1.5 text-[#1f1610] dark:text-[#ffffff] font-bold">
          <Star className="h-4 w-4 fill-[#8c6b3e] text-[#8c6b3e] dark:fill-[#ccb08a] dark:text-[#ccb08a]" />
          <span className="font-sans tracking-wide">Business Health &bull; Excellent</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#3c2b1e] dark:text-[#ccb08a] font-bold text-xs">
          <span>Revenue: <b className="text-[#2e7d32] dark:text-[#a0baa8] font-bold">Stable</b></span>
          <span className="hidden md:inline text-[#c8b5aa]/60">&bull;</span>
          <span>Orders: <b className="text-[#2e7d32] dark:text-[#a0baa8] font-bold">Healthy</b></span>
          <span className="hidden md:inline text-[#c8b5aa]/60">&bull;</span>
          <span>Returns: <b className="text-[#c62828] dark:text-[#f28b82] font-bold">1.4% (Low)</b></span>
          <span className="hidden md:inline text-[#c8b5aa]/60">&bull;</span>
          <span>Inventory: <b className="text-[#8c6b3e] dark:text-[#ccb08a] font-bold">Balanced</b></span>
          <span className="hidden md:inline text-[#c8b5aa]/60">&bull;</span>
          <span>Risk Queue: <b className="text-[#2e7d32] dark:text-[#a0baa8] font-bold">Clean</b></span>
        </div>
      </div>

      {/* 2. Operations Center / Command Center (Replacements for Hero Banner) */}
      <div className="rounded-xl border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#211c18] p-6 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50">
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-[#1f1610] dark:text-[#ffffff]">
              Two Threads Studio &bull; Operations Center
            </h1>
            <p className="text-sm text-[#4e3c30] dark:text-[#ccb08a] font-bold mt-1">
              {formattedDate} &bull; Everything operating normally.
            </p>
          </div>
          
          {/* Live Status Indicators (Apple-like) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase font-mono tracking-wider font-bold text-[#1f1610] dark:text-[#ffffff]">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2e7d32] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2e7d32]"></span>
              </span>
              <span>Store Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2e7d32]"></span>
              </span>
              <span>Payments Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2e7d32]"></span>
              </span>
              <span>Inventory Synced</span>
            </div>
            <span className="text-xs text-[#4e3c30] dark:text-[#ccb08a] normal-case font-bold ml-1">Last sync: 2m ago</span>
          </div>
        </div>

        {/* Dynamic mini numbers layout inside the summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#4e3c30] dark:text-[#ccb08a] font-bold font-sans">Today's Revenue</div>
            <div className="font-sans text-xl font-extrabold text-[#1f1610] dark:text-[#ffffff] mt-1">₹{revenue.today.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#4e3c30] dark:text-[#ccb08a] font-bold font-sans">Active Orders</div>
            <div className="font-sans text-xl font-extrabold text-[#1f1610] dark:text-[#ffffff] mt-1">{orders.today}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#4e3c30] dark:text-[#ccb08a] font-bold font-sans">Awaiting Ship</div>
            <div className="font-sans text-xl font-extrabold text-[#1f1610] dark:text-[#ffffff] mt-1">{orders.pending + orders.processing}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#4e3c30] dark:text-[#ccb08a] font-bold font-sans">Manual Review</div>
            <div className="font-sans text-xl font-extrabold text-[#1f1610] dark:text-[#ffffff] mt-1 flex items-center gap-2">
              {riskAlerts.manualReview}
              {riskAlerts.manualReview > 0 && (
                <span className="h-2 w-2 rounded-full bg-[#c62828] animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Risk Alerts Banner if active */}
      {(riskAlerts.manualReview > 0 || riskAlerts.fraudFlags > 0) && (
        <div className="flex items-center gap-3 rounded-lg border border-[#fce8e6] dark:border-[#3c2525] bg-[#fce8e6] dark:bg-[#251717] px-4 py-3.5 text-[#c62828] dark:text-[#dda092] transition-colors duration-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">
            Attention: {riskAlerts.manualReview} orders pending risk review &bull; {riskAlerts.fraudFlags} active flags.
          </p>
          <Link to="/admin/risk" className="ml-auto text-xs font-bold underline hover:text-[#8c6b3e] transition-colors">
            Go to Risk Center
          </Link>
        </div>
      )}

      {/* 4. Interactive Time period selector + Segmented selector */}
      <div className="flex items-center justify-between border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50 pb-3">
        <div>
          <h2 className="font-sans text-lg font-bold text-[#1f1610] dark:text-[#ffffff]">Performance Command Dashboard</h2>
          <p className="text-xs text-[#4e3c30] dark:text-[#ccb08a] font-bold mt-0.5">Realtime operations visualizer</p>
        </div>
        
        {/* Time Period Selector Segmented control */}
        <div className="bg-[#d2c4bc]/40 dark:bg-[#211c18] p-1 rounded-md flex items-center border border-[#c8b5aa] dark:border-[#3d332b] transition-all">
          {(['today', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                timeframe === period
                  ? 'bg-white dark:bg-[#171311] text-[#1f1610] dark:text-[#ffffff] shadow-xs border border-[#c8b5aa]/40 dark:border-transparent'
                  : 'text-[#4e3c30] dark:text-[#ccb08a] hover:text-[#1f1610] dark:hover:text-[#ffffff]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Reduced Card Height Grid & Swipeable Mobile layout */}
      <div>
        <div 
          className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 scrollbar-none"
          onScroll={(e) => {
            const width = e.currentTarget.clientWidth;
            const scrollLeft = e.currentTarget.scrollLeft;
            const tabIndex = Math.round(scrollLeft / width);
            setMobileActiveTab(tabIndex);
          }}
        >
          {/* Card 1: Revenue */}
          <div className="min-w-[85%] md:min-w-0 snap-center rounded-lg border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#211c18] p-4 flex flex-col justify-between h-28 relative overflow-hidden transition-colors duration-200">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">Revenue</div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-[#1f1610] dark:text-[#ffffff] mt-1 font-mono">
                <AnimatePresence mode="wait">
                  <AnimatedNumber value={`₹${getPeriodRevenue().toLocaleString()}`} />
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#3c2b1e] dark:text-[#e2deda] font-bold mt-2 z-10">
              <span className="flex items-center gap-0.5 text-[#2e7d32] dark:text-[#a0baa8] font-extrabold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +12.4%
              </span>
              <span>vs previous period</span>
            </div>
            <div className="absolute right-3 top-3">
              <MiniSparkline type="up" />
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="min-w-[85%] md:min-w-0 snap-center rounded-lg border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#211c18] p-4 flex flex-col justify-between h-28 relative overflow-hidden transition-colors duration-200">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">Orders Count</div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-[#1f1610] dark:text-[#ffffff] mt-1 font-mono">
                <AnimatePresence mode="wait">
                  <AnimatedNumber value={getPeriodOrders().toString()} />
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#3c2b1e] dark:text-[#e2deda] font-bold mt-2 z-10">
              <span className="flex items-center gap-0.5 text-[#2e7d32] dark:text-[#a0baa8] font-extrabold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +8.2%
              </span>
              <span>{orders.pending} pending</span>
            </div>
            <div className="absolute right-3 top-3">
              <MiniSparkline type="neutral" />
            </div>
          </div>

          {/* Card 3: Customers */}
          <div className="min-w-[85%] md:min-w-0 snap-center rounded-lg border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#211c18] p-4 flex flex-col justify-between h-28 relative overflow-hidden transition-colors duration-200">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">Customers</div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-[#1f1610] dark:text-[#ffffff] mt-1 font-mono">
                <AnimatePresence mode="wait">
                  <AnimatedNumber value={getPeriodCustomers().toString()} />
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#3c2b1e] dark:text-[#e2deda] font-bold mt-2 z-10">
              <span className="flex items-center gap-0.5 text-[#2e7d32] dark:text-[#a0baa8] font-extrabold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +5.7%
              </span>
              <span>{customers.total.toLocaleString()} total</span>
            </div>
            <div className="absolute right-3 top-3">
              <MiniSparkline type="up" />
            </div>
          </div>

          {/* Card 4: Avg Order Value */}
          <div className="min-w-[85%] md:min-w-0 snap-center rounded-lg border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#211c18] p-4 flex flex-col justify-between h-28 relative overflow-hidden transition-colors duration-200">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-[#4e3c30] dark:text-[#ccb08a]">Avg. Order Value</div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-[#1f1610] dark:text-[#ffffff] mt-1 font-mono">
                <AnimatePresence mode="wait">
                  <AnimatedNumber value={`₹${getPeriodAOV().toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#3c2b1e] dark:text-[#e2deda] font-bold mt-2 z-10">
              <span className="flex items-center gap-0.5 text-[#c62828] dark:text-[#dda092] font-extrabold">
                <ArrowDownRight className="h-3.5 w-3.5" /> -1.1%
              </span>
              <span>based on orders</span>
            </div>
            <div className="absolute right-3 top-3">
              <MiniSparkline type="down" />
            </div>
          </div>
        </div>

        {/* Mobile dots indicators */}
        <div className="flex md:hidden justify-center gap-1.5 mt-2">
          {[0, 1, 2, 3].map((idx) => (
            <div 
              key={idx}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${mobileActiveTab === idx ? 'bg-[#1f1610] dark:bg-[#ffffff] w-4' : 'bg-[#c8b5aa]/60'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Orders List (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#211c18] overflow-hidden transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50 px-6 py-4">
              <div>
                <h3 className="font-sans text-base font-bold text-[#1f1610] dark:text-[#ffffff]">
                  Recent Orders
                </h3>
                <p className="text-xs text-[#4e3c30] dark:text-[#ccb08a] font-bold mt-0.5">
                  Latest customer purchases requiring fulfillment attention
                </p>
              </div>
              <Link to="/admin/orders" className="text-xs font-bold text-[#1f1610] dark:text-[#ffffff] hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-[#4e3c30] dark:text-[#ccb08a] font-bold text-xs">No recent orders</div>
            ) : (
              <div className="overflow-x-auto">
                <AdminTable className="border-0 bg-transparent">
                  <AdminTableHeader className="border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50">
                    <AdminTableRow className="border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50 hover:bg-transparent">
                      <AdminTableHead className="text-xs font-bold uppercase tracking-wider text-[#1f1610] dark:text-[#ffffff] py-3">Order</AdminTableHead>
                      <AdminTableHead className="text-xs font-bold uppercase tracking-wider text-[#1f1610] dark:text-[#ffffff] py-3">Customer</AdminTableHead>
                      <AdminTableHead className="text-xs font-bold uppercase tracking-wider text-[#1f1610] dark:text-[#ffffff] py-3">Items</AdminTableHead>
                      <AdminTableHead className="text-xs font-bold uppercase tracking-wider text-[#1f1610] dark:text-[#ffffff] py-3">Payment</AdminTableHead>
                      <AdminTableHead className="text-xs font-bold uppercase tracking-wider text-[#1f1610] dark:text-[#ffffff] py-3">Status</AdminTableHead>
                      <AdminTableHead className="text-xs font-bold uppercase tracking-wider text-[#1f1610] dark:text-[#ffffff] py-3 text-right">Total</AdminTableHead>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {recentOrders.slice(0, 6).map((order: any) => (
                      <AdminTableRow 
                        key={order.id} 
                        className="border-b border-[#c8b5aa]/40 dark:border-[#3d332b]/30 hover:bg-[#d1c4bd]/20 dark:hover:bg-[#211c18]/50 transition-colors"
                      >
                        <AdminTableCell className="font-mono text-xs font-bold">
                          <Link to={`/admin/orders/${order.id}`} className="text-[#1f1610] dark:text-[#ffffff] hover:underline">
                            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                          </Link>
                        </AdminTableCell>
                        <AdminTableCell className="text-xs">
                          <div className="font-bold text-[#1f1610] dark:text-[#ffffff]">
                            {order.user.firstName} {order.user.lastName}
                          </div>
                          <div className="text-xs font-medium text-[#4e3c30] dark:text-[#e2deda]">
                            {order.user.email}
                          </div>
                        </AdminTableCell>
                        <AdminTableCell className="text-xs font-semibold text-[#1f1610] dark:text-[#ffffff] truncate max-w-[120px]">
                          {order.items?.map((it: any) => it.productName).join(', ') || 'Embroidery Products'}
                        </AdminTableCell>
                        <AdminTableCell className="text-xs font-mono">
                          <span className="px-2 py-0.5 rounded-sm bg-[#ebeeef] dark:bg-[#181d22] text-[#2d3a4a] dark:text-[#9bb1c8] font-bold">
                            {order.paymentStatus === 'CAPTURED' ? 'PREPAID' : 'COD'}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminBadge variant={
                            order.orderStatus === 'DELIVERED' ? 'sage' :
                            order.orderStatus === 'CANCELLED' ? 'dust' :
                            order.orderStatus === 'PROCESSING' || order.orderStatus === 'CONFIRMED' ? 'gold' : 'stone'
                          }>
                            {order.orderStatus.toLowerCase()}
                          </AdminBadge>
                        </AdminTableCell>
                        <AdminTableCell className="text-right font-bold text-xs font-mono text-[#1f1610] dark:text-[#ffffff]">
                          ₹{order.grandTotal.toLocaleString()}
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                </AdminTable>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inventory & Activity Timeline */}
        <div className="space-y-6">
          {/* Inventory Health Widget */}
          <div className="rounded-xl border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#211c18] overflow-hidden transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50 px-6 py-4">
              <div>
                <h3 className="font-sans text-base font-bold text-[#1f1610] dark:text-[#ffffff]">
                  Inventory Health
                </h3>
                <p className="text-xs text-[#4e3c30] dark:text-[#ccb08a] font-bold mt-0.5">
                  Items requiring restock or replenishment
                </p>
              </div>
            </div>

            {inventory.outOfStock.length === 0 && inventory.lowStock.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[160px] animate-in fade-in duration-300">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#ebeee9] dark:bg-[#1a231f] text-[#2e7d32] dark:text-[#a0baa8] mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-[#2e7d32] dark:text-[#a0baa8]">All inventory levels are healthy.</p>
                <p className="text-xs text-[#4e3c30] dark:text-[#ccb08a] font-bold mt-1">No replenishment required today.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#c8b5aa]/30 dark:divide-[#3d332b]/20">
                {inventory.outOfStock.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#d1c4bd]/20 dark:hover:bg-[#211c18]/50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#c62828] shrink-0"></span>
                      <div>
                        <p className="text-xs font-bold text-[#1f1610] dark:text-[#ffffff] line-clamp-1">{p.name}</p>
                        <p className="text-xs text-[#4e3c30] dark:text-[#e2deda] font-bold mt-0.5">SKU: {p.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AdminBadge variant="dust">OUT OF STOCK</AdminBadge>
                      <button className="text-xs font-bold border border-[#c62828] text-[#c62828] hover:bg-[#c62828] hover:text-white px-2 py-0.5 rounded transition-all">
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
                {inventory.lowStock.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#d1c4bd]/20 dark:hover:bg-[#211c18]/50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#8c6b3e] shrink-0"></span>
                      <div>
                        <p className="text-xs font-bold text-[#1f1610] dark:text-[#ffffff] line-clamp-1">{p.name}</p>
                        <p className="text-xs text-[#4e3c30] dark:text-[#e2deda] font-bold mt-0.5">SKU: {p.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#8c6b3e] dark:text-[#ccb08a]">{p.stockQuantity} left</span>
                      <button className="text-xs font-bold border border-[#c8b5aa] text-[#4e3c30] dark:text-[#ccb08a] hover:bg-[#4e3c30] hover:text-white px-2 py-0.5 rounded transition-all">
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline logs */}
          <div className="rounded-xl border border-[#c8b5aa] dark:border-[#3d332b] bg-white dark:bg-[#211c18] p-6 transition-colors duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/50 mb-4">
              <div>
                <h3 className="font-sans text-base font-bold text-[#1f1610] dark:text-[#ffffff]">
                  Fulfillment Timeline
                </h3>
                <p className="text-xs text-[#4e3c30] dark:text-[#ccb08a] font-bold mt-0.5">
                  Real-time events from operations & checkout logs
                </p>
              </div>
              <Activity className="h-4 w-4 text-[#4e3c30] dark:text-[#ccb08a]" />
            </div>

            <div className="relative pl-4 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#c8b5aa] dark:before:bg-[#3d332b]">
              {initialEvents.map((evt) => {
                const Icon = evt.icon;
                return (
                  <div key={evt.id} className="relative flex items-start gap-3 text-xs animate-in fade-in duration-300">
                    <span className={`absolute -left-4 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-[#211c18] ${evt.color}`}>
                      <Icon className="h-2 w-2" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#1f1610] dark:text-[#ffffff]">{evt.title}</span>
                        <span className="text-xs font-mono text-[#4e3c30] dark:text-[#ccb08a] font-bold shrink-0">{evt.time}</span>
                      </div>
                      <p className="text-xs font-medium text-[#4e3c30] dark:text-[#e2deda] mt-0.5">{evt.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Floating Glassmorphic Quick Actions Panel */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {quickActionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-48 rounded-xl border border-[#c8b5aa] dark:border-[#3d332b] bg-[#fef8f3] dark:bg-[#171311] p-2 shadow-lg flex flex-col gap-1"
            >
              <div className="text-xs uppercase tracking-wider font-extrabold text-[#1f1610] dark:text-[#ffffff] px-2 py-1 border-b border-[#c8b5aa]/60 dark:border-[#3d332b]/30 mb-1">
                Quick Actions
              </div>
              <Link 
                to="/admin/products"
                onClick={() => setQuickActionsOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#1f1610] dark:text-[#ffffff] hover:bg-[#d1c4bd]/35 dark:hover:bg-[#211c18] transition-colors font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Product</span>
              </Link>
              <Link 
                to="/admin/orders"
                onClick={() => setQuickActionsOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#1f1610] dark:text-[#ffffff] hover:bg-[#d1c4bd]/35 dark:hover:bg-[#211c18] transition-colors font-bold"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Create Order</span>
              </Link>
              <Link 
                to="/admin/risk"
                onClick={() => setQuickActionsOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#1f1610] dark:text-[#ffffff] hover:bg-[#d1c4bd]/35 dark:hover:bg-[#211c18] transition-colors font-bold"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Review Risk Center</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setQuickActionsOpen(!quickActionsOpen)}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md focus:outline-none transition-transform duration-300 ${
            quickActionsOpen 
              ? 'bg-[#c62828] rotate-45' 
              : 'bg-[#4e3c30] dark:bg-[#ccb08a] dark:text-[#171311] hover:scale-105'
          }`}
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
