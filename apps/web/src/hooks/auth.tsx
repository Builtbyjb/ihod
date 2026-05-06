import React, { createContext, useContext, useState } from "react";
import type { AnyRouter } from "@tanstack/react-router";
import type { User, AuthState, AuthResponse } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { useFetch } from "@/hooks/useFetch";

const responseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    username: z.string(),
    organizationName: z.string(),
    email: z.string().email(),
  }),
});

const AuthContext = createContext<AuthState | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  router: AnyRouter;
};

export function AuthProvider({ children, router }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { doGET, doPOST } = useFetch();

  const logout = async () => {
    try {
      const response = await doGET("/api/v1/auth/logout");
      if (response instanceof Error) throw response;
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setAccessToken(null);
      await router.navigate({ to: "/login" });
    }
  };

  const isTokenExpired = (accessToken: string): boolean => {
    try {
      const { exp } = jwtDecode(accessToken);

      if (exp === undefined) return true;

      const now = Date.now() / 1000;
      return exp < now;
    } catch {
      // If the token can't be decoded, treat it as expired
      return true;
    }
  };

  const refreshToken = async (): Promise<AuthResponse> => {
    const response = await doGET("/api/v1/auth/refresh-token");
    if (response instanceof Error) throw response;

    if (!response.ok) throw new Error("Failed to refresh token");

    const data: AuthResponse = await response.json();
    const parsed = responseSchema.parse(data);
    setAccessToken(parsed.accessToken);
    setUser(parsed.user);
    return parsed;
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      if (!accessToken || isTokenExpired(accessToken)) {
        // Refresh token is no access token or access token as expired
        await refreshToken();
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const response = await doPOST("/api/v1/auth/login", { email });
    if (response instanceof Error) throw response;

    if (response.ok) return response.ok;
    else throw new Error("Authentication failed");
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    const response = await doPOST("/api/v1/auth/verify-otp", { otp });
    if (response instanceof Error) throw response;

    if (!response.ok) throw new Error("Failed to verify OTP");

    const data = await response.json();
    const parsed = responseSchema.parse(data);

    setAccessToken(parsed.accessToken);
    setUser(parsed.user);

    return response.ok;
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, refreshToken, verifyOtp, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
