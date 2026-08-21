const REFRESH_KEY = "sprintdesk-refresh-token";
const REMEMBER_KEY = "sprintdesk-remember-me";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredToken {
  token: string;
  expiresAt: number;
}

function getStorage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function saveRefreshToken(token: string, remember: boolean): void {
  const payload: StoredToken = {
    token,
    expiresAt: Date.now() + THIRTY_DAYS_MS,
  };

  clearRefreshToken();
  getStorage(remember).setItem(REFRESH_KEY, JSON.stringify(payload));
  localStorage.setItem(REMEMBER_KEY, String(remember));
}

export function getRefreshToken(): { token: string; remember: boolean } | null {
  for (const remember of [true, false]) {
    const raw = getStorage(remember).getItem(REFRESH_KEY);

    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as StoredToken;

      if (Date.now() >= parsed.expiresAt) {
        clearRefreshToken();
        return null;
      }

      return { token: parsed.token, remember };
    } catch {
      clearRefreshToken();
      return null;
    }
  }

  return null;
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}
