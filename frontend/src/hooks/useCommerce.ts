import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

// Helper to ensure guest identification
export const getOrCreateGuestId = (): string => {
  let guestId = localStorage.getItem('tts_guest_id');
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    localStorage.setItem('tts_guest_id', guestId);
  }
  return guestId;
};

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  primaryImage: string;
  sku: string;
  variantName: string | null;
  customization: Record<string, any> | null;
  giftWrap: boolean;
  engravingText: string | null;
  isOutOfStock: boolean;
  availableStock: number;
  trackInventory: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    grandTotal: number;
    totalItems: number;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    status: string;
    type: string;
    badge: string | null;
    primaryImage: string | null;
    primaryImageAlt: string | null;
  };
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  company: string | null;
  line1: string;
  line2: string | null;
  city: string;
  district: string | null;
  state: string;
  country: string;
  postalCode: string;
  landmark: string | null;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt: string;
}

// ─── CART HOOKS ───────────────────────────────────────────────────────────────

export const useCart = () => {
  // Read the guest id on invocation to ensure it exists if the user is a guest
  getOrCreateGuestId();

  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await apiClient.get('/cart');
      return response.cart;
    },
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      variantId?: string | null;
      quantity: number;
      customization?: Record<string, any> | null;
      giftWrap?: boolean;
      engravingText?: string | null;
    }) => {
      return apiClient.post('/cart/items', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      quantity?: number;
      customization?: Record<string, any> | null;
      giftWrap?: boolean;
      engravingText?: string | null;
    }) => {
      const { id, ...data } = payload;
      return apiClient.patch(`/cart/items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return apiClient.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiClient.delete('/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ─── WISHLIST HOOKS ───────────────────────────────────────────────────────────

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await apiClient.get('/wishlist');
      return response.wishlist;
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return apiClient.post('/wishlist', { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['profile-dashboard'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return apiClient.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['profile-dashboard'] });
    },
  });
};

export const useMoveToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      variantId?: string | null;
      quantity?: number;
      customization?: Record<string, any> | null;
      giftWrap?: boolean;
      engravingText?: string | null;
    }) => {
      const { productId, ...data } = payload;
      return apiClient.post(`/wishlist/${productId}/move-to-cart`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['profile-dashboard'] });
    },
  });
};

// ─── ADDRESS BOOK HOOKS ───────────────────────────────────────────────────────

export const useAddresses = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/addresses');
      return response.addresses;
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<Address, 'id' | 'createdAt'>) => {
      return apiClient.post('/addresses', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Address> }) => {
      return apiClient.put(`/addresses/${payload.id}`, payload.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      return apiClient.delete(`/addresses/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; type: 'shipping' | 'billing' | 'both' }) => {
      return apiClient.patch(`/addresses/${payload.id}/default`, { type: payload.type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
