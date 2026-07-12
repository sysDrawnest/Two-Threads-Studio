import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  lastLogin: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  profileImage: string | null;
  preferredLanguage: string;
  marketingConsent: boolean;
  newsletterSubscribed: boolean;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummaryData {
  customerName: string;
  memberSince: string;
  wishlistCount: number;
  cartCount: number;
  savedAddresses: number;
  recentActivity: any[];
  recommendedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    imageUrl: string | null;
    imageAlt: string | null;
  }>;
}

export function useProfile() {
  return useQuery<any, Error, UserProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/profile');
      return res.data.profile;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateProfile } = useAuth();

  return useMutation<UserProfileData, Error, Partial<UserProfileData>>({
    mutationFn: async (data) => {
      const res = await apiClient.put('/profile', data);
      return res.data.profile;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'dashboard'] });
      
      // Keep AuthContext in sync
      updateProfile({
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        avatar: updatedUser.avatarUrl || undefined,
      });
    },
  });
}

export function useDashboardSummary() {
  return useQuery<any, Error, DashboardSummaryData>({
    queryKey: ['profile', 'dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/profile/dashboard');
      return res.data.summary;
    },
  });
}

export function useChangePassword() {
  return useMutation<any, Error, any>({
    mutationFn: async (data) => {
      const res = await apiClient.post('/auth/change-password', data);
      return res;
    },
  });
}

export function useLogoutAllDevices() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, Error, void>({
    mutationFn: async () => {
      const res = await apiClient.post('/auth/logout-all');
      return res;
    },
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
  });
}
