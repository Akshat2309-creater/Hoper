/** Single operator gate — only this email may use the app (frontend-only; not secret in builds). */
export const HOPER_ALLOWED_EMAIL = "hoperthechatbot@gmail.com";

const HOPER_ALLOWED_PASSWORD = "hoper@123";

/** Stable id so localStorage session / throwbacks stay tied to one profile. */
export const HOPER_SINGLE_USER_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";

export function isAllowedAppEmail(email: string): boolean {
  return email.trim().toLowerCase() === HOPER_ALLOWED_EMAIL.toLowerCase();
}

export function isAllowedAppPassword(password: string): boolean {
  return password === HOPER_ALLOWED_PASSWORD;
}
