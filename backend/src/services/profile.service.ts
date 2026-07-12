import prisma from '../prisma';
import { userRepository, SafeUser } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { UpdateProfileDto } from '../validators/profile.validator';

export const profileService = {
  /**
   * Get the profile details of a user.
   */
  getProfile: async (userId: string): Promise<SafeUser> => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  },

  /**
   * Update profile details.
   */
  updateProfile: async (userId: string, dto: UpdateProfileDto): Promise<SafeUser> => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Clean up empty strings or values before updating
    const updateData: any = {};
    if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
    if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl || null;
    if (dto.dateOfBirth !== undefined) updateData.dateOfBirth = dto.dateOfBirth;
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.profileImage !== undefined) updateData.profileImage = dto.profileImage || null;
    if (dto.preferredLanguage !== undefined) updateData.preferredLanguage = dto.preferredLanguage;
    if (dto.newsletterSubscribed !== undefined) updateData.newsletterSubscribed = dto.newsletterSubscribed;
    if (dto.marketingConsent !== undefined) updateData.marketingConsent = dto.marketingConsent;

    const updatedUser = await userRepository.updateProfile(userId, updateData);
    return updatedUser;
  },

  /**
   * Fetch dashboard summary for the authenticated user.
   */
  getDashboardSummary: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // 1. Wishlist Count
    const wishlistCount = await prisma.wishlist.count({
      where: { userId },
    });

    // 2. Cart Count (sum of item quantities)
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });
    const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // 3. Saved Addresses Count (not soft-deleted)
    const addressCount = await prisma.address.count({
      where: { userId, deletedAt: null },
    });

    // 4. Recommended Products (fetch up to 4 featured products)
    const recommendedProducts = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        featured: true,
      },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: {
          where: { isPrimary: true },
          select: { url: true, altText: true },
          take: 1,
        },
      },
    });

    // Format recommended products to include primary image directly
    const formattedRecommendations = recommendedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      imageUrl: p.images[0]?.url || null,
      imageAlt: p.images[0]?.altText || null,
    }));

    return {
      customerName: `${user.firstName} ${user.lastName}`.trim(),
      memberSince: user.memberSince,
      wishlistCount,
      cartCount,
      savedAddresses: addressCount,
      recentActivity: [], // Placeholder as requested (empty for now)
      recommendedProducts: formattedRecommendations,
    };
  },
};
