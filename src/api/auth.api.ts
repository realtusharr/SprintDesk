import { createLocalSession, LOCAL_CREDENTIALS } from "./local-auth";
import type { AuthResponse } from "../types/auth.types";

export async function loginRequest(
  username: string,
  password: string
): Promise<AuthResponse> {
  const matchesUsername =
    username.trim().toLowerCase() ===
    LOCAL_CREDENTIALS.username.toLowerCase();
  const matchesPassword = password === LOCAL_CREDENTIALS.password;

  if (!matchesUsername || !matchesPassword) {
    throw new Error("Invalid username or password");
  }

  return createLocalSession();
}
