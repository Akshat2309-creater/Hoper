import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActivities, type ActivityEntry } from "@/lib/authStorage";
import { format } from "date-fns";

const typeLabel = (t: (k: string) => string, type: ActivityEntry["type"]) => {
  const key = `auth.throw.type.${type}`;
  const v = t(key);
  return v === key ? type : v;
};

const ThrowbacksPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { session } = useAuth();

  const items = useMemo(() => {
    if (!session) return [];
    return getActivities(session.userId);
  }, [session]);

  if (!session) return null;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-lavender/25 to-background px-4 py-10 dark:from-lavender/10">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          {t("auth.throw.back")}
        </Button>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-lustria text-2xl font-bold text-foreground">{t("auth.throw.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("auth.throw.subtitle")}</p>
          </div>
        </div>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground">
            {t("auth.throw.empty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((row) => (
              <li
                key={row.id}
                className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm dark:bg-card/90"
              >
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {typeLabel(t, row.type)}
                  </span>
                  <time className="text-xs text-muted-foreground" dateTime={row.at}>
                    {format(new Date(row.at), "MMM d, yyyy · HH:mm")}
                  </time>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{row.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ThrowbacksPage;
