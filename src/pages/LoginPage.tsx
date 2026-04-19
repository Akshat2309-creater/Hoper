import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const {
    session,
    sendEmailOtp,
    verifyOtpCode,
    loginWithPassword,
    loginWithGoogleCredential,
  } = useAuth();

  const from = (location.state as { from?: string } | null)?.from || "/";

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "account" | "password">("email");
  const [otp, setOtp] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [showPilotCode, setShowPilotCode] = useState(false);
  const [password, setPassword] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) navigate(from, { replace: true });
  }, [session, from, navigate]);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || !googleBtnRef.current) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (res) => {
          const r = await loginWithGoogleCredential(res.credential);
          if (!r.ok) {
            toast.error(t(`auth.err.${r.error}`) || r.error);
            return;
          }
          toast.success(t("auth.welcome"));
          navigate(from, { replace: true });
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
        shape: "rectangular",
      });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [clientId, from, loginWithGoogleCredential, navigate, t]);

  const onSendOtp = () => {
    const e = email.trim().toLowerCase();
    if (!e.includes("@")) {
      toast.error(t("auth.err.email"));
      return;
    }
    const { code, ok } = sendEmailOtp(e);
    if (!ok) {
      toast.error(t("auth.err.unauthorized_email"));
      return;
    }
    setDemoCode(code);
    setShowPilotCode(false);
    setStep("otp");
    toast.message(t("auth.otpSent"));
  };

  const onVerifyOtp = () => {
    const e = email.trim().toLowerCase();
    if (!verifyOtpCode(e, otp)) {
      toast.error(t("auth.err.otp"));
      return;
    }
    setStep("account");
  };

  const onLoginPassword = async () => {
    const r = await loginWithPassword(email.trim().toLowerCase(), password);
    if (!r.ok) {
      toast.error(t(`auth.err.${r.error}`) || "Login failed");
      return;
    }
    toast.success(t("auth.welcome"));
    navigate(from, { replace: true });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(148deg,hsl(var(--lavender))_0%,hsl(var(--background))_36%,hsl(var(--mint))_68%,hsl(var(--sky))_100%)] px-4 py-10 dark:from-card dark:via-background dark:to-card">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex max-w-md flex-col items-center pt-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full border-2 border-deep-purple/30 bg-card p-4 shadow-lg ring-4 ring-primary/15 dark:border-border dark:ring-primary/25">
            <img src="/favicon-icon.svg" alt="" className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
          <h1 className="font-lustria text-2xl font-bold text-foreground sm:text-3xl">{t("auth.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
        </div>

        <div className="w-full rounded-2xl border border-border bg-card/95 p-6 shadow-xl backdrop-blur-sm dark:bg-card/90">
          {clientId && (
            <div className="mb-6 flex flex-col items-center gap-2">
              <div ref={googleBtnRef} className="flex min-h-[40px] w-full justify-center" />
              <p className="text-center text-[11px] text-muted-foreground">{t("auth.googleHint")}</p>
            </div>
          )}

          {clientId && (step === "email" || step === "password") && (
            <div className="relative mb-6 text-center text-xs text-muted-foreground">
              <span className="bg-card px-2">{t("auth.orEmail")}</span>
              <div className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-border" />
            </div>
          )}

          {step === "password" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("auth.passwordOnlyTitle")}</p>
              <div className="space-y-2">
                <Label htmlFor="auth-email-pw">{t("auth.email")}</Label>
                <Input
                  id="auth-email-pw"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-only">{t("auth.password")}</Label>
                <Input
                  id="pw-only"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button type="button" className="w-full" onClick={() => void onLoginPassword()}>
                {t("auth.signIn")}
              </Button>
              <Button
                type="button"
                variant="link"
                className="h-auto w-full py-1 text-xs text-muted-foreground"
                onClick={() => {
                  setStep("email");
                  setPassword("");
                }}
              >
                {t("auth.useCodeInstead")}
              </Button>
            </div>
          )}

          {step === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email">{t("auth.email")}</Label>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="button" className="w-full" onClick={onSendOtp}>
                {t("auth.sendOtp")}
              </Button>
              <Button
                type="button"
                variant="link"
                className="h-auto w-full py-1 text-xs text-muted-foreground"
                onClick={() => {
                  setStep("password");
                  setOtp("");
                  setPassword("");
                }}
              >
                {t("auth.signInWithPassword")}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                {t("auth.otpTo").replace("{0}", email.trim())}
              </p>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">{t("auth.noEmailSent")}</p>
              <div className="flex flex-col items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowPilotCode((v) => !v)}
                >
                  {showPilotCode ? t("auth.hideTestCode") : t("auth.showTestCode")}
                </Button>
                {showPilotCode && (
                  <div className="w-full rounded-lg border border-primary/30 bg-primary/5 p-3 text-center text-xs text-foreground">
                    <strong>{t("auth.demoOtp")}</strong> {demoCode}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("email")}>
                  {t("auth.back")}
                </Button>
                <Button type="button" className="flex-1" onClick={onVerifyOtp}>
                  {t("auth.verifyOtp")}
                </Button>
              </div>
            </div>
          )}

          {step === "account" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("auth.existingWelcome")}</p>
              <div className="space-y-2">
                <Label htmlFor="pw">{t("auth.password")}</Label>
                <Input
                  id="pw"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("otp")}>
                  {t("auth.back")}
                </Button>
                <Button type="button" className="flex-1" onClick={() => void onLoginPassword()}>
                  {t("auth.signIn")}
                </Button>
              </div>
            </div>
          )}

        </div>
        <p className="mt-6 max-w-sm text-center text-[11px] leading-relaxed text-muted-foreground/90">
          {t("auth.disclaimer")}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
