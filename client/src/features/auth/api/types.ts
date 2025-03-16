export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string | null;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
