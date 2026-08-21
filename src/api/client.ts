import { useAuthStore } from "../store/auth.store";
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from "../utils/storage";
import type { AuthResponse } from "../types/auth.types";

const DUMMYJSON_BASE = "https://dummyjson.com";

export class AuthError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "AuthError";
  }
}

async function requestRefreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${DUMMYJSON_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
  });

  if (!response.ok) {
    throw new AuthError("Token refresh failed");
  }

  return response.json() as Promise<AuthResponse>;
}

export async function refreshSession(): Promise<boolean> {
  const stored = getRefreshToken();

  if (!stored) {
    useAuthStore.getState().clearSession();
    return false;
  }

  try {
    const response = await requestRefreshToken(stored.token);

    saveRefreshToken(response.refreshToken, stored.remember);
    useAuthStore.getState().setSession(
      {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        image: response.image,
      },
      response.accessToken
    );

    return true;
  } catch {
    clearRefreshToken();
    useAuthStore.getState().clearSession();
    return false;
  }
}

let refreshInFlight: Promise<boolean> | null = null;

function refreshOnce(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = refreshSession().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  { authenticated = true }: { authenticated?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (authenticated) {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && authenticated) {
    const refreshed = await refreshOnce();

    if (!refreshed) {
      throw new AuthError();
    }

    headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
    response = await fetch(url, { ...options, headers });
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
