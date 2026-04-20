import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AnyRouter } from "@tanstack/react-router";
import type { User, AuthState, AuthResponse, OTPResponse } from "@/lib/types";
// import { toast } from "sonner";
import { z } from "zod";

const otpResponseSchema = z.object({
  accessToken: z.string(),
  setupCompleted: z.boolean(),
});

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({
  children,
  router,
}: {
  children: React.ReactNode;
  router: AnyRouter;
}) {
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

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data: AuthResponse = await response.json();
    // const parsed = responseSchema.parse(data);
    return data;
  }, []);

  // Restore auth state on app load
  useEffect(() => {
    const handleLoad = async () => {
      setIsLoading(true);
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
        // setUser(data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    handleLoad();
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

    if (response.ok) {
      return response.ok;
    } else {
      throw new Error("Authentication failed");
    }
  };

  const verifyOtp = async (otp: string): Promise<OTPResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify OTP");
    }

    const data = await response.json();
    const otpData = otpResponseSchema.parse(data);
    setAccessToken(otpData.accessToken);
    return otpData;
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, login, logout, refreshToken, verifyOtp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
