import { apiRequest } from "./client";
import type { AuthResponse } from "../types/auth.types";

export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 30,
    }),
  });
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 30,
    }),
  });
}