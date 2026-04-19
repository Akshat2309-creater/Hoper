export type AuthProvider = "email" | "google";

export type StoredUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  passwordHash: string | null;
  authProvider: AuthProvider;
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  authProvider: AuthProvider;
  issuedAt: string;
};

export type ActivityEntry = {
  id: string;
  at: string;
  type: "chat" | "assessment" | "sleep" | "mindfulness" | "mood" | "login" | "other";
  summary: string;
};

const USERS_KEY = "hoper_auth_users_v1";
const SESSION_KEY = "hoper_auth_session_v1";
const OTP_KEY = "hoper_auth_otp_pending_v1";
const USER_CTX_PREFIX = "hoper_user_ctx_";
const ACTIVITY_PREFIX = "hoper_activity_";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getUsers(): StoredUser[] {
  return safeParse<StoredUser[]>(localStorage.getItem(USERS_KEY), []);
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const e = email.trim().toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === e);
}

export function findUserById(id: string): StoredUser | undefined {
  return getUsers().find((u) => u.id === id);
}

export function upsertUser(user: StoredUser) {
  const users = getUsers().filter((u) => u.id !== user.id && u.email.toLowerCase() !== user.email.toLowerCase());
  users.push(user);
  saveUsers(users);
}

export function getSession(): Session | null {
  return safeParse<Session | null>(localStorage.getItem(SESSION_KEY), null);
}

export function setSession(s: Session | null) {
  if (!s) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export type OtpPending = { email: string; code: string; exp: number };

export function setOtpPending(data: OtpPending) {
  localStorage.setItem(OTP_KEY, JSON.stringify(data));
}

export function getOtpPending(): OtpPending | null {
  const v = safeParse<OtpPending | null>(localStorage.getItem(OTP_KEY), null);
  if (!v) return null;
  if (Date.now() > v.exp) {
    localStorage.removeItem(OTP_KEY);
    return null;
  }
  return v;
}

export function clearOtpPending() {
  localStorage.removeItem(OTP_KEY);
}

export function getUserContext(userId: string): Record<string, unknown> {
  return safeParse<Record<string, unknown>>(localStorage.getItem(USER_CTX_PREFIX + userId), {});
}

export function mergeUserContext(userId: string, patch: Record<string, unknown>) {
  const cur = getUserContext(userId);
  localStorage.setItem(USER_CTX_PREFIX + userId, JSON.stringify({ ...cur, ...patch, updatedAt: new Date().toISOString() }));
}

export function getActivities(userId: string): ActivityEntry[] {
  return safeParse<ActivityEntry[]>(localStorage.getItem(ACTIVITY_PREFIX + userId), []);
}

export function logActivity(userId: string, type: ActivityEntry["type"], summary: string) {
  const list = getActivities(userId);
  list.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    type,
    summary: summary.slice(0, 280),
  });
  localStorage.setItem(ACTIVITY_PREFIX + userId, JSON.stringify(list.slice(0, 200)));
}

export function userInitials(displayName: string, username: string): string {
  const s = (displayName || username || "?").trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return s.slice(0, 2).toUpperCase() || "HO";
}
