import { Globe } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

type LanguageMenuProps = {
  setLanguage: (code: Language) => void;
  menuClassName: string;
  itemClassName: string;
  sideOffset?: number;
  /** Smaller trigger for compact headers (e.g. chat). */
  compact?: boolean;
};

export function LanguageGlobeMenu({
  setLanguage,
  menuClassName,
  itemClassName,
  sideOffset = 20,
  compact = false,
}: LanguageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            compact
              ? "rounded-md p-1.5 text-secondary-foreground outline-none transition-colors hover:bg-secondary-foreground/10 hover:text-primary data-[state=open]:text-primary"
              : "rounded-md p-2 text-secondary-foreground outline-none transition-colors hover:text-primary data-[state=open]:text-primary"
          }
          aria-label="Language"
        >
          <Globe className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={sideOffset}
        className={menuClassName}
      >
        {LANGUAGE_OPTIONS.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={itemClassName}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
