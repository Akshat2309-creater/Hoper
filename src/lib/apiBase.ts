/** Base URL for HOPEr FastAPI (chat, transcribe). No trailing slash. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (raw && typeof raw === "string" && raw.trim()) {
    return raw.trim().replace(/\/+$/, "");
  }
  return "http://localhost:8000";
}

/** HTTPS pages cannot call http://localhost — browser blocks it (mixed content). */
export function isApiBaseLikelyBlockedInBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const base = getApiBaseUrl();
  return window.location.protocol === "https:" && base.startsWith("http://");
}
