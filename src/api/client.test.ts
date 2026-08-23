import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./client";
import { useAuthStore } from "../store/auth.store";
import { clearRefreshToken, saveRefreshToken } from "../utils/storage";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("auth interceptor", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);

    saveRefreshToken("stored-refresh-token", true);
    useAuthStore.setState({
      user: null,
      accessToken: "expired-token",
      status: "authenticated",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("attaches the bearer token to authenticated requests", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));

    await apiFetch("https://api.example.com/data");

    const request = fetchMock.mock.calls[0]![1] as RequestInit;
    const headers = request.headers as Record<string, string>;

    expect(headers.Authorization).toBe("Bearer expired-token");
  });

  it("refreshes once on 401 and retries with the new token", async () => {
    const authorizationHeaders: Array<string | undefined> = [];

    fetchMock.mockImplementation(async (_url: string, options?: RequestInit) => {
      const headers = (options?.headers ?? {}) as Record<string, string>;
      authorizationHeaders.push(headers.Authorization);

      if (headers.Authorization !== "Bearer expired-token") {
        return jsonResponse({ data: "payload" });
      }

      return jsonResponse({ message: "Invalid token" }, 401);
    });

    const result = await apiFetch<{ data: string }>(
      "https://api.example.com/data"
    );

    expect(result.data).toBe("payload");
    expect(authorizationHeaders).toHaveLength(2);
    expect(authorizationHeaders[0]).toBe("Bearer expired-token");
    expect(useAuthStore.getState().accessToken).toBe(
      authorizationHeaders[1]!.replace("Bearer ", "")
    );
    expect(useAuthStore.getState().user?.firstName).toBe("Tushar");
    expect(useAuthStore.getState().user?.email).toBe(
      "riteshdubey1313@gmail.com"
    );
  });

  it("clears the session and throws when no refresh token is stored", async () => {
    clearRefreshToken();
    fetchMock.mockResolvedValue(jsonResponse({ error: "denied" }, 401));

    await expect(apiFetch("https://api.example.com/data")).rejects.toThrow();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().status).toBe("unauthenticated");
  });

  it("does not retry unauthenticated requests on 401", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "denied" }, 401));

    await expect(
      apiFetch("https://api.example.com/open", {}, { authenticated: false })
    ).rejects.toThrow();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
