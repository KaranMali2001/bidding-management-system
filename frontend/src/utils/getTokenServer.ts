"use server";
import { cookies } from "next/headers";

export async function getTokenServer() {
  const token = (await cookies()).get("Authorization")?.value;

  return token || "";
}
