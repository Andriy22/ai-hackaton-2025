import { AuthResponse, LoginCredentials, Tokens } from "./types";

const API_BASE_URL = import.meta.env.API_BASE_URL || "http://[::1]:3000";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to login");
    }

    return response.json();
  },

  async refreshToken(): Promise<Tokens> {
    const storedData = localStorage.getItem("auth-storage");
    const objectStoredData = storedData ? JSON.parse(storedData) : {};
    const tokens = objectStoredData?.state?.tokens as Tokens;

    console.log("Current tokens:", tokens);

    if (!tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Refresh Token Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error("Failed to refresh token");
      }

      const data = (await response.json()) as Tokens;
      return data;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    // Clear tokens from localStorage
    // In a real app, you might want to invalidate the token on the server as well
    localStorage.removeItem("auth-storage");
  },
};
