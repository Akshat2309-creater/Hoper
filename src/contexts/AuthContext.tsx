import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hashPassword } from "@/lib/authCrypto";
import {
  clearOtpPending,
  findUserByEmail,
  findUserById,
  getOtpPending,
  getSession,
  logActivity,
  mergeUserContext,
  setOtpPending,
  setSession,
  upsertUser,
  type Session,
  type StoredUser,
} from "@/lib/authStorage";
import {
  HOPER_ALLOWED_EMAIL,
  HOPER_SINGLE_USER_ID,
  isAllowedAppEmail,
  isAllowedAppPassword,
} from "@/lib/authAllowlist";

type GoogleJwtPayload = {
  email?: string;
  name?: string;
  sub?: string;
};

function parseGoogleJwt(credential: string): GoogleJwtPayload {
  try {
    const payload = credential.split(".")[1];
    if (!payload) return {};
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as GoogleJwtPayload;
  } catch {
    return {};
  }
}

type AuthContextValue = {
  session: Session | null;
  user: StoredUser | null;
  isReady: boolean;
  logout: () => void;
  sendEmailOtp: (email: string) => { code: string; ok: boolean };
  verifyOtpCode: (email: string, code: string) => boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  registerWithPassword: (
    email: string,
    username: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogleCredential: (credential: string) => Promise<{ ok: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function startSessionFromUser(user: StoredUser): Session {
  const s: Session = {
    userId: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    authProvider: user.authProvider,
    issuedAt: new Date().toISOString(),
  };
  setSession(s);
  mergeUserContext(user.id, { lastLoginAt: s.issuedAt });
  logActivity(user.id, "login", `Signed in (${user.authProvider})`);
  return s;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s && !isAllowedAppEmail(s.email)) {
      setSession(null);
      setSessionState(null);
    } else {
      setSessionState(s);
    }
    setIsReady(true);
  }, []);

  const user = useMemo(() => {
    if (!session) return null;
    return findUserById(session.userId) ?? null;
  }, [session]);

  const logout = useCallback(() => {
    setSession(null);
    setSessionState(null);
    clearOtpPending();
  }, []);

  const sendEmailOtp = useCallback((email: string) => {
    const e = email.trim().toLowerCase();
    if (!isAllowedAppEmail(e)) {
      return { code: "", ok: false as const };
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setOtpPending({
      email: e,
      code,
      exp: Date.now() + 10 * 60 * 1000,
    });
    return { code, ok: true as const };
  }, []);

  const verifyOtpCode = useCallback((email: string, code: string) => {
    const e = email.trim().toLowerCase();
    if (!isAllowedAppEmail(e)) return false;
    const pending = getOtpPending();
    if (!pending) return false;
    if (pending.email !== e) return false;
    if (pending.code !== code.trim()) return false;
    return true;
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (!isAllowedAppEmail(e)) return { ok: false, error: "not_allowed" };
    if (!isAllowedAppPassword(password)) return { ok: false, error: "bad_password" };

    let u = findUserByEmail(e);
    if (!u) {
      const passwordHash = await hashPassword(password);
      u = {
        id: HOPER_SINGLE_USER_ID,
        email: HOPER_ALLOWED_EMAIL.toLowerCase(),
        username: "hoperthechatbot",
        displayName: "HOPEr",
        passwordHash,
        authProvider: "email",
        createdAt: new Date().toISOString(),
      };
      upsertUser(u);
    }
    clearOtpPending();
    const s = startSessionFromUser(u);
    setSessionState(s);
    return { ok: true };
  }, []);

  const registerWithPassword = useCallback(async (_email: string, _username: string, _password: string) => {
    return { ok: false as const, error: "registration_disabled" as const };
  }, []);

  const loginWithGoogleCredential = useCallback(async (credential: string) => {
    const p = parseGoogleJwt(credential);
    const email = (p.email || "").trim().toLowerCase();
    if (!email) return { ok: false, error: "google_email" };
    if (!isAllowedAppEmail(email)) return { ok: false, error: "not_allowed" };
    const name = (p.name || email.split("@")[0] || "Friend").trim();
    let u = findUserByEmail(email);
    if (!u) {
      u = {
        id: HOPER_SINGLE_USER_ID,
        email: HOPER_ALLOWED_EMAIL.toLowerCase(),
        username: email.split("@")[0]!.replace(/[^a-z0-9_]/gi, "_").toLowerCase() || "hoperthechatbot",
        displayName: name,
        passwordHash: null,
        authProvider: "google",
        createdAt: new Date().toISOString(),
      };
      upsertUser(u);
    }
    clearOtpPending();
    const s = startSessionFromUser(u);
    setSessionState(s);
    return { ok: true };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isReady,
      logout,
      sendEmailOtp,
      verifyOtpCode,
      loginWithPassword,
      registerWithPassword,
      loginWithGoogleCredential,
    }),
    [
      session,
      user,
      isReady,
      logout,
      sendEmailOtp,
      verifyOtpCode,
      loginWithPassword,
      registerWithPassword,
      loginWithGoogleCredential,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
