import React, { useState } from 'react';
import Sidebar from './Sidebar';
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
        return <Overview />;
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
            message="This feature will be available in an upcoming update."
          />
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col md:flex-row gap-8 md:gap-12 min-h-[60vh]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
      />
      <main className="flex-1 min-w-0">
        <ErrorBoundary key={activeTab}>
          {renderContent()}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default AccountLayout;
