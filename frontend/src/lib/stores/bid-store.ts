import { create } from "zustand"
import type { Bid } from "@/lib/types"

interface BidState {
  bids: Bid[]
  isLoading: boolean
  setBids: (bids: Bid[]) => void
  addBid: (bid: Bid) => void
  setLoading: (loading: boolean) => void
}

export const useBidStore = create<BidState>((set) => ({
  bids: [],
  isLoading: false,
  setBids: (bids) => set({ bids }),
  addBid: (bid) => set((state) => ({ bids: [...state.bids, bid] })),
  setLoading: (loading) => set({ isLoading: loading }),
}))
