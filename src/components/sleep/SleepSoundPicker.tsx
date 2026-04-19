import type { SleepAmbientId } from "@/hooks/useSleepAmbient";
import {
  CloudRain,
  Droplets,
  Flame,
  Moon,
  Trees,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  Radio,
  Activity,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const TRACKS: { id: Exclude<SleepAmbientId, "off">; icon: typeof Moon; labelKey: string }[] = [
  { id: "forest", icon: Trees, labelKey: "sleep.sound.forest" },
  { id: "rain", icon: CloudRain, labelKey: "sleep.sound.rain" },
  { id: "ocean", icon: Waves, labelKey: "sleep.sound.ocean" },
  { id: "stream", icon: Droplets, labelKey: "sleep.sound.stream" },
  { id: "wind", icon: Wind, labelKey: "sleep.sound.wind" },
  { id: "fire", icon: Flame, labelKey: "sleep.sound.fire" },
  { id: "night", icon: Moon, labelKey: "sleep.sound.night" },
  { id: "white", icon: Radio, labelKey: "sleep.sound.white" },
  { id: "pink", icon: Activity, labelKey: "sleep.sound.pink" },
  { id: "brown", icon: CircleDot, labelKey: "sleep.sound.brown" },
];

type Props = {
  t: (k: string) => string;
  activeId: SleepAmbientId;
  volume: number;
  setVolume: (v: number) => void;
  play: (id: SleepAmbientId) => void;
  stop: () => void;
};

export function SleepSoundPicker({ t, activeId, volume, setVolume, play, stop }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted-foreground">{t("sleep.sound.intro")}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {TRACKS.map(({ id, icon: Icon, labelKey }) => {
          const on = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => (on ? stop() : play(id))}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all",
                on
                  ? "border-primary bg-primary/10 text-foreground shadow-md"
                  : "border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <Icon className="h-7 w-7 shrink-0 text-primary" />
              <span className="text-xs font-semibold leading-tight">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
      <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-border bg-muted/30 p-4 dark:bg-muted/15">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">{t("sleep.sound.volume")}</span>
          <Slider
            value={[volume * 100]}
            onValueChange={([v]) => setVolume(Math.min(1, Math.max(0.02, v / 100)))}
            max={100}
            step={1}
            className="w-[55%]"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={stop}>
            <VolumeX className="mr-1 h-4 w-4" />
            {t("sleep.sound.stop")}
          </Button>
          {activeId !== "off" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Volume2 className="h-3.5 w-3.5" />
              {t("sleep.sound.playing")}
            </span>
          )}
        </div>
        <p className="text-center text-[11px] leading-snug text-muted-foreground">{t("sleep.sound.disclaimer")}</p>
      </div>
    </div>
  );
}
