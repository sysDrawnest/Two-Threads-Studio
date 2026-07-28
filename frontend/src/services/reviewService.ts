import { apiClient } from './apiClient';

export interface SubmitReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  qualityRating?: number;
  packagingRating?: number;
  valueRating?: number;
  easeOfUseRating?: number;
  wouldRecommend?: boolean;
  images?: string[];
  videoUrl?: string;
}

export const reviewService = {
  submitReview: async (data: SubmitReviewPayload) => {
    const response = await apiClient.post('/reviews', data);
    return response;
  },

  getProductReviews: async (productId: string, params?: { page?: number; limit?: number; hasMedia?: boolean; sort?: string }) => {
    const response = await apiClient.get(`/reviews/product/${productId}`, { params });
    return response;
  },

  voteHelpful: async (reviewId: string, isHelpful: boolean) => {
    const response = await apiClient.post(`/reviews/${reviewId}/vote`, { isHelpful });
    return response;
  },

  getMyReviews: async () => {
    const response = await apiClient.get('/reviews/my-reviews');
    return response;
  },
};
