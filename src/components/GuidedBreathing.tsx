import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/** Timings in ms per phase. */
export type BreathingTimings = Record<"inhale" | "hold" | "exhale", number>;

export type BreathingPatternId = "calm-446" | "relax-478" | "quick-426" | "deep-555";

export const BREATHING_PATTERN_CONFIG: Record<
  BreathingPatternId,
  { timings: BreathingTimings; defaultCycles: number }
> = {
  "calm-446": {
    timings: { inhale: 4000, hold: 4000, exhale: 6000 },
    defaultCycles: 4,
  },
  "relax-478": {
    timings: { inhale: 4000, hold: 7000, exhale: 8000 },
    defaultCycles: 3,
  },
  "quick-426": {
    timings: { inhale: 4000, hold: 2000, exhale: 6000 },
    defaultCycles: 5,
  },
  "deep-555": {
    timings: { inhale: 5000, hold: 5000, exhale: 5000 },
    defaultCycles: 3,
  },
};

const BREATH_STATS_KEY = "hoper_breathing_stats_v1";

type PersistedBreathStats = {
  lifetimeCycles: number;
  calmIndexLifetime: number;
  dayKey: string;
  dayBreaths: number;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadBreathStats(): PersistedBreathStats {
  try {
    const raw = localStorage.getItem(BREATH_STATS_KEY);
    if (!raw) {
      return {
        lifetimeCycles: 0,
        calmIndexLifetime: 0,
        dayKey: todayKey(),
        dayBreaths: 0,
      };
    }
    const p = JSON.parse(raw) as Partial<PersistedBreathStats>;
    const d = todayKey();
    return {
      lifetimeCycles: Number(p.lifetimeCycles) || 0,
      calmIndexLifetime: Number(p.calmIndexLifetime) || 0,
      dayKey: typeof p.dayKey === "string" ? p.dayKey : d,
      dayBreaths: Number(p.dayBreaths) || 0,
    };
  } catch {
    return {
      lifetimeCycles: 0,
      calmIndexLifetime: 0,
      dayKey: todayKey(),
      dayBreaths: 0,
    };
  }
}

function persistBreathSession(fullCycles: number, sessionCalm: number) {
  try {
    const cur = loadBreathStats();
    const d = todayKey();
    const sameDay = cur.dayKey === d;
    const next: PersistedBreathStats = {
      lifetimeCycles: cur.lifetimeCycles + fullCycles,
      calmIndexLifetime: cur.calmIndexLifetime + sessionCalm,
      dayKey: d,
      dayBreaths: (sameDay ? cur.dayBreaths : 0) + fullCycles,
    };
    localStorage.setItem(BREATH_STATS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function isBreathingPatternId(value: string | null): value is BreathingPatternId {
  return (
    value != null &&
    Object.prototype.hasOwnProperty.call(BREATHING_PATTERN_CONFIG, value)
  );
}

type Phase = "inhale" | "hold" | "exhale";

const PHASE_ORDER: Phase[] = ["inhale", "hold", "exhale"];

export type GuidedBreathingLabels = {
  inhale: string;
  hold: string;
  exhale: string;
  cycle: (n: number, total: number) => string;
  done: string;
  skip: string;
  reducedHint: string;
  inhaleHint?: string;
  holdHint?: string;
  exhaleHint?: string;
  /** Big cue (e.g. BREATHE IN!) */
  shoutInhale?: string;
  shoutHold?: string;
  shoutExhale?: string;
  /** Short advantage line per phase */
  statInhale?: string;
  statHold?: string;
  statExhale?: string;
  statsCalmLabel?: string;
  statsBreathsLabel?: string;
  statsTodayLabel?: string;
  statsLifetimeLabel?: string;
  statsDisclaimer?: string;
  mascotAlt?: string;
};

type GuidedBreathingProps = {
  pattern: BreathingPatternId;
  cycles?: number;
  labels: GuidedBreathingLabels;
  tone?: "sky" | "indigo";
  /** Rhythm label shown under title, e.g. "4 · 4 · 6" */
  rhythmLabel?: string;
  /** HOPEr mascot / character image (defaults to app mark). */
  mascotSrc?: string;
  onComplete: () => void;
  onExit?: () => void;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function phaseWeight(p: Phase): number {
  if (p === "hold") return 2.25;
  if (p === "inhale") return 1.65;
  return 1.45;
}

export function GuidedBreathing({
  pattern,
  cycles: cyclesProp,
  labels,
  tone = "sky",
  rhythmLabel,
  mascotSrc = "/favicon-icon.svg",
  onComplete,
  onExit,
}: GuidedBreathingProps) {
  const reducedMotion = usePrefersReducedMotion();
  const cycles =
    cyclesProp ?? BREATHING_PATTERN_CONFIG[pattern].defaultCycles;
  const ms = BREATHING_PATTERN_CONFIG[pattern].timings;
  const [phase, setPhase] = useState<Phase>("inhale");
  const [displayCycle, setDisplayCycle] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.ceil(ms.inhale / 1000)
  );
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionCalm, setSessionCalm] = useState(0);
  const [flashDelta, setFlashDelta] = useState<number | null>(null);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [todayBaseline, setTodayBaseline] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartRef = useRef<number>(Date.now());
  const phaseRef = useRef<Phase>("inhale");
  const cyclesDoneRef = useRef(0);
  const calmTotalRef = useRef(0);

  const shout =
    phase === "inhale"
      ? (labels.shoutInhale ?? "BREATHE IN!")
      : phase === "hold"
        ? (labels.shoutHold ?? "HOLD")
        : (labels.shoutExhale ?? "BREATHE OUT!");

  const phaseStatLine =
    phase === "inhale"
      ? (labels.statInhale ?? "Inhale · oxygen sync")
      : phase === "hold"
        ? (labels.statHold ?? "Hold · steadiness")
        : (labels.statExhale ?? "Exhale · relax signal");

  const phaseLabel =
    phase === "inhale"
      ? labels.inhale
      : phase === "hold"
        ? labels.hold
        : labels.exhale;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const bumpPhaseStat = useCallback(
    (completed: Phase) => {
      const sec = ms[completed] / 1000;
      const delta = Math.max(1, Math.round(sec * phaseWeight(completed)));
      calmTotalRef.current += delta;
      setSessionCalm(calmTotalRef.current);
      setFlashDelta(delta);
      window.setTimeout(() => setFlashDelta(null), 1000);
    },
    [ms]
  );

  const advancePhase = useCallback(() => {
    const current = phaseRef.current;
    bumpPhaseStat(current);

    const idx = PHASE_ORDER.indexOf(current);
    const next = PHASE_ORDER[idx + 1];
    if (next) {
      phaseRef.current = next;
      setPhase(next);
      phaseStartRef.current = Date.now();
      setSecondsLeft(Math.ceil(ms[next] / 1000));
      return;
    }
    cyclesDoneRef.current += 1;
    setCompletedCycles(cyclesDoneRef.current);
    if (cyclesDoneRef.current >= cycles) {
      persistBreathSession(cyclesDoneRef.current, calmTotalRef.current);
      onComplete();
      return;
    }
    setDisplayCycle((d) => d + 1);
    phaseRef.current = "inhale";
    setPhase("inhale");
    phaseStartRef.current = Date.now();
    setSecondsLeft(Math.ceil(ms.inhale / 1000));
  }, [bumpPhaseStat, cycles, ms, onComplete]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const s = loadBreathStats();
    const d = todayKey();
    setTodayBaseline(s.dayKey === d ? s.dayBreaths : 0);
  }, []);

  useEffect(() => {
    clearTimer();
    const duration = ms[phase];
    phaseStartRef.current = Date.now();
    setSecondsLeft(Math.ceil(duration / 1000));
    setPhaseProgress(0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - phaseStartRef.current;
      const remain = Math.max(0, duration - elapsed);
      setSecondsLeft(Math.ceil(remain / 1000));
      setPhaseProgress(Math.min(1, elapsed / duration));
      if (remain <= 0) {
        clearTimer();
        advancePhase();
      }
    }, 120);

    return clearTimer;
  }, [phase, displayCycle, ms, advancePhase, clearTimer]);

  const easeInhale = "cubic-bezier(0.33, 1, 0.32, 1)";
  const easeExhale = "cubic-bezier(0.45, 0, 0.55, 1)";

  /** Subtle zoom: inhale grows a little, hold keeps peak, exhale releases. */
  const mascotMotionStyle: CSSProperties = reducedMotion
    ? { transform: "scale(1)" }
    : phase === "hold"
      ? {
          transform: "scale(1.06)",
          transition: "transform 400ms ease-out",
        }
      : phase === "inhale"
        ? {
            animation: `breathe-mascot-in ${ms.inhale}ms ${easeInhale} both`,
          }
        : {
            animation: `breathe-mascot-out ${ms.exhale}ms ${easeExhale} both`,
          };

  const toneGlow =
    tone === "indigo"
      ? "from-indigo-400/25 via-violet-400/15 to-transparent"
      : "from-cyan-400/25 via-sky-400/15 to-transparent";

  const persisted = loadBreathStats();
  const todayTotal = todayBaseline + completedCycles;
  const calmLifetimeDisplay = persisted.calmIndexLifetime + sessionCalm;

  const statsRow = (
    <div className="grid w-full grid-cols-3 gap-3 rounded-2xl border border-border bg-card/90 px-4 py-4 text-card-foreground shadow-sm backdrop-blur-sm dark:bg-card/80 sm:gap-4 sm:px-6 sm:py-5">
      <div className="flex flex-col items-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
          {labels.statsCalmLabel ?? "Calm index"}
        </p>
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-xl font-bold tabular-nums sm:text-2xl lg:text-3xl">{sessionCalm}</span>
          {flashDelta != null && (
            <span className="text-xs font-bold text-primary sm:text-sm">+{flashDelta}</span>
          )}
        </div>
      </div>
      <div className="text-center border-x border-border/80 px-1 sm:px-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
          {labels.statsBreathsLabel ?? "Full breaths"}
        </p>
        <p className="text-xl font-bold tabular-nums sm:text-2xl lg:text-3xl">
          {completedCycles}
          <span className="text-sm font-semibold text-muted-foreground lg:text-base">
            /{cycles}
          </span>
        </p>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
          {labels.statsTodayLabel ?? "Today"}
        </p>
        <p className="text-xl font-bold tabular-nums sm:text-2xl lg:text-3xl">{todayTotal}</p>
      </div>
    </div>
  );

  const footerMeta = (
    <>
      <p className="text-center text-[11px] leading-snug text-muted-foreground lg:text-left lg:text-xs">
        {labels.statsDisclaimer ??
          "Fun engagement scores to celebrate your effort — not medical measurements."}
      </p>
      {(persisted.lifetimeCycles > 0 ||
        completedCycles > 0 ||
        persisted.calmIndexLifetime > 0 ||
        sessionCalm > 0) && (
        <p className="text-center text-[11px] text-muted-foreground lg:text-left lg:text-xs">
          {(labels.statsLifetimeLabel ?? "All-time cycles: {0}").replace(
            "{0}",
            String(persisted.lifetimeCycles + completedCycles)
          )}
          {" · "}
          {(labels.statsCalmLabel ?? "Calm index")} (all-time):{" "}
          <span className="font-semibold tabular-nums text-foreground">
            {calmLifetimeDisplay}
          </span>
        </p>
      )}
    </>
  );

  if (reducedMotion) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 sm:gap-6 sm:px-2">
        {statsRow}
        <p className="text-center text-sm text-muted-foreground lg:text-left">
          {labels.reducedHint}
        </p>
        <div className="grid w-full items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-2xl border border-border bg-card px-6 py-8 text-center lg:py-10">
            <img
              src={mascotSrc}
              alt={labels.mascotAlt ?? "HOPEr"}
              className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32 lg:h-40 lg:w-40"
            />
          </div>
          <div className="flex flex-col justify-center space-y-3 text-center lg:text-left">
            {rhythmLabel && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {rhythmLabel}
              </p>
            )}
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {labels.cycle(displayCycle, cycles)}
            </p>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              {shout}
            </p>
            <p className="text-4xl font-semibold tabular-nums text-foreground sm:text-5xl">
              {secondsLeft}
            </p>
            <p className="text-base font-medium text-foreground">{phaseLabel}</p>
            <p className="text-sm text-muted-foreground">{phaseStatLine}</p>
            <Progress className="h-2 w-full max-w-md lg:max-w-none" value={phaseProgress * 100} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 lg:max-w-3xl">{footerMeta}</div>
        {onExit && (
          <div className="flex justify-center lg:justify-start">
            <Button type="button" variant="outline" onClick={onExit}>
              {labels.skip}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 sm:gap-6 sm:px-2">
      {statsRow}

      <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Mascot — left on wide screens */}
        <div className="relative flex w-full flex-col items-center justify-center lg:min-h-[22rem]">
          <div
            className={`pointer-events-none absolute inset-x-4 top-6 h-40 rounded-full bg-gradient-to-r ${toneGlow} blur-2xl sm:inset-x-10 lg:top-10 lg:h-48`}
            aria-hidden
          />
          <div
            key={`mascot-${displayCycle}-${phase}`}
            className="relative z-[1] flex flex-col items-center"
            style={{
              ...mascotMotionStyle,
              willChange: "transform",
            }}
          >
            <div className="rounded-full border-2 border-deep-purple/25 bg-gradient-to-b from-card to-muted/40 p-1 shadow-lg ring-4 ring-primary/15 dark:border-deep-purple/40 dark:from-secondary/30 dark:to-background/80 dark:ring-primary/25">
              <div className="rounded-full bg-background/80 p-4 dark:bg-background/60 sm:p-6 lg:p-8">
                <img
                  src={mascotSrc}
                  alt={labels.mascotAlt ?? "HOPEr"}
                  className="h-32 w-32 object-contain sm:h-36 sm:w-36 lg:h-44 lg:w-44 xl:h-48 xl:w-48"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cues + timer — right on wide screens */}
        <div className="relative z-[2] flex w-full flex-col space-y-3 text-center lg:space-y-4 lg:text-left">
          {rhythmLabel && (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
              {rhythmLabel}
            </p>
          )}
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
            {labels.cycle(displayCycle, cycles)}
          </p>
          <p className="text-xl font-black uppercase tracking-[0.12em] text-secondary dark:text-primary sm:text-2xl lg:text-3xl">
            {shout}
          </p>
          <p className="text-5xl font-bold tabular-nums text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
            {secondsLeft}
          </p>
          <p className="text-base font-semibold text-foreground sm:text-lg">
            {phaseLabel}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-primary sm:text-sm">
            {phaseStatLine}
          </p>
          <Progress className="mx-auto h-2.5 w-full max-w-xs lg:mx-0 lg:max-w-md xl:max-w-lg" value={phaseProgress * 100} />
          <p className="text-xs text-muted-foreground sm:text-sm">
            {phase === "inhale"
              ? (labels.inhaleHint ?? "Match the gentle zoom in")
              : phase === "hold"
                ? (labels.holdHint ?? "Stay soft and steady")
                : (labels.exhaleHint ?? "Let the zoom release with your out-breath")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 lg:max-w-3xl">{footerMeta}</div>

      <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
        {onExit && (
          <Button type="button" variant="outline" size="sm" onClick={onExit}>
            {labels.skip}
          </Button>
        )}
      </div>
    </div>
  );
}
