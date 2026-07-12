import React from 'react';
import { 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  GraduationCap,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const primaryItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
  ];

  const placeholderItems = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'learning', label: 'Learning Guild', icon: GraduationCap },
  ];

  return (
    <aside className="w-full md:w-64 md:flex-shrink-0 md:border-r border-zinc-200 pr-0 md:pr-8 py-2 md:py-6 flex flex-col justify-between">
      <div className="space-y-8">
        {/* Navigation Items */}
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible space-x-6 md:space-x-0 md:space-y-2 pb-3 md:pb-0 border-b md:border-b-0 border-zinc-100 scrollbar-none">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-3 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${
                  isActive
                    ? 'border-zinc-900 text-zinc-900 bg-zinc-50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Future Commerce Placeholders */}
        <div className="hidden md:block space-y-4">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 px-3">
            Commerce Guild
          </h4>
          <div className="space-y-1">
            {placeholderItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 border-l-2 text-left ${
                    isActive
                      ? 'border-zinc-900 text-zinc-900 bg-zinc-50'
                      : 'border-transparent text-zinc-405 text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  <span>{item.label}</span>
                  <span className="text-[8px] text-zinc-300 ml-auto border border-zinc-200 px-1 py-0.5 scale-90 font-mono">
                    Soon
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="mt-8 pt-4 border-t border-zinc-100 hidden md:block">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-mono uppercase tracking-widest text-red-700 hover:text-red-900 hover:bg-red-50/50 transition-all duration-300 border-l-2 border-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Account</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
