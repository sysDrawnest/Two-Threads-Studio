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
    item.customization || { isGift: false, giftMessage: '', engravingText: '' }
  );

  const handleCustomizationChange = (field: keyof CustomizationOptions, value: string | boolean) => {
    setLocalCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCustomization = () => {
    updateCustomization(item.id, localCustomization);
    setShowCustomization(false);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-outline-variant pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex gap-4 items-start">
        <div className="w-24 h-32 bg-surface-container flex-shrink-0">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between min-h-[8rem] py-1">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-lg text-primary-container leading-tight">{item.name}</h3>
              <span className="font-serif text-lg text-primary-container ml-4 whitespace-nowrap">${item.price}</span>
            </div>
            
            {(item.customization?.engravingText || item.customization?.isGift) && (
              <div className="mt-2 text-xs text-on-surface-variant italic">
                {item.customization.engravingText && <p>Engraving: "{item.customization.engravingText}"</p>}
                {item.customization.isGift && <p>Gift option added</p>}
              </div>
            )}
            
            <button 
              onClick={() => setShowCustomization(!showCustomization)}
              className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary-container underline bg-transparent border-none cursor-pointer mt-2 text-left p-0"
            >
              {showCustomization ? 'Cancel Customization' : 'Add Customization / Gift'}
            </button>
          </div>
          
          <div className="flex justify-between items-end mt-4">
            <div className="flex items-center border border-outline-variant">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-1 bg-transparent border-none cursor-pointer text-primary-container hover:bg-surface-variant transition-colors" 
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-sans text-sm text-primary-container px-2">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 bg-transparent border-none cursor-pointer text-primary-container hover:bg-surface-variant transition-colors" 
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary-container bg-transparent border-none cursor-pointer underline transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      {/* Customization Form Accordion */}
      {showCustomization && (
        <div className="bg-surface-variant/30 p-4 border border-outline-variant text-sm">
          <h4 className="font-serif text-primary-container mb-3">Customization</h4>
          
          <div className="mb-4">
            <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
              <input 
                type="checkbox" 
                checked={localCustomization.isGift} 
                onChange={(e) => handleCustomizationChange('isGift', e.target.checked)}
                className="accent-primary-container"
              />
              This item is a gift
            </label>
          </div>
          
          {localCustomization.isGift && (
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Gift Message (Optional)</label>
              <textarea 
                rows={2}
                value={localCustomization.giftMessage || ''}
                onChange={(e) => handleCustomizationChange('giftMessage', e.target.value)}
                className="w-full p-2 text-sm border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent"
                placeholder="Write a message..."
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Engraving Text (Optional)</label>
            <input 
              type="text" 
              maxLength={15}
              value={localCustomization.engravingText || ''}
              onChange={(e) => handleCustomizationChange('engravingText', e.target.value)}
              className="w-full p-2 text-sm border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent"
              placeholder="e.g. Initials (max 15 chars)"
            />
          </div>
          
          <button 
            onClick={handleSaveCustomization}
            className="w-full bg-primary-container text-inverse-on-surface py-2 text-xs uppercase tracking-widest hover:bg-[#5a3d2b] transition-colors border-none cursor-pointer"
          >
            Save Customization
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItem;
