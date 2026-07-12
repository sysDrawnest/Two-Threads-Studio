import React from 'react';
import { useDashboardSummary } from '../../hooks/useProfile';
import LoadingSkeleton from './LoadingSkeleton';
import MembershipCard from './MembershipCard';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin } from 'lucide-react';

export const Overview: React.FC = () => {
  const { data: summary, isLoading, error } = useDashboardSummary();

  if (isLoading) return <LoadingSkeleton />;

  if (error || !summary) {
    return (
      <div className="border border-zinc-200 p-8 text-center bg-zinc-50">
        <p className="text-zinc-600 text-sm">Failed to retrieve account overview metrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4">
      {/* Editorial Welcome Header */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Client Workspace
        </span>
        <h2 className="font-serif text-3xl font-normal text-zinc-900">
          Welcome back, {summary.customerName}
        </h2>
        <p className="text-sm text-zinc-500 max-w-xl font-light leading-relaxed">
          From your workspace, you can manage your profile settings, configure access credentials, and track your artisan contributions.
        </p>
      </div>

      <hr className="border-zinc-200" />

      {/* Grid: Membership & Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MembershipCard
            customerName={summary.customerName}
            memberSince={summary.memberSince}
          />
        </div>

        {/* Quick Stats Column */}
        <div className="border border-zinc-200 p-6 bg-white space-y-6 flex flex-col justify-center">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-2">
            Metrics Summary
          </h4>
          
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-50 border border-zinc-100">
                <ShoppingBag className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-400">Cart</div>
                <div className="font-mono text-sm font-medium text-zinc-800">{summary.cartCount} items</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-50 border border-zinc-100">
                <Heart className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-400">Wishlist</div>
                <div className="font-mono text-sm font-medium text-zinc-800">{summary.wishlistCount} items</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-50 border border-zinc-100">
                <MapPin className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-400">Addresses</div>
                <div className="font-mono text-sm font-medium text-zinc-800">{summary.savedAddresses} saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-zinc-200" />

      {/* Recommended Products */}
      {summary.recommendedProducts && summary.recommendedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                Curated Selection
              </span>
              <h3 className="font-serif text-xl font-normal text-zinc-900">
                Recommended for You
              </h3>
            </div>
            <Link
              to="/shop"
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
            >
              View Full Catalog
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summary.recommendedProducts.map((product: any) => (
              <Link 
                key={product.id} 
                to={`/shop/${product.slug}`}
                className="group border border-zinc-200 bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-square bg-zinc-50 overflow-hidden relative border-b border-zinc-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt || product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center font-mono text-[10px] text-zinc-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-serif text-sm text-zinc-850 font-medium group-hover:underline line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center space-x-2 font-mono text-xs text-zinc-600">
                    <span>₹{product.price}</span>
                    {product.comparePrice && (
                      <span className="line-through text-zinc-400">₹{product.comparePrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
