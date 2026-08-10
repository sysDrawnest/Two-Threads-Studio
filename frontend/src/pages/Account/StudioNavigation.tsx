import React from 'react';
import { LogOut } from 'lucide-react';
import { useFeatures } from '../../hooks/useFeatures';

interface StudioNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const StudioNavigation: React.FC<StudioNavigationProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const { features } = useFeatures();

  const tabs = [
    { id: 'overview', label: 'Studio' },
    { id: 'orders', label: 'Orders' },
    { id: 'wishlist', label: 'Inspiration' },
    ...(features.LEARNING_HUB ? [{ id: 'learning', label: 'Learning' }] : []),
    { id: 'addresses', label: 'Addresses' },
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <nav className="w-full border-b border-neutral-200 bg-white sticky top-[72px] z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between">
        <div className="flex overflow-x-auto scrollbar-none py-5 space-x-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 relative ${
                  isActive
                    ? 'text-[#1C1C1B] font-bold'
                    : 'text-neutral-500 font-medium hover:text-[#1C1C1B]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute -bottom-5 left-0 w-full h-[1px] bg-[#1C1C1B]" />
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={onLogout}
          className="hidden md:flex items-center space-x-2 font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-[#A34A38] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default StudioNavigation;
