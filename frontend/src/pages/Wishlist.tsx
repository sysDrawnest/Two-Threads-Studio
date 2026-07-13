import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { useWishlist, useRemoveFromWishlist, useMoveToCart, WishlistItem } from '../hooks/useCommerce';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
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

  return (
    <PageContainer>
      <div className="bg-[#FAF8F5] py-16 px-6 md:px-16 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-200 pb-8">
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-2 font-semibold">
              SAVED ITEMS
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-zinc-900 tracking-tight">
              Your Wishlist
            </h1>
          </div>
          {isAuthenticated && wishlistItems && (
            <p className="font-mono text-xs text-zinc-500 mt-4 md:mt-0 uppercase tracking-wider">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto text-center py-20 border border-zinc-200 bg-white p-8">
            <h2 className="font-serif text-xl text-zinc-950 mb-2">Access Your Wishlist</h2>
            <p className="text-zinc-500 text-xs font-sans leading-relaxed mb-6">
              Please sign in or create an account to view and manage items you've saved to your wishlist.
            </p>
            <Link
              to="/login"
              className="w-full block bg-zinc-950 text-white text-xs py-3 hover:bg-zinc-800 transition-colors uppercase tracking-widest font-mono text-center no-underline"
            >
              Sign In / Register
            </Link>
          </div>
        ) : isLoading ? (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="h-40 bg-zinc-100 animate-pulse border border-zinc-200"></div>
            <div className="h-40 bg-zinc-100 animate-pulse border border-zinc-200"></div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto border border-zinc-200 p-8 text-center bg-white">
            <p className="text-zinc-600 text-sm">Failed to retrieve your saved items. Please try again.</p>
          </div>
        ) : wishlistItems && wishlistItems.length > 0 ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {wishlistItems.map((item: WishlistItem) => (
              <div key={item.id} className="bg-white p-6 border border-zinc-200 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Link to={`/shop/${item.product.id}`} className="w-full md:w-36 h-36 flex-shrink-0 bg-zinc-50 overflow-hidden border border-zinc-100">
                  <img
                    src={item.product.primaryImage || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between min-h-[9rem] w-full">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link to={`/shop/${item.product.id}`} className="font-serif text-xl font-normal text-zinc-950 no-underline hover:text-zinc-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <span className="font-mono text-sm font-medium text-zinc-900">₹{item.product.price}</span>
                    </div>
                    <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4">
                      {item.product.type} • {item.product.badge || 'Standard'}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleMoveToCart(item.productId)}
                      disabled={moveToCartMutation.isPending}
                      className="flex items-center justify-center gap-2 bg-zinc-950 text-white border border-zinc-950 px-6 py-2.5 font-mono text-[11px] tracking-widest uppercase cursor-pointer hover:bg-zinc-800 transition-colors flex-1 md:flex-none"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {moveToCartMutation.isPending ? 'MOVING...' : 'MOVE TO CART'}
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="flex items-center justify-center gap-2 bg-transparent text-zinc-500 border border-zinc-200 px-6 py-2.5 font-mono text-[11px] tracking-widest uppercase cursor-pointer hover:border-black hover:text-black transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {removeFromWishlistMutation.isPending ? 'REMOVING...' : 'REMOVE'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-zinc-200 bg-white max-w-7xl mx-auto p-12">
            <p className="font-sans text-sm text-zinc-500 italic mb-6">Your wishlist is currently empty.</p>
            <Link 
              to="/shop"
              className="bg-zinc-950 text-white px-8 py-3.5 font-mono text-xs tracking-widest uppercase cursor-pointer hover:bg-zinc-800 transition-colors no-underline inline-block"
            >
              Explore Shop
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Wishlist;
