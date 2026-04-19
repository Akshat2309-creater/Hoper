import type { SleepAmbientId } from "@/hooks/useSleepAmbient";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type Props = {
  soundLabel: string;
  dockAriaLabel: string;
  activeId: SleepAmbientId;
  volume: number;
  setVolume: (v: number) => void;
  stop: () => void;
};

export function SleepAmbientDock({ soundLabel, dockAriaLabel, activeId, volume, setVolume, stop }: Props) {
  if (activeId === "off") return null;

  return (
    <div
      className="fixed bottom-4 left-3 right-3 z-[60] rounded-2xl border border-border bg-card/95 p-3 text-card-foreground shadow-lg backdrop-blur-md dark:bg-card/95 md:left-auto md:right-6 md:w-[22rem]"
      role="region"
      aria-label={dockAriaLabel}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Volume2 className="h-4 w-4 text-primary" />
          {soundLabel}
        </span>
        <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={stop}>
          <VolumeX className="h-4 w-4" />
        </Button>
      </div>
      <Slider
        value={[volume * 100]}
        onValueChange={([v]) => setVolume(Math.min(1, Math.max(0.02, v / 100)))}
        max={100}
        step={1}
        className="w-full"
      />
    </div>
  );
}
