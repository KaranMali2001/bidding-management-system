import { apiClient } from "@/config/axios";
import type { LoginPayload, RegisterPayload, User } from "@/lib/types";

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (data: LoginPayload) => {
    const res = await apiClient.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterPayload) => {
    const res = await apiClient.post<AuthResponse>("/auth/register", data);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.post("/auth/getCurrentUser");
    console.log("res", res);
    return res.data;
  },
};
