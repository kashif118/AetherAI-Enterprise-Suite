import { MOCK_LATENCY } from "@/lib/constants";
import { currentUser, organization } from "@/lib/mock/users";
import type { LoginCredentials, RegisterPayload, Session } from "@/types";
import { ApiError, request, type RequestOptions } from "./api-client";

/**
 * Front-end-only auth. Nothing is persisted and no credentials leave the
 * browser — the forms exist so the sign-in and sign-up experiences are complete
 * and testable. Swap these three functions for real endpoints later.
 */

export function getSession(options?: RequestOptions): Promise<Session> {
  return request({ user: currentUser, organization }, {
    latency: MOCK_LATENCY.fast,
    ...options,
  });
}

export async function login(
  credentials: LoginCredentials,
  options?: RequestOptions,
): Promise<Session> {
  return request(() => {
    // A deterministic failure path so the error state is reachable in the demo.
    if (credentials.password.toLowerCase() === "wrong") {
      throw new ApiError(
        "That email and password don't match. Check both and try again.",
        401,
        "invalid_credentials",
      );
    }
    return { user: { ...currentUser, email: credentials.email }, organization };
  }, options);
}

export async function register(
  payload: RegisterPayload,
  options?: RequestOptions,
): Promise<Session> {
  return request(() => {
    if (payload.email.endsWith("@gmail.com")) {
      throw new ApiError(
        "AetherAI requires a work email address. Personal accounts aren't supported on enterprise plans.",
        422,
        "personal_email",
      );
    }
    return {
      user: {
        ...currentUser,
        name: payload.name,
        email: payload.email,
        initials: payload.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join(""),
      },
      organization: { ...organization, name: payload.company },
    };
  }, options);
}
