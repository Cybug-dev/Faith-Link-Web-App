/**
 * Auth boundary for the UI, backed by Neon Auth (`@neondatabase/auth`).
 *
 * Pages depend only on `AuthClient` and `AuthError`, never on the SDK, so the
 * provider can change without touching screens. Tests swap in
 * `src/test/fake-auth-client.ts` (see `src/test/setup.ts`).
 * Contract: Faith-Link-Backend/docs/AI/FEATURES/auth-and-profile.md.
 */
import { createAuthClient, isAuthError } from "@neondatabase/auth";
import { BetterAuthVanillaAdapter } from "@neondatabase/auth/vanilla";
import { AuthError, type AuthErrorCode } from "./auth-errors";

export { AuthError, type AuthErrorCode } from "./auth-errors";

export type AuthClient = {
  /** `rememberMe` false ends the session when the browser closes; true keeps it (Neon default: 7 days, renewed on use). */
  signInWithEmail(input: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<void>;
  /** Always resolves for a well-formed request, even for an existing email (anti-enumeration). */
  signUpWithEmail(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  verifyEmail(input: { email: string; otp: string }): Promise<void>;
  resendVerificationCode(input: { email: string }): Promise<void>;
  /** Leaves the page for Google; resolves only if the redirect could not start. */
  signInWithGoogle(): Promise<void>;
  /** Always resolves for a well-formed email, even an unknown one (anti-enumeration). */
  requestPasswordReset(input: { email: string }): Promise<void>;
  /** Checks a reset code without using it up, so the new-password step only appears for a valid code. */
  checkResetCode(input: { email: string; otp: string }): Promise<void>;
  resetPassword(input: {
    email: string;
    otp: string;
    password: string;
  }): Promise<void>;
};

/** Where Google sends people back to after a successful sign-in. */
const AFTER_SIGN_IN_PATH = "/home";

const createNeon = (url: string) =>
  createAuthClient(url, { adapter: BetterAuthVanillaAdapter() });
type NeonClient = ReturnType<typeof createNeon>;
let neon: NeonClient | null = null;

/** Created on first use so importing this module (tests, build) needs no env or network. */
function getNeon(): NeonClient {
  if (neon) return neon;
  const url = import.meta.env.VITE_NEON_AUTH_URL;
  if (!url)
    throw new Error(
      "VITE_NEON_AUTH_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  neon = createNeon(url);
  return neon;
}

/**
 * Maps SDK errors to the UI's codes. Neon reports OTP problems as a generic
 * `validation_failed` and only the message tells "invalid" from "expired".
 */
function toAuthError(error: unknown): AuthError {
  if (!isAuthError(error)) return new AuthError("UNKNOWN");
  const message = error.message.toLowerCase();
  switch (error.code) {
    case "invalid_credentials":
      return new AuthError("INVALID_CREDENTIALS");
    case "email_not_confirmed":
      return new AuthError("EMAIL_NOT_VERIFIED");
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return new AuthError("RATE_LIMITED");
  }
  if (message.includes("too many attempts"))
    return new AuthError("TOO_MANY_ATTEMPTS");
  if (message.includes("expired")) return new AuthError("CODE_EXPIRED");
  if (message.includes("otp")) return new AuthError("INVALID_CODE");
  return new AuthError("UNKNOWN");
}

/** Codes the backend's POST /api/auth/password-reset can return. */
const RESET_ERROR_CODES: readonly AuthErrorCode[] = [
  "INVALID_CODE",
  "CODE_EXPIRED",
  "TOO_MANY_ATTEMPTS",
  "RATE_LIMITED",
];

/**
 * The final reset step goes through the FaithLink backend, which completes it
 * with Neon Auth and then emails a "your password was changed" notice (Neon has
 * no event for a finished reset).
 */
async function resetPasswordViaBackend(input: {
  email: string;
  otp: string;
  password: string;
}): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base)
    throw new Error(
      "VITE_API_BASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  let response: Response;
  try {
    response = await fetch(`${base}/api/auth/password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new AuthError("UNKNOWN");
  }
  if (response.ok) return;
  const body = (await response.json().catch(() => null)) as {
    error?: { code?: string };
  } | null;
  const code = RESET_ERROR_CODES.find((c) => c === body?.error?.code);
  throw new AuthError(code ?? "UNKNOWN");
}

/** Runs one SDK call and rethrows any failure as an `AuthError`. */
async function call(
  run: (client: NeonClient) => Promise<unknown>,
): Promise<void> {
  try {
    await run(getNeon());
  } catch (error) {
    throw toAuthError(error);
  }
}

export const authClient: AuthClient = {
  signInWithEmail: ({ email, password, rememberMe = true }) =>
    call((c) => c.signIn.email({ email, password, rememberMe })),
  signUpWithEmail: ({ name, email, password }) =>
    call((c) => c.signUp.email({ name, email, password })),
  verifyEmail: ({ email, otp }) =>
    call((c) => c.emailOtp.verifyEmail({ email, otp })),
  resendVerificationCode: ({ email }) =>
    call((c) =>
      c.emailOtp.sendVerificationOtp({ email, type: "email-verification" }),
    ),
  signInWithGoogle: () =>
    call((c) =>
      c.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${AFTER_SIGN_IN_PATH}`,
      }),
    ),
  requestPasswordReset: ({ email }) =>
    call((c) =>
      c.emailOtp.sendVerificationOtp({ email, type: "forget-password" }),
    ),
  checkResetCode: ({ email, otp }) =>
    call((c) =>
      c.emailOtp.checkVerificationOtp({ email, otp, type: "forget-password" }),
    ),
  resetPassword: resetPasswordViaBackend,
};
