import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const DIARY_KEY = "hoper_sleep_diary_v1";

type Props = {
  t: (k: string) => string;
  onContinue: () => void;
};

export function SleepDiaryEntry({ t, onContinue }: Props) {
  const [line, setLine] = useState("");
  const [mood, setMood] = useState<number | null>(null);

  const save = () => {
    if (!line.trim() && mood == null) {
      onContinue();
      return;
    }
    try {
      const prev = JSON.parse(localStorage.getItem(DIARY_KEY) || "[]") as unknown[];
      const row = {
        at: new Date().toISOString(),
        text: line.trim(),
        mood,
      };
      const next = [row, ...prev].slice(0, 40);
      localStorage.setItem(DIARY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    onContinue();
  };

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <p className="text-center text-sm text-muted-foreground">{t("sleep.diary.intro")}</p>
      <div className="space-y-2">
        <Label>{t("sleep.diary.mood")}</Label>
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMood(n)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                mood === n
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="diary-line">{t("sleep.diary.line")}</Label>
        <Textarea
          id="diary-line"
          rows={3}
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder={t("sleep.diary.placeholder")}
          className="resize-none border-border bg-background"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" variant="outline" onClick={onContinue}>
          {t("sleep.diary.skip")}
        </Button>
        <Button type="button" onClick={save}>
          {t("sleep.diary.save")}
        </Button>
      </div>
    </div>
  );
}
