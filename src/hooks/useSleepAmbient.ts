import { useCallback, useEffect, useRef, useState } from "react";

export type SleepAmbientId =
  | "off"
  | "white"
  | "pink"
  | "brown"
  | "rain"
  | "ocean"
  | "forest"
  | "fire"
  | "wind"
  | "night"
  | "stream";

/**
 * Procedural sleep ambience in the browser (no external audio files).
 * Playback starts only after the user taps play (autoplay policy).
 */
export function useSleepAmbient() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<AudioScheduledSourceNode[]>([]);
  const timersRef = useRef<number[]>([]);
  const [activeId, setActiveId] = useState<SleepAmbientId>("off");
  const [volume, setVolume] = useState(0.32);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearInterval(id);
    timersRef.current = [];
  }, []);

  const stopSources = useCallback(() => {
    clearTimers();
    for (const s of sourcesRef.current) {
      try {
        s.stop();
        s.disconnect();
      } catch {
        /* ignore */
      }
    }
    sourcesRef.current = [];
  }, [clearTimers]);

  const ensureCtx = useCallback(() => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctxRef.current) {
      ctxRef.current = new AC();
      const g = ctxRef.current.createGain();
      g.gain.value = volume;
      g.connect(ctxRef.current.destination);
      masterRef.current = g;
    } else if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    if (masterRef.current) masterRef.current.gain.value = volume;
    return ctxRef.current;
  }, [volume]);

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume;
  }, [volume]);

  const play = useCallback(
    (id: SleepAmbientId) => {
      stopSources();
      setActiveId(id);
      if (id === "off") return;

      const ctx = ensureCtx()!;
      const out = masterRef.current!;
      const buf = (seconds: number) => {
        const len = Math.floor(ctx.sampleRate * seconds);
        const b = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        return b;
      };

      const loopNoise = (low: number, high: number, gain: number) => {
        const src = ctx.createBufferSource();
        src.buffer = buf(2);
        src.loop = true;
        const f1 = ctx.createBiquadFilter();
        f1.type = "lowpass";
        f1.frequency.value = high;
        const f2 = ctx.createBiquadFilter();
        f2.type = "highpass";
        f2.frequency.value = low;
        const g = ctx.createGain();
        g.gain.value = gain;
        src.connect(f1);
        f1.connect(f2);
        f2.connect(g);
        g.connect(out);
        src.start();
        sourcesRef.current.push(src);
      };

      switch (id) {
        case "white":
          loopNoise(200, 12000, 0.1);
          break;
        case "pink":
          loopNoise(200, 3500, 0.2);
          break;
        case "brown":
          loopNoise(40, 800, 0.32);
          break;
        case "rain":
          loopNoise(2000, 9000, 0.07);
          loopNoise(400, 2500, 0.12);
          break;
        case "ocean":
          loopNoise(80, 900, 0.28);
          loopNoise(200, 2000, 0.05);
          break;
        case "forest":
          loopNoise(300, 2200, 0.08);
          loopNoise(1800, 6000, 0.04);
          {
            const chirp = () => {
              const o = ctx.createOscillator();
              o.type = "triangle";
              const t0 = ctx.currentTime;
              o.frequency.setValueAtTime(2800, t0);
              o.frequency.exponentialRampToValueAtTime(5200, t0 + 0.1);
              const g = ctx.createGain();
              g.gain.setValueAtTime(0, t0);
              g.gain.linearRampToValueAtTime(0.035, t0 + 0.03);
              g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
              o.connect(g);
              g.connect(out);
              o.start(t0);
              o.stop(t0 + 0.25);
              sourcesRef.current.push(o);
            };
            chirp();
            timersRef.current.push(
              window.setInterval(() => {
                if (Math.random() > 0.35) chirp();
              }, 3200)
            );
          }
          break;
        case "fire":
          timersRef.current.push(
            window.setInterval(() => {
              const n = ctx.createBufferSource();
              n.buffer = buf(0.04);
              const f = ctx.createBiquadFilter();
              f.type = "bandpass";
              f.frequency.value = 900 + Math.random() * 2800;
              const g = ctx.createGain();
              g.gain.value = 0.04 + Math.random() * 0.1;
              n.connect(f);
              f.connect(g);
              g.connect(out);
              const t0 = ctx.currentTime;
              n.start(t0);
              n.stop(t0 + 0.05);
              sourcesRef.current.push(n);
            }, 110)
          );
          break;
        case "wind":
          loopNoise(400, 1800, 0.16);
          loopNoise(100, 600, 0.1);
          break;
        case "night":
          loopNoise(60, 900, 0.22);
          loopNoise(2500, 8000, 0.03);
          break;
        case "stream":
          loopNoise(1500, 9000, 0.06);
          loopNoise(400, 4000, 0.08);
          break;
        default:
          break;
      }
    },
    [ensureCtx, stopSources]
  );

  const stop = useCallback(() => {
    stopSources();
    setActiveId("off");
  }, [stopSources]);

  useEffect(() => {
    return () => {
      stopSources();
      if (ctxRef.current) {
        void ctxRef.current.close();
        ctxRef.current = null;
        masterRef.current = null;
      }
    };
  }, [stopSources]);

  return { activeId, volume, setVolume, play, stop };
}
