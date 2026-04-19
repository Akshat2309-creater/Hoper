import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";

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

export function isBreathingPatternId(value: string | null): value is BreathingPatternId {
  return (
    value != null &&
    Object.prototype.hasOwnProperty.call(BREATHING_PATTERN_CONFIG, value)
  );
}

type Phase = "inhale" | "hold" | "exhale";

type GuidedBreathingProps = {
  pattern: BreathingPatternId;
  cycles?: number;
  labels: {
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
  };
  tone?: "sky" | "indigo";
  /** Rhythm label shown under title, e.g. "4 · 4 · 6" */
  rhythmLabel?: string;
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

export function GuidedBreathing({
  pattern,
  cycles: cyclesProp,
  labels,
  tone = "sky",
  rhythmLabel,
  onComplete,
  onExit,
}: GuidedBreathingProps) {
  const reducedMotion = usePrefersReducedMotion();
  const cycles =
    cyclesProp ?? BREATHING_PATTERN_CONFIG[pattern].defaultCycles;
  const ms = BREATHING_PATTERN_CONFIG[pattern].timings;
  const phaseOrder: Phase[] = ["inhale", "hold", "exhale"];
  const [phase, setPhase] = useState<Phase>("inhale");
  const [displayCycle, setDisplayCycle] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.ceil(ms.inhale / 1000)
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartRef = useRef<number>(Date.now());
  const phaseRef = useRef<Phase>("inhale");
  const cyclesDoneRef = useRef(0);

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

  const advancePhase = useCallback(() => {
    const idx = phaseOrder.indexOf(phaseRef.current);
    const next = phaseOrder[idx + 1];
    if (next) {
      phaseRef.current = next;
      setPhase(next);
      phaseStartRef.current = Date.now();
      setSecondsLeft(Math.ceil(ms[next] / 1000));
      return;
    }
    cyclesDoneRef.current += 1;
    if (cyclesDoneRef.current >= cycles) {
      onComplete();
      return;
    }
    setDisplayCycle((d) => d + 1);
    phaseRef.current = "inhale";
    setPhase("inhale");
    phaseStartRef.current = Date.now();
    setSecondsLeft(Math.ceil(ms.inhale / 1000));
  }, [cycles, ms, onComplete, phaseOrder]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    clearTimer();
    const duration = ms[phase];
    phaseStartRef.current = Date.now();
    setSecondsLeft(Math.ceil(duration / 1000));

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - phaseStartRef.current;
      const remain = Math.max(0, duration - elapsed);
      setSecondsLeft(Math.ceil(remain / 1000));
      if (remain <= 0) {
        clearTimer();
        advancePhase();
      }
    }, 200);

    return clearTimer;
  }, [phase, displayCycle, ms, advancePhase, clearTimer]);

  const easeInhale = "cubic-bezier(0.33, 1, 0.32, 1)";
  const easeExhale = "cubic-bezier(0.45, 0, 0.55, 1)";

  const orbMotionStyle: CSSProperties =
    phase === "hold"
      ? { transform: "scale(1.28)" }
      : phase === "inhale"
        ? {
            animation: `breathe-orb-grow ${ms.inhale}ms ${easeInhale} both`,
          }
        : {
            animation: `breathe-orb-shrink ${ms.exhale}ms ${easeExhale} both`,
          };

  const toneOrb =
    tone === "indigo"
      ? "from-indigo-200/90 via-white to-violet-100 shadow-[0_0_60px_-8px_rgba(79,70,229,0.35)]"
      : "from-cyan-200/90 via-white to-sky-100 shadow-[0_0_60px_-8px_rgba(14,165,233,0.3)]";

  if (reducedMotion) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-2 text-center">
        {rhythmLabel && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {rhythmLabel}
          </p>
        )}
        <p className="text-sm text-muted-foreground">{labels.reducedHint}</p>
        <div className="rounded-2xl border border-border bg-card px-8 py-10">
          <p className="text-3xl font-semibold tabular-nums text-foreground">
            {secondsLeft}
          </p>
          <p className="mt-3 text-lg font-medium text-foreground">{phaseLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {labels.cycle(displayCycle, cycles)}
          </p>
        </div>
        {onExit && (
          <Button type="button" variant="outline" onClick={onExit}>
            {labels.skip}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-2 sm:gap-8">
      {rhythmLabel && (
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {rhythmLabel}
        </p>
      )}
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {labels.cycle(displayCycle, cycles)}
      </p>

      <div className="relative flex h-[18rem] w-[18rem] max-w-[92vw] items-center justify-center sm:h-[19rem] sm:w-[19rem]">
        {/* Fixed ring — slightly larger than orb at max inhale so “full” reads clearly */}
        <div
          className="absolute h-[14.75rem] w-[14.75rem] rounded-full border-[3px] border-dashed border-deep-purple/30 bg-transparent sm:h-[15.5rem] sm:w-[15.5rem]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute h-44 w-44 rounded-full bg-gradient-to-br from-primary/25 to-secondary/20 blur-2xl motion-reduce:hidden sm:h-52 sm:w-52"
          aria-hidden
        />
        <div
          key={`orb-${displayCycle}-${phase}`}
          className={`relative z-[1] flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br ${toneOrb} ring-2 ring-deep-purple/20 sm:h-52 sm:w-52`}
          style={{
            ...orbMotionStyle,
            willChange: "transform",
          }}
        >
          <div className="px-4 text-center">
            <p className="text-2xl font-semibold tabular-nums text-charcoal-gray sm:text-3xl">
              {secondsLeft}
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug text-charcoal-gray sm:text-base">
              {phaseLabel}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-charcoal-gray/55 sm:text-xs">
              {phase === "inhale"
                ? (labels.inhaleHint ?? "Grow with the circle")
                : phase === "hold"
                  ? (labels.holdHint ?? "Hold steady")
                  : (labels.exhaleHint ?? "Shrink with the circle")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {onExit && (
          <Button type="button" variant="outline" size="sm" onClick={onExit}>
            {labels.skip}
          </Button>
        )}
      </div>
    </div>
  );
}
