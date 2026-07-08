import React, { useState } from 'react';
import { useCartStore, CartItem as CartItemType, CustomizationOptions } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateCustomization = useCartStore((state) => state.updateCustomization);

  const [showCustomization, setShowCustomization] = useState(false);
  // Local state to prevent continuous re-renders of the cart while typing
  const [localCustomization, setLocalCustomization] = useState<CustomizationOptions>(
    item.customization || { isGift: false, giftMessage: '', engravingText: '', hoopFinish: 'bamboo' }
  );

  const handleCustomizationChange = (field: keyof CustomizationOptions, value: string | boolean) => {
    setLocalCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCustomization = () => {
    updateCustomization(item.id, localCustomization);
    setShowCustomization(false);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex gap-4 items-start">
        <div className="w-20 h-24 bg-[#FAF9F7] flex-shrink-0 border border-neutral-100 rounded-sm">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between min-h-[6rem] py-0.5">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-base text-[#1C1C1B] leading-tight">{item.name}</h3>
              <span className="font-sans text-sm font-semibold text-[#1C1C1B] ml-4 whitespace-nowrap">₹{item.price.toLocaleString()}</span>
            </div>
            
            {/* Customization Badges */}
            {(item.customization?.hoopFinish || item.customization?.engravingText || item.customization?.isGift) && (
              <div className="mt-1 text-[11px] text-neutral-500 flex flex-col gap-0.5">
                {item.customization.hoopFinish && (
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A34A38]" />
                    <span>Hoop Finish: <span className="font-medium text-[#1C1C1B] capitalize">{item.customization.hoopFinish}</span></span>
                  </p>
                )}
                {item.customization.engravingText && (
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A34A38]" />
                    <span>Engraving: <span className="font-medium text-[#1C1C1B]">"{item.customization.engravingText}"</span> <span className="text-[9px] uppercase tracking-wider text-neutral-400">({item.customization.engravingFont || 'serif'})</span></span>
                  </p>
                )}
                {item.customization.isGift && (
                  <p className="flex items-center gap-1.5 text-[#A34A38] font-medium">
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
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2.5 py-0.5 bg-transparent border-none cursor-pointer text-neutral-600 hover:bg-neutral-100 transition-colors" 
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-sans text-xs text-[#1C1C1B] px-2">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2.5 py-0.5 bg-transparent border-none cursor-pointer text-neutral-600 hover:bg-neutral-100 transition-colors" 
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 hover:text-[#A34A38] bg-transparent border-none cursor-pointer underline transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      {/* Customization Form Accordion */}
      {showCustomization && (
        <div className="bg-[#FAF9F7] p-4 border border-neutral-200/60 text-xs rounded-sm">
          <h4 className="font-serif text-sm text-[#1C1C1B] mb-3">Customization</h4>
          
          {/* Hoop Finish selection */}
          <div className="mb-3">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Hoop Finish Selection</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleCustomizationChange('hoopFinish', 'bamboo')}
                className={`py-1.5 px-3 border text-[10px] uppercase tracking-wider ${
                  localCustomization.hoopFinish === 'bamboo' 
                    ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                Bamboo
              </button>
              <button 
                onClick={() => handleCustomizationChange('hoopFinish', 'walnut')}
                className={`py-1.5 px-3 border text-[10px] uppercase tracking-wider ${
                  localCustomization.hoopFinish === 'walnut' 
                    ? 'border-[#1C1C1B] bg-[#1C1C1B] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                Walnut (+ ₹500)
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={localCustomization.isGift} 
                onChange={(e) => handleCustomizationChange('isGift', e.target.checked)}
                className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38]"
              />
              <span>This item is a gift</span>
            </label>
          </div>
          
          {localCustomization.isGift && (
            <div className="mb-3">
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Gift Message (Optional)</label>
              <textarea 
                rows={2}
                value={localCustomization.giftMessage || ''}
                onChange={(e) => handleCustomizationChange('giftMessage', e.target.value)}
                className="w-full p-2 text-xs border border-neutral-200 focus:border-[#A34A38] focus:outline-none bg-white text-neutral-800"
                placeholder="Write a message..."
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Engraving Text (Optional)</label>
            <input 
              type="text" 
              maxLength={25}
              value={localCustomization.engravingText || ''}
              onChange={(e) => handleCustomizationChange('engravingText', e.target.value)}
              className="w-full p-2 text-xs border border-neutral-200 focus:border-[#A34A38] focus:outline-none bg-white text-neutral-800"
              placeholder="e.g. Initials (max 25 chars)"
            />
          </div>
          
          <button 
            onClick={handleSaveCustomization}
            className="w-full bg-[#1C1C1B] text-[#FAF9F7] py-2 text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors border-none cursor-pointer rounded-sm"
          >
            Save Customization
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItem;
