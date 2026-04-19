import { useState } from "react";
import { Button } from "@/components/ui/button";

type Choice = { labelKey: string; next: number };
type Node = { textKey: string; choices?: Choice[] };

/** Linear branching “choose your calm” — keys under sleep.story.* in i18n. */
const NODES: Node[] = [
  {
    textKey: "sleep.story.n0",
    choices: [
      { labelKey: "sleep.story.n0.train", next: 1 },
      { labelKey: "sleep.story.n0.library", next: 2 },
    ],
  },
  {
    textKey: "sleep.story.n1",
    choices: [{ labelKey: "sleep.story.n1.next", next: 3 }],
  },
  {
    textKey: "sleep.story.n2",
    choices: [{ labelKey: "sleep.story.n2.next", next: 3 }],
  },
  {
    textKey: "sleep.story.n3",
    choices: [
      { labelKey: "sleep.story.n3.window", next: 4 },
      { labelKey: "sleep.story.n3.blanket", next: 4 },
    ],
  },
  { textKey: "sleep.story.n4" },
];

type Props = {
  t: (k: string) => string;
  onDone: () => void;
};

export function SleepBranchStory({ t, onDone }: Props) {
  const [i, setI] = useState(0);
  const node = NODES[i];

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="rounded-2xl border border-border bg-card px-5 py-8 text-left text-card-foreground shadow-sm dark:bg-card/90 sm:px-8">
        <p className="text-base leading-relaxed text-foreground sm:text-lg">{t(node.textKey)}</p>
      </div>
      {node.choices && node.choices.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {node.choices.map((c) => (
            <Button
              key={c.labelKey}
              type="button"
              variant="secondary"
              className="min-h-[3rem] flex-1 sm:min-w-[10rem]"
              onClick={() => setI(c.next)}
            >
              {t(c.labelKey)}
            </Button>
          ))}
        </div>
      ) : (
        <Button type="button" onClick={onDone}>
          {t("sleep.story.done")}
        </Button>
      )}
    </div>
  );
}
