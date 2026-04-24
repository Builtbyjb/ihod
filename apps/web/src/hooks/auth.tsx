import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AnyRouter } from "@tanstack/react-router";
import type { User, AuthState, AuthResponse } from "@/lib/types";
import { z } from "zod";

const responseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    username: z.string(),
    organizationName: z.string(),
    email: z.string().email(),
    currency: z.string()
  })
});

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext<AuthState | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  router: AnyRouter;
}

export function AuthProvider({ children, router, }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setAccessToken(null);
      await router.navigate({ to: "/login" });
    }
  };

  const refreshToken = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data: AuthResponse = await response.json();
    const parsed = responseSchema.parse(data);
    return parsed;
  }, []);

  // Restore auth state on app load
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await refreshToken();

        setAccessToken(data.accessToken);
        setUser(data.user);

      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })()

  }, [refreshToken]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const login = async (email: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) return response.ok;
    else throw new Error("Authentication failed");
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    if (!response.ok) throw new Error("Failed to verify OTP");

    const data = await response.json();
    const parsed = responseSchema.parse(data);

    setAccessToken(parsed.accessToken);
    setUser(parsed.user)

    return response.ok;
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, refreshToken, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
