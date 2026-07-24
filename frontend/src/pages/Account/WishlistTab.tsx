import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, useRemoveFromWishlist, useMoveToCart, WishlistItem } from '../../hooks/useCommerce';
import LoadingSkeleton from './LoadingSkeleton';

export const WishlistTab: React.FC = () => {
  const { data: wishlistItems, isLoading, error } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const moveToCartMutation = useMoveToCart();

  const handleRemove = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await removeFromWishlistMutation.mutateAsync(productId);
    } catch (err: any) {
      alert(err.message || 'Failed to remove product from wishlist.');
    }
  };

  const handleMoveToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await moveToCartMutation.mutateAsync({ productId, quantity: 1 });
    } catch (err: any) {
      alert(err.message || 'Failed to move product to cart.');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-neutral-500 text-sm font-sans">Failed to retrieve saved inspirations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="text-center">
        <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
          Your Curations
        </span>
        <h3 className="font-serif text-3xl font-light text-[#1C1C1B]">
          Saved Inspirations
        </h3>
      </div>

      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {wishlistItems.map((item: WishlistItem) => (
            <Link key={item.id} to={`/shop/${item.product.id}`} className="group block space-y-4">
              <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={item.product.primaryImage || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={(e) => handleMoveToCart(e, item.productId)}
                      disabled={moveToCartMutation.isPending}
                      className="flex-1 bg-white/90 backdrop-blur-sm text-[#1C1C1B] py-3 text-[10px] font-sans uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      Add to Studio
                    </button>
                    <button
                      onClick={(e) => handleRemove(e, item.productId)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="w-12 flex items-center justify-center bg-white/90 backdrop-blur-sm text-neutral-600 hover:text-red-600 transition-colors"
                    >
                      <span className="text-lg">×</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 text-center">
                <h4 className="font-serif text-lg text-[#1C1C1B]">{item.product.name}</h4>
                <p className="font-sans text-[10px] text-neutral-400 uppercase tracking-widest">
                  Rs. {item.product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 space-y-6">
          <p className="font-serif text-xl italic text-neutral-400">You haven't saved any pieces yet.</p>
          <Link
            to="/shop"
            className="inline-block border-b border-[#1C1C1B] text-[#1C1C1B] text-[10px] uppercase tracking-widest font-sans pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
          >
            Explore the Studio
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
