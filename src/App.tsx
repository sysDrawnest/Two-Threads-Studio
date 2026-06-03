import React, { useState } from 'react';
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

// Storefront Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Collections from './pages/Collections';
import Learning from './pages/Learning';
import TutorialDetail from './pages/TutorialDetail';
import InstructorProfile from './pages/InstructorProfile';
import Journal from './pages/Journal';
import About from './pages/About';
import OurStory from './pages/OurStory';
import Sustainability from './pages/Sustainability';
import Artisans from './pages/Artisans';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import Membership from './pages/Membership';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailVerified from './pages/auth/EmailVerified';
import AccessDenied from './pages/auth/AccessDenied';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import CustomersManagement from './pages/admin/CustomersManagement';
import TutorialsManagement from './pages/admin/TutorialsManagement';
import ReviewsManagement from './pages/admin/ReviewsManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminSettings from './pages/admin/AdminSettings';

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
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}