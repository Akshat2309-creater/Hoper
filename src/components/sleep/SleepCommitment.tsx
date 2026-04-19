import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  t: (k: string) => string;
  onContinue: () => void;
};

export function SleepCommitment({ t, onContinue }: Props) {
  const [line, setLine] = useState("");
  const [phoneAway, setPhoneAway] = useState(false);
  const [counting, setCounting] = useState(false);
  const [left, setLeft] = useState(20);

  useEffect(() => {
    if (!counting) return;
    if (left <= 0) return;
    const id = window.setInterval(() => setLeft((n) => n - 1), 1000);
    return () => clearInterval(id);
  }, [counting, left]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="sleep-line" className="text-foreground">
          {t("sleep.commit.lineLabel")}
        </Label>
        <Textarea
          id="sleep-line"
          rows={3}
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder={t("sleep.commit.placeholder")}
          className="resize-none border-border bg-background text-foreground"
        />
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 dark:bg-muted/15">
        <Checkbox
          id="phone"
          checked={phoneAway}
          onCheckedChange={(c) => setPhoneAway(c === true)}
          className="mt-1"
        />
        <Label htmlFor="phone" className="cursor-pointer text-left text-sm leading-relaxed text-foreground">
          {t("sleep.commit.phone")}
        </Label>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 text-center dark:bg-card/90">
        {!counting ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{t("sleep.commit.countIntro")}</p>
            <Button type="button" variant="secondary" onClick={() => { setCounting(true); setLeft(20); }}>
              {t("sleep.commit.startCount")}
            </Button>
          </>
        ) : left > 0 ? (
          <p className="font-lustria text-6xl font-bold tabular-nums text-primary">{left}</p>
        ) : (
          <p className="text-lg font-medium text-foreground">{t("sleep.commit.countDone")}</p>
        )}
      </div>
      <Button type="button" className="w-full" onClick={onContinue}>
        {t("sleep.commit.continue")}
      </Button>
    </div>
  );
}
