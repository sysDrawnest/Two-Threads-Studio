import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/layout/AdminLayout';

// Intro & Layout
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NewsletterModal from './components/layout/NewsletterModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Reusable Elegant Loader
const ElegantLoader: React.FC = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
    <div className="relative w-12 h-12 mb-4">
      <div className="absolute inset-0 rounded-full border border-outline-variant/30" />
      <div className="absolute inset-0 rounded-full border border-transparent border-t-on-secondary-container animate-spin" />
    </div>
    <p className="font-serif text-sm tracking-widest text-[#2d2520] uppercase animate-pulse">
      TwoThreads Studio
    </p>
  </div>
);

// Lazy Storefront Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Collections = lazy(() => import('./pages/Collections'));
const Learning = lazy(() => import('./pages/Learning'));
const TutorialDetail = lazy(() => import('./pages/TutorialDetail'));
const InstructorProfile = lazy(() => import('./pages/InstructorProfile'));
const Journal = lazy(() => import('./pages/Journal'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Artisans = lazy(() => import('./pages/Artisans'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Account = lazy(() => import('./pages/Account'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Membership = lazy(() => import('./pages/Membership'));
const Careers = lazy(() => import('./pages/Careers'));
const Legal = lazy(() => import('./pages/Legal'));
const CheckoutSuccess = lazy(() => import('./pages/checkout/CheckoutSuccess'));
const CheckoutFailed = lazy(() => import('./pages/checkout/CheckoutFailed'));
// const OurBrands = lazy(() => import('./pages/OurBrands'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const EmailVerified = lazy(() => import('./pages/auth/EmailVerified'));
const AccessDenied = lazy(() => import('./pages/auth/AccessDenied'));

// Lazy Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement').then(module => ({ default: module.ProductsManagement })));
const ProductForm = lazy(() => import('./pages/admin/ProductForm').then(module => ({ default: module.ProductForm })));
const InventoryManagement = lazy(() => import('./pages/admin/InventoryManagement').then(module => ({ default: module.InventoryManagement })));
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement').then(module => ({ default: module.OrdersManagement })));
const OrderDetail = lazy(() => import('./pages/admin/OrderDetail').then(module => ({ default: module.OrderDetail })));
const CustomersManagement = lazy(() => import('./pages/admin/CustomersManagement').then(module => ({ default: module.CustomersManagement })));
const CustomerProfile = lazy(() => import('./pages/admin/CustomerProfile').then(module => ({ default: module.CustomerProfile })));
const TutorialsManagement = lazy(() => import('./pages/admin/TutorialsManagement'));
const ReviewsManagement = lazy(() => import('./pages/admin/ReviewsManagement').then(module => ({ default: module.ReviewsManagement })));
const RiskCenter = lazy(() => import('./pages/admin/RiskCenter').then(module => ({ default: module.RiskCenter })));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));

// ─────────────────────────────────────────────────────────────────────────────
// Storefront wrapper (with Navbar, Footer, page transitions)
// ─────────────────────────────────────────────────────────────────────────────
const StorefrontRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:id" element={<TutorialDetail />} />
        <Route path="/instructor/:id" element={<InstructorProfile />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/about" element={<OurStory />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/failed" element={<CheckoutFailed />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/legal" element={<Legal />} />
        {/* <Route path="/our-brands" element={<OurBrands />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const StorefrontShell: React.FC = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try { return !sessionStorage.getItem('tt_visited'); } catch { return true; }
  });

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-background font-sans text-on-surface">
      {showIntro && <IntroAnimation onComplete={() => {
        try { sessionStorage.setItem('tt_visited', '1'); } catch {}
        setShowIntro(false);
      }} />}
      <Navbar />
      <main className={`flex-1 flex flex-col transition-opacity duration-700 ease-in-out ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <StorefrontRoutes />
      </main>
      <Footer />
      <NewsletterModal />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth pages (no Navbar/Footer)
// ─────────────────────────────────────────────────────────────────────────────
const AuthRoutes: React.FC = () => (
  <Routes>
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/signup" element={<SignUp />} />
    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
    <Route path="/auth/reset-password" element={<ResetPassword />} />
    <Route path="/auth/email-verified" element={<EmailVerified />} />
    <Route path="/auth/access-denied" element={<AccessDenied />} />
  </Routes>
);

// ─────────────────────────────────────────────────────────────────────────────
// Admin pages (ProtectedRoute wrapping AdminLayout with nested routes)
// ─────────────────────────────────────────────────────────────────────────────
const AdminRoutes: React.FC = () => (
  <Routes>
    <Route element={<ProtectedRoute requireAdmin />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="customers/:id" element={<CustomerProfile />} />
        <Route path="tutorials" element={<TutorialsManagement />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="risk" element={<RiskCenter />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Routes>
);

// ─────────────────────────────────────────────────────────────────────────────
// Root App — decides which section to render based on the path
// ─────────────────────────────────────────────────────────────────────────────
const AppRoutes: React.FC = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/auth')) return <AuthRoutes />;
  if (location.pathname.startsWith('/admin')) return <AdminRoutes />;
  return <StorefrontShell />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<ElegantLoader />}>
              <AppRoutes />
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}