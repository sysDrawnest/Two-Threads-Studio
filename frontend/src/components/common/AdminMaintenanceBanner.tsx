import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';

/**
 * AdminMaintenanceBanner Component
 * Unobtrusive banner shown at the top of the storefront ONLY to logged-in admins when Maintenance Mode is ON.
 */
export const AdminMaintenanceBanner: React.FC = () => {
  return (
    <div className="bg-[#1E1812] text-[#FBFBFA] px-4 py-2.5 text-xs font-sans border-b border-[#8B6F5C]/40 flex items-center justify-between z-50 sticky top-0 shadow-md">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-[#8B6F5C] animate-pulse" />
          <span className="font-medium tracking-wide">
            <strong className="text-[#8B6F5C] uppercase tracking-wider font-semibold mr-1">
              MAINTENANCE MODE ACTIVE:
            </strong>
            Visitors are currently seeing the maintenance page. You are viewing the live preview.
          </span>
        </div>

        <Link
          to="/admin/settings"
          className="inline-flex items-center gap-1 bg-[#8B6F5C] text-[#FBFBFA] px-3 py-1 rounded-sm text-[10px] uppercase font-semibold tracking-widest hover:bg-[#5A3D2B] transition-colors whitespace-nowrap ml-4"
        >
          <span>Manage</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};
