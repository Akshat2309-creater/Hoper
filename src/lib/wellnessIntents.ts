/** Lightweight keyword routing for in-chat wellness shortcuts (client-side only). */

export type WellnessChipId = "sleep" | "breathing" | "mood" | "checkin";

export type WellnessChip = { id: WellnessChipId; path: string };

const SLEEP_RE =
  /\b(sleep|insomnia|bed|bedtime|can't sleep|cant sleep|wake up at night|waking up|tired at night|restless night|nightmare)\b/i;
const BREATHE_RE =
  /\b(breath|breathe|breathing|panic|anxious|anxiety|overwhelm|stressed|calm down|ground|nervous|heart racing)\b/i;
const MOOD_RE = /\b(mood|how am i feeling|feel sad|feel low|feel empty|mood check)\b/i;
const CHECKIN_RE =
  /\b(assessment|check[- ]?in|mental health quiz|screening|evaluate my|how bad is)\b/i;

export function matchWellnessChips(text: string): WellnessChip[] {
  const out: WellnessChip[] = [];
  const seen = new Set<WellnessChipId>();

  const push = (id: WellnessChipId, path: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, path });
  };

  if (SLEEP_RE.test(text)) push("sleep", "/sleep?step=breathing");
  if (BREATHE_RE.test(text)) push("breathing", "/mindfulness?mode=breathing");
  if (MOOD_RE.test(text)) push("mood", "/mood-check");
  if (CHECKIN_RE.test(text)) push("checkin", "/assessment");

  return out;
}
