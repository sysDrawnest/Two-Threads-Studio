import React, { useState } from 'react';
import { CartItem as CartItemType, useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCommerce';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();

  const [showCustomization, setShowCustomization] = useState(false);
  const [hoopFinish, setHoopFinish] = useState<string>(
    item.customization?.hoopFinish || 'bamboo'
  );
  const [giftWrap, setGiftWrap] = useState<boolean>(item.giftWrap);
  const [engravingText, setEngravingText] = useState<string>(item.engravingText || '');

  const handleSaveCustomization = async () => {
    try {
      await updateCartItemMutation.mutateAsync({
        id: item.id,
        customization: { hoopFinish },
        giftWrap,
        engravingText: engravingText.trim() || null,
      });
      setShowCustomization(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update customization.');
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateCartItemMutation.mutateAsync({
        id: item.id,
        quantity: newQty,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity.');
    }
  };

  const handleRemove = async () => {
    try {
      await removeCartItemMutation.mutateAsync(item.id);
    } catch (err: any) {
      alert(err.message || 'Failed to remove item.');
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex gap-4 items-start">
        <div className="w-20 h-24 bg-[#FAF9F7] flex-shrink-0 border border-neutral-100 rounded-sm overflow-hidden">
          <img src={item.primaryImage || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between min-h-[6rem] py-0.5">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-sm text-[#1C1C1B] leading-tight">{item.productName}</h3>
                {item.variantName && (
                  <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">
                    Variant: {item.variantName}
                  </p>
                )}
              </div>
              <span className="font-sans text-sm font-semibold text-[#1C1C1B] ml-4 whitespace-nowrap">₹{item.totalPrice.toLocaleString()}</span>
            </div>
            
            {/* Customization Badges */}
            {(hoopFinish || engravingText || giftWrap) && (
              <div className="mt-2 text-[11px] text-neutral-500 flex flex-col gap-0.5 font-mono">
                {hoopFinish && (
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A34A38]" />
                    <span>Hoop Finish: <span className="font-medium text-[#1C1C1B] capitalize">{hoopFinish}</span></span>
                  </p>
                )}
                {engravingText && (
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A34A38]" />
                    <span>Engraving: <span className="font-medium text-[#1C1C1B]">"{engravingText}"</span></span>
                  </p>
                )}
                {giftWrap && (
                  <p className="flex items-center gap-1.5 text-[#A34A38] font-medium font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A34A38]" />
                    <span>Luxury Gift Wrap Added</span>
                  </p>
                )}
              </div>
            )}
            
            <button 
              onClick={() => setShowCustomization(!showCustomization)}
              className="font-sans text-[10px] uppercase tracking-widest text-[#A34A38] hover:text-[#83382a] underline bg-transparent border-none cursor-pointer mt-2 text-left p-0"
            >
              {showCustomization ? 'Cancel Customization' : 'Edit Customization / Gift'}
            </button>
          </div>
          
          <div className="flex justify-between items-end mt-3">
            <div className="flex items-center border border-neutral-200">
              <button 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={updateCartItemMutation.isPending}
                className="px-2.5 py-0.5 bg-transparent border-none cursor-pointer text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-50" 
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-sans text-xs text-[#1C1C1B] px-2">{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={updateCartItemMutation.isPending}
                className="px-2.5 py-0.5 bg-transparent border-none cursor-pointer text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-50" 
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleRemove}
              disabled={removeCartItemMutation.isPending}
              className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 hover:text-[#A34A38] bg-transparent border-none cursor-pointer underline transition-colors disabled:opacity-50"
            >
              {removeCartItemMutation.isPending ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Customization Form Accordion */}
      {showCustomization && (
        <div className="bg-[#FAF9F7] p-4 border border-neutral-200/60 text-xs rounded-sm space-y-4">
          <h4 className="font-serif text-sm text-[#1C1C1B]">Customization</h4>
          
          {/* Hoop Finish selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Hoop Finish Selection</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setHoopFinish('bamboo')}
                className={`py-1.5 px-3 border text-[10px] uppercase tracking-wider font-mono ${
                  hoopFinish === 'bamboo' 
                    ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                Bamboo
              </button>
              <button 
                onClick={() => setHoopFinish('walnut')}
                className={`py-1.5 px-3 border text-[10px] uppercase tracking-wider font-mono ${
                  hoopFinish === 'walnut' 
                    ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                Walnut (+ ₹500)
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={giftWrap} 
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38]"
              />
              <span className="font-mono text-[11px]">Luxury Gift Wrap Added</span>
            </label>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Engraving Text (Optional)</label>
            <input 
              type="text" 
              maxLength={25}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value)}
              className="w-full p-2 text-xs border border-neutral-200 focus:border-[#A34A38] focus:outline-none bg-white text-neutral-800"
              placeholder="e.g. Initials (max 25 chars)"
            />
          </div>
          
          <button 
            onClick={handleSaveCustomization}
            disabled={updateCartItemMutation.isPending}
            className="w-full bg-[#1C1C1B] text-[#FAF9F7] py-2 text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors border-none cursor-pointer rounded-sm font-mono"
          >
            {updateCartItemMutation.isPending ? 'Saving...' : 'Save Customization'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItem;
