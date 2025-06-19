import { apiClient } from "@/config/axios";
import type { Bid, CreateBidPayload, DeliverablePayload } from "@/lib/types";

export const bidsApi = {
  createBid: async (data: CreateBidPayload): Promise<Bid> => {
    const res = await apiClient.post<Bid>("/bids", data);
    return res.data;
  },

  getBidById: async (id: string): Promise<Bid> => {
    const res = await apiClient.get<Bid>(`/bids/${id}`);
    return res.data;
  },

  getBidsForProject: async (projectId: string): Promise<Bid[]> => {
    const res = await apiClient.get<Bid[]>(`/bids/project/${projectId}`);
    return res.data;
  },

  getSellerBids: async (): Promise<Bid[]> => {
    const res = await apiClient.get<Bid[]>("/bids/mine");
    return res.data;
  },

  uploadDeliverable: async (
    projectId: string,
    data: DeliverablePayload
  ): Promise<void> => {
    await apiClient.post<void>(`/bids/${projectId}`, data);
  },
};
