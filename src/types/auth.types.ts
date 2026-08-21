export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface AuthResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}