import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, useRemoveFromWishlist, useMoveToCart, WishlistItem } from '../../hooks/useCommerce';
import { Trash2, ShoppingBag } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';

export const WishlistTab: React.FC = () => {
  const { data: wishlistItems, isLoading, error } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const moveToCartMutation = useMoveToCart();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlistMutation.mutateAsync(productId);
    } catch (err: any) {
      alert(err.message || 'Failed to remove product from wishlist.');
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await moveToCartMutation.mutateAsync({ productId, quantity: 1 });
    } catch (err: any) {
      alert(err.message || 'Failed to move product to cart.');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="border border-zinc-200 p-8 text-center bg-zinc-50">
        <p className="text-zinc-600 text-sm">Failed to retrieve saved items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-xl font-medium tracking-tight text-zinc-950 font-sans">My Wishlist</h2>
        <p className="text-zinc-500 text-xs mt-1">Saved items you'd like to purchase later</p>
      </div>

      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="flex flex-col gap-4">
          {wishlistItems.map((item: WishlistItem) => (
            <div key={item.id} className="bg-white p-4 border border-zinc-200 flex gap-6 items-start">
              <Link to={`/shop/${item.product.id}`} className="w-24 h-24 flex-shrink-0 bg-zinc-50 border border-zinc-100 overflow-hidden">
                <img
                  src={item.product.primaryImage || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-h-[6rem]">
                <div>
                  <div className="flex justify-between items-start">
                    <Link to={`/shop/${item.product.id}`} className="text-base font-medium text-zinc-900 no-underline hover:text-zinc-600">
                      {item.product.name}
                    </Link>
                    <span className="font-mono text-sm text-zinc-900">₹{item.product.price}</span>
                  </div>
                  <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">
                    {item.product.type}
                  </p>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleMoveToCart(item.productId)}
                    disabled={moveToCartMutation.isPending}
                    className="flex items-center gap-1.5 bg-zinc-950 text-white px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removeFromWishlistMutation.isPending}
                    className="flex items-center gap-1.5 bg-transparent text-zinc-500 border border-zinc-200 px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase cursor-pointer hover:border-black hover:text-black transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-zinc-200 p-12 text-center bg-zinc-50/50">
          <p className="text-zinc-500 text-sm italic">Your wishlist is currently empty.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-zinc-950 text-white text-xs px-6 py-2.5 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono no-underline"
          >
            Explore Shop
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
