import React, { useState } from 'react';
import StudioNavigation from './StudioNavigation';
import Overview from './Overview';
import Profile from './Profile';
import Security from './Security';
import EmptyState from './EmptyState';
import ErrorBoundary from './ErrorBoundary';
import AddressBook from './AddressBook';
import WishlistTab from './WishlistTab';
import OrdersTab from './OrdersTab';
import { useAuth } from '../../context/AuthContext';

export const AccountLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'profile':
        return <Profile />;
      case 'security':
        return <Security />;
      case 'orders':
        return <OrdersTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'addresses':
        return <AddressBook />;
      case 'learning':
        return (
          <EmptyState
            title="Learning Guild"
            message="Your learning materials and progress will appear here in a future update."
          />
        );
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F7]">
      <StudioNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-24">
        <ErrorBoundary key={activeTab}>
          {renderContent()}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default AccountLayout;
