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
      <div className="flex flex-col items-center justify-center py-24">
        <p className="font-sans text-sm text-[#5a4a3f]">Failed to retrieve your inspiration board.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="font-serif text-4xl text-[#1C1C1B]">Your Inspiration</h2>
        <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
          A curated collection of pieces that caught your eye. Saved here for when you're ready to commission them.
        </p>
      </div>

      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {wishlistItems.map((item: WishlistItem) => (
            <div key={item.id} className="group flex flex-col no-underline">
              <Link to={`/shop/${item.product.id}`} className="aspect-[3/4] bg-[#FAF9F7] overflow-hidden mb-6 relative">
                <img
                  src={item.product.primaryImage || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={(e) => handleMoveToCart(e, item.productId)}
                      disabled={moveToCartMutation.isPending}
                      className="flex-1 bg-white/90 backdrop-blur-sm text-[#1C1C1B] hover:bg-[#1C1C1B] hover:text-white transition-colors py-3 text-[10px] uppercase tracking-widest font-sans font-medium"
                    >
                      {moveToCartMutation.isPending ? 'Moving...' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={(e) => handleRemove(e, item.productId)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="px-4 bg-white/90 backdrop-blur-sm text-[#A34A38] hover:bg-white transition-colors py-3 text-[10px] uppercase tracking-widest font-sans font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Link>
              
              <div className="flex flex-col space-y-1 text-center">
                <Link to={`/shop/${item.product.id}`} className="font-serif text-xl text-[#1C1C1B] hover:text-[#A34A38] transition-colors line-clamp-1 no-underline">
                  {item.product.name}
                </Link>
                <span className="font-sans text-xs font-semibold text-[#1C1C1B]">₹{item.product.price}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#FAF9F7] border border-[#e8e3dc]">
          <p className="font-serif text-2xl text-[#1C1C1B] italic">Your gallery is empty.</p>
          <Link
            to="/shop"
            className="mt-8 inline-block border-b border-[#1C1C1B] pb-1 text-[#1C1C1B] hover:text-[#A34A38] hover:border-[#A34A38] transition-colors text-[10px] uppercase tracking-widest font-sans font-medium no-underline"
          >
            Explore the Collection
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
