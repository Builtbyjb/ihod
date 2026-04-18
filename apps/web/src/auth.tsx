import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { type User, type AuthState, type AuthResponse } from "@/lib/types";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const responseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
  }),
});

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/logout`, {
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setAccessToken(null);
      navigate({ to: "/login" });
    }
  };

  const refreshToken = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/v1/refresh-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data: AuthResponse = await response.json();
    const parsed = responseSchema.parse(data);
    return parsed;
  }, []);

  // Restore auth state on app load
  useEffect(() => {
    const handleLoad = async () => {
      setIsLoading(true);
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        console.error(error);
        toast.error("Failed to refresh token");
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
    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      const parsed = responseSchema.parse(data);
      setUser(parsed.user);
      setAccessToken(parsed.accessToken);
      return response.ok;
    } else {
      throw new Error("Authentication failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, login, logout, refreshToken }}
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
