import type { AuthResponse } from "../types/auth.types";

export const LOCAL_CREDENTIALS = {
  username: "Tushardubey",
  password: "tushar1234",
};

export const LOCAL_PROFILE = {
  id: 1,
  username: LOCAL_CREDENTIALS.username,
  email: "riteshdubey1313@gmail.com",
  firstName: "Tushar",
  lastName: "Dubey",
  image: "",
};

export function createLocalSession(): AuthResponse {
  return {
    ...LOCAL_PROFILE,
    accessToken: `sprintdesk-access-${Date.now()}`,
    refreshToken: `sprintdesk-refresh-${Date.now()}`,
  };
}
