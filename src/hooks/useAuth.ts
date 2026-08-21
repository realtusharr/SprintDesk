import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { loginRequest } from "../api/auth.api";
import { refreshSession } from "../api/client";
import { clearRefreshToken, saveRefreshToken } from "../utils/storage";
import type { AuthUser } from "../types/auth.types";

export function useSessionBootstrap() {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status !== "bootstrapping") return;

    void refreshSession();
  }, [status]);
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  return useCallback(
    async (
      username: string,
      password: string,
      remember: boolean
    ): Promise<AuthUser> => {
      const response = await loginRequest(username.trim(), password);

      saveRefreshToken(response.refreshToken, remember);
      setSession(
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

      navigate("/dashboard", { replace: true });

      return response;
    },
    [navigate, setSession]
  );
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  return useCallback(() => {
    clearRefreshToken();
    clearSession();
    navigate("/login", { replace: true });
  }, [clearSession, navigate]);
}
