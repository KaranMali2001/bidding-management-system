import { apiClient } from "@/config/axios";
import type {
  Bid,
  CreateBidPayload,
  DeliverablePayload,
  SellerProject,
} from "@/lib/types";
import { BidForm } from "../schemas";

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

  getSellerBids: async (): Promise<SellerProject[]> => {
    const res = await apiClient.get<SellerProject[]>("/bids/mine");
    return res.data;
  },
  updateBid: async (id: string, data: BidForm): Promise<Bid> => {
    const res = await apiClient.put<Bid>(`/bids/${id}`, data);
    return res.data;
  },
  deleteBids: async (id: string): Promise<Bid> => {
    const res = await apiClient.delete<Bid>(`/bids/${id}`);
    return res.data;
  },
  uploadDeliverable: async (
    projectId: string,
    data: DeliverablePayload
  ): Promise<void> => {
    await apiClient.post<void>(`/bids/${projectId}`, data);
  },
};
