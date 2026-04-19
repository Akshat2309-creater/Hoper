/** Session-only bridge between wellness tools and chat (no PHI; keep summaries short). */

export const WELLNESS_CONTEXT_KEY = "hoper_wellness_context";

export type WellnessContextSource =
  | "mood-quiz"
  | "assessment"
  | "sleep"
  | "mindfulness";

export type WellnessContext = {
  source: WellnessContextSource;
  /** One or two sentences max — shown in chat banner and prefixed to prompts. */
  summary: string;
  moodLabel?: string;
  moodKey?: string;
  savedAt: string;
};

export function setWellnessContext(ctx: WellnessContext): void {
  try {
    sessionStorage.setItem(WELLNESS_CONTEXT_KEY, JSON.stringify(ctx));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getWellnessContext(): WellnessContext | null {
  try {
    const raw = sessionStorage.getItem(WELLNESS_CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WellnessContext;
    if (!parsed?.summary || typeof parsed.summary !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearWellnessContext(): void {
  try {
    sessionStorage.removeItem(WELLNESS_CONTEXT_KEY);
  } catch {
    /* ignore */
  }
}
