import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Context } from "./types";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isTokenExpired(accessToken: string): boolean {
  const { exp } = jwtDecode(accessToken);
  const now = Date.now() / 1000;
  if (!exp) return true;
  // Return true if expired, false otherwise
  return exp < now;
}

export function authenticateUser(context: Context): boolean {
  if (!context.auth) return false;

  if (context.auth.accessToken) {
    if (isTokenExpired(context.auth.accessToken)) {
      context.auth
        .refreshToken()
        .then()
        .catch(() => {
          return false;
        });
    }
  } else {
    // refresh token if fails return false
    context.auth
      .refreshToken()
      .then()
      .catch(() => {
        return false;
      });
  }

  return true;
}
