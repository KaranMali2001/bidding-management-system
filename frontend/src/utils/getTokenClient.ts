import { getCookie } from "cookies-next/client";
export function getTokenClient() {
  return getCookie("Authorization") || "";
}
