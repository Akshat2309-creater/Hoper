import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ZONES = ["z1", "z2", "z3", "z4", "z5", "z6"] as const;

type Props = {
  t: (k: string) => string;
  onDone: () => void;
};

export function SleepBodyScan({ t, onDone }: Props) {
  const [idx, setIdx] = useState(0);
  const zone = ZONES[idx];
  const progress = ((idx + 1) / ZONES.length) * 100;

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <Progress value={progress} className="h-2" />
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t("sleep.body.step").replace("{0}", String(idx + 1)).replace("{1}", String(ZONES.length))}
      </p>
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-card-foreground shadow-inner dark:bg-card/90">
        <p className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">
          {t(`sleep.body.${zone}`)}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{t("sleep.body.hint")}</p>
      <div className="flex justify-center gap-3">
        {idx > 0 && (
          <Button type="button" variant="outline" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
            {t("sleep.body.back")}
          </Button>
        )}
        {idx < ZONES.length - 1 ? (
          <Button type="button" onClick={() => setIdx((i) => i + 1)}>
            {t("sleep.body.next")}
          </Button>
        ) : (
          <Button type="button" onClick={onDone}>
            {t("sleep.body.finish")}
          </Button>
        )}
      </div>
    </div>
  );
}
