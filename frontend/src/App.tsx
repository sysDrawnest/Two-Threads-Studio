import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/dashboard/AdminLayout';

// Intro & Layout
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NewsletterModal from './components/layout/NewsletterModal';

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
const About = lazy(() => import('./pages/About'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Artisans = lazy(() => import('./pages/Artisans'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Account = lazy(() => import('./pages/Account'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Membership = lazy(() => import('./pages/Membership'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const EmailVerified = lazy(() => import('./pages/auth/EmailVerified'));
const AccessDenied = lazy(() => import('./pages/auth/AccessDenied'));

// Lazy Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement'));
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement'));
const CustomersManagement = lazy(() => import('./pages/admin/CustomersManagement'));
const TutorialsManagement = lazy(() => import('./pages/admin/TutorialsManagement'));
const ReviewsManagement = lazy(() => import('./pages/admin/ReviewsManagement'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

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
        <Route path="/about" element={<About />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/membership" element={<Membership />} />
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
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="tutorials" element={<TutorialsManagement />} />
        <Route path="reviews" element={<ReviewsManagement />} />
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
    <AuthProvider>
      <Router>
        <Suspense fallback={<ElegantLoader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}