import { getTokenClient } from "@/utils/getTokenClient";
import { getTokenServer } from "@/utils/getTokenServer";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  let token: string | null = null;

  if (typeof window === "undefined") {
    // Server-side
    token = await getTokenServer();
  } else {
    // Client-side
    token = getTokenClient();
  }
  console.log("token", token);
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  console.log("config", config.headers);
  return config;
});
