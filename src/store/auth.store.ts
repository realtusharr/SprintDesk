import { create } from "zustand";
import type { AuthUser } from "../types/auth.types";

export type AuthStatus = "bootstrapping" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;

  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: "bootstrapping",

  setSession: (user, accessToken) =>
    set({ user, accessToken, status: "authenticated" }),

  clearSession: () =>
    set({ user: null, accessToken: null, status: "unauthenticated" }),
}));
