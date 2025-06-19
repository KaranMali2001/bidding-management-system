import { apiClient } from "@/config/axios";
import type { Review, ReviewPayload } from "@/lib/types";

export const reviewsApi = {
  submitReview: async (
    projectId: string,
    data: ReviewPayload
  ): Promise<Review> => {
    const res = await apiClient.post<Review>(`/reviews/${projectId}`, data);
    return res.data;
  },

  getSellerReviews: async (sellerId: string): Promise<Review[]> => {
    const res = await apiClient.get<Review[]>(`/reviews/seller/${sellerId}`);
    return res.data;
  },
};
