import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RITUAL_KEYS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"] as const;

type Props = {
  t: (k: string) => string;
  onContinue: () => void;
};

export function SleepRitualBuilder({ t, onContinue }: Props) {
  const [picked, setPicked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setPicked((p) => ({ ...p, [key]: !p[key] }));
  };

  const count = RITUAL_KEYS.filter((k) => picked[k]).length;

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted-foreground">{t("sleep.ritual.intro")}</p>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {RITUAL_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={cn(
              "flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all",
              picked[key]
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-card-foreground hover:border-primary/35"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                picked[key] ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
              )}
            >
              {picked[key] ? <Check className="h-3 w-3" /> : null}
            </span>
            {t(`sleep.ritual.${key}`)}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t("sleep.ritual.hint").replace("{0}", String(count))}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" variant="outline" onClick={onContinue}>
          {t("sleep.ritual.skip")}
        </Button>
        <Button type="button" onClick={onContinue}>
          {t("sleep.ritual.continue")}
        </Button>
      </div>
    </div>
  );
}
