import { apiFetch } from "./client";
import type { AuthResponse } from "../types/auth.types";

const DUMMYJSON_BASE = "https://dummyjson.com";

export async function loginRequest(
  username: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(`${DUMMYJSON_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });
}
