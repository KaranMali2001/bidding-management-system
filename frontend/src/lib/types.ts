export interface User {
  id: string;
  email: string;
  role: "BUYER" | "SELLER";
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: "Pending" | "IN_PROGRESS" | "COMPLETED";
  buyerId: string;
  selectedBidId?: string;
  createdAt: string;
  updatedAt: string;
  bids?: Bid[];
  buyer?: User;
}

export interface Bid {
  id: string;
  projectId: string;
  sellerId: string;
  amount: number;
  estimatedTime: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  seller?: User;
  project?: Project;
}

export interface Review {
  id: string;
  projectId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  buyer?: User;
  seller?: User;
  project?: Project;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: "BUYER" | "SELLER";
  name?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
}

export interface CreateBidPayload {
  projectId: string;
  amount: number;
  estimatedTime: string;
  message: string;
}

export interface DeliverablePayload {
  fileUrl: string;
}

export interface ReviewPayload {
  rating: number;
  review: string;
}
export interface JwtPayload {
  userId: string;
  role: "BUYER" | "SELLER";
}
