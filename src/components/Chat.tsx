import {
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Cloud,
  Flower2,
  Heart,
  Leaf,
  Lightbulb,
  MessageCircle,
  Moon,
  Send,
  Shield,
  Smile,
  Sparkles,
  Sun,
  Wind,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageGlobeMenu } from "@/components/LanguageMenu";
import {
  getWellnessContext,
  clearWellnessContext,
  type WellnessContext,
} from "@/lib/wellnessContext";
import { matchWellnessChips, type WellnessChip } from "@/lib/wellnessIntents";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: string[];
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

/** Inline **bold** from model text (no raw HTML). */
function formatInlineBold(text: string): ReactNode {
  if (!text.includes("**")) return text;
  const chunks = text.split("**");
  return chunks.map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {chunk}
      </strong>
    ) : (
      <Fragment key={i}>{chunk}</Fragment>
    )
  );
}

/**
 * Renders HOPEr replies with headings, subheadings, paragraphs, and bullets
 * when the model uses simple Markdown-style lines (##, ###, -).
 */
function AssistantRichText({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let ulItems: string[] = [];
  let olItems: string[] = [];
  let id = 0;
  const key = () => `a-${id++}`;

  const flushParagraph = () => {
    if (para.length === 0) return;
    const text = para.join("\n").trimEnd();
    para = [];
    if (!text) return;
    blocks.push(
      <p key={key()} className="leading-relaxed whitespace-pre-line">
        {formatInlineBold(text)}
      </p>
    );
  };

  const flushUl = () => {
    if (ulItems.length === 0) return;
    blocks.push(
      <ul
        key={key()}
        className="my-1.5 list-disc space-y-1 pl-5 marker:text-deep-purple/70"
      >
        {ulItems.map((item, i) => (
          <li key={i} className="leading-relaxed pl-0.5">
            {formatInlineBold(item)}
          </li>
        ))}
      </ul>
    );
    ulItems = [];
  };

  const flushOl = () => {
    if (olItems.length === 0) return;
    blocks.push(
      <ol
        key={key()}
        className="my-1.5 list-decimal space-y-1 pl-5 marker:text-deep-purple/80"
      >
        {olItems.map((item, i) => (
          <li key={i} className="leading-relaxed pl-1">
            {formatInlineBold(item)}
          </li>
        ))}
      </ol>
    );
    olItems = [];
  };

  const flushLists = () => {
    flushUl();
    flushOl();
  };

  const stripHeading = (t: string, hashes: string): string => {
    if (t.startsWith(`${hashes} `)) return t.slice(hashes.length + 1);
    if (t.startsWith(hashes)) return t.slice(hashes.length).replace(/^\s+/, "");
    return t;
  };

  for (const raw of lines) {
    const t = raw.trimEnd();
    const trimmed = t.trim();
    if (!trimmed) {
      flushLists();
      flushParagraph();
      continue;
    }

    if (trimmed.startsWith("###")) {
      flushLists();
      flushParagraph();
      blocks.push(
        <h3
          key={key()}
          className="mt-3 border-b border-deep-purple/15 pb-1 text-sm font-semibold tracking-tight text-deep-purple first:mt-0"
        >
          {formatInlineBold(stripHeading(trimmed, "###"))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("##")) {
      flushLists();
      flushParagraph();
      blocks.push(
        <h2
          key={key()}
          className="mt-4 text-base font-bold text-deep-purple first:mt-0"
        >
          {formatInlineBold(stripHeading(trimmed, "##"))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("#") && !trimmed.startsWith("##")) {
      flushLists();
      flushParagraph();
      blocks.push(
        <h2
          key={key()}
          className="mt-4 text-base font-bold text-deep-purple first:mt-0"
        >
          {formatInlineBold(stripHeading(trimmed, "#"))}
        </h2>
      );
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushOl();
      flushParagraph();
      ulItems.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      flushUl();
      flushParagraph();
      olItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    }

    flushLists();
    para.push(trimmed);
  }
  flushLists();
  flushParagraph();

  return <div className="space-y-2 text-left">{blocks}</div>;
}

const doodleStroke = { strokeWidth: 1 as const };

/** Faint wellness-themed line art behind the thread (not interactive). */
function ChatThreadDoodles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden text-deep-purple select-none"
      aria-hidden
    >
      <div className="opacity-[0.055] sm:opacity-[0.075]">
        <Heart className="absolute left-[2%] top-[8%] h-10 w-10 -rotate-6" {...doodleStroke} />
        <Leaf className="absolute right-[6%] top-[6%] h-9 w-9 rotate-12" {...doodleStroke} />
        <Moon className="absolute left-[14%] top-[22%] h-11 w-11 -rotate-3" {...doodleStroke} />
        <Brain className="absolute right-[3%] top-[18%] h-12 w-12 rotate-6" {...doodleStroke} />
        <MessageCircle
          className="absolute left-1/2 top-[4%] h-9 w-9 -translate-x-1/2"
          {...doodleStroke}
        />
        <Lightbulb className="absolute right-[22%] top-[12%] h-10 w-10 -rotate-12" {...doodleStroke} />
        <Sparkles className="absolute left-[8%] top-[38%] h-8 w-8 -rotate-20" {...doodleStroke} />
        <Sun className="absolute right-[12%] top-[32%] h-10 w-10 rotate-12" {...doodleStroke} />
        <Cloud className="absolute left-[4%] top-[52%] h-11 w-11" {...doodleStroke} />
        <Flower2 className="absolute right-[8%] top-[48%] h-9 w-9 rotate-45" {...doodleStroke} />
        <Wind className="absolute left-[20%] top-[58%] h-10 w-10 -rotate-6" {...doodleStroke} />
        <Smile className="absolute right-[28%] top-[62%] h-9 w-9" {...doodleStroke} />
        <BookOpen className="absolute left-[6%] bottom-[18%] h-10 w-10 rotate-3" {...doodleStroke} />
        <Heart className="absolute right-[4%] bottom-[12%] h-9 w-9 rotate-9" {...doodleStroke} />
        <Leaf className="absolute left-[32%] bottom-[8%] h-8 w-8 -rotate-45" {...doodleStroke} />
        <Moon className="absolute right-[38%] bottom-[6%] h-9 w-9 rotate-6" {...doodleStroke} />
        <Sparkles className="absolute left-[48%] bottom-[14%] h-8 w-8 rotate-12" {...doodleStroke} />
        <Cloud className="absolute right-[16%] bottom-[22%] h-10 w-10 -rotate-6" {...doodleStroke} />
        <Brain className="absolute left-[40%] top-[28%] h-9 w-9 -rotate-12" {...doodleStroke} />
        <Flower2 className="absolute right-[40%] top-[42%] h-8 w-8 -rotate-12" {...doodleStroke} />
        <MessageCircle className="absolute left-[24%] top-[12%] h-8 w-8 rotate-6" {...doodleStroke} />
        <Sun className="absolute left-[52%] bottom-[28%] h-9 w-9" {...doodleStroke} />
        <Wind className="absolute right-[48%] top-[20%] h-8 w-8 rotate-3" {...doodleStroke} />
      </div>
    </div>
  );
}

function ChatComposer({
  inputValue,
  setInputValue,
  onKeyDown,
  isTyping,
  inputRef,
  onIdeasClick,
  onSend,
  t,
}: {
  inputValue: string;
  setInputValue: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isTyping: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onIdeasClick: () => void;
  onSend: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="shrink-0 bg-transparent pb-[env(safe-area-inset-bottom)] pt-1">
      <div className="w-full px-4 pb-4 pt-0 sm:px-6 sm:pb-5 lg:px-10">
        <div
          className="mx-auto w-full max-w-3xl rounded-2xl p-[2px] shadow-[0_12px_36px_rgba(108,74,182,0.22)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 45%, hsl(43 90% 48%) 100%)",
          }}
        >
          <div className="flex items-stretch gap-2 overflow-hidden rounded-[13px] border border-white/60 bg-white/55 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm dark:border-deep-purple/25 dark:bg-chat-thread dark:shadow-none dark:backdrop-blur-none sm:gap-2.5 sm:rounded-[14px] sm:p-2.5">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={
                t("chat.placeholder") ||
                "Share what's on your mind... I'm here to listen and support you."
              }
              disabled={isTyping}
              ref={inputRef}
              className="min-h-[2.75rem] flex-1 rounded-xl border border-deep-purple/20 bg-[#F5EFE4] px-3 py-2 text-[15px] font-medium leading-relaxed text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-deep-purple/40 focus-visible:ring-1 focus-visible:ring-deep-purple/30 focus-visible:ring-offset-0 dark:border-deep-purple/30 dark:bg-chat-thread sm:min-h-[3rem] sm:text-base"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl border-2 border-deep-purple/40 bg-golden-yellow/90 text-deep-purple shadow-sm hover:bg-golden-yellow sm:h-12 sm:w-12"
              aria-label={t("chat.startersTitle")}
              onClick={onIdeasClick}
            >
              <Lightbulb className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              onClick={onSend}
              disabled={!inputValue.trim() || isTyping}
              className="h-11 min-w-[3rem] shrink-0 rounded-xl bg-secondary px-4 text-secondary-foreground shadow-md ring-2 ring-deep-purple/20 hover:bg-secondary/90 hover:ring-primary/50 disabled:opacity-40 sm:h-12 sm:min-w-[3.25rem]"
              aria-label={t("chat.send")}
            >
              <Send className="mx-auto h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const chatLangMenuPanel =
  "border border-border bg-popover p-1 text-popover-foreground shadow-lg rounded-md min-w-[10rem]";
const chatLangMenuItem =
  "cursor-pointer rounded-md font-medium focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground";

const Chat = ({ isOpen, onClose, initialMessage }: ChatProps) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: t("chat.openingMessage"),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [wellnessBanner, setWellnessBanner] = useState<WellnessContext | null>(null);
  const [featureChips, setFeatureChips] = useState<WellnessChip[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  // Conversation starter suggestions
  const conversationStarters = [
    "I've been feeling really low today.",
    "I can't focus on anything right now.",
    "I feel so anxious about tomorrow.",
    "I don't think I'm good enough.",
    "I had a fight with a close friend.",
    "I can't sleep at night.",
    "I feel so alone.",
    "Nothing excites me anymore.",
    "I'm overwhelmed with everything I have to do.",
    "Sometimes I wonder if things will ever get better.",
    "Hi, how are you?",
    "Hello, I need someone to talk to.",
    "I'm having a panic attack.",
    "I feel like I'm failing at everything.",
    "My parents don't understand me.",
    "I'm scared about my future.",
    "I can't stop worrying.",
    "I feel disconnected from everyone.",
    "I'm struggling with my studies.",
    "I feel like giving up.",
    "I'm having relationship problems.",
    "I feel worthless.",
    "I can't make decisions.",
    "I'm always tired.",
    "I feel like I'm not normal.",
    "I'm scared of social situations.",
    "I feel like I'm disappointing everyone.",
    "I can't handle stress anymore.",
    "I feel like I'm going crazy.",
    "I'm having trouble eating.",
    "I feel like I'm stuck in life.",
    "I'm scared of being judged.",
    "I feel like I don't belong anywhere.",
    "I'm having family issues.",
    "I feel like I'm a burden to others.",
    "I can't stop overthinking.",
    "I feel like I'm losing control.",
    "I'm scared of making mistakes.",
    "I feel like I'm not good enough for anyone.",
    "I'm having trouble with my self-esteem.",
    "I feel like I'm wasting my life.",
    "I'm scared of the future.",
    "I feel like I'm always messing up.",
    "I can't seem to be happy.",
    "I feel like I'm invisible.",
    "I'm having trouble trusting people.",
    "I feel like I'm a failure.",
    "I'm scared of being alone.",
    "I feel like I'm not living up to expectations.",
    "I can't seem to find motivation.",
    "I feel like I'm broken.",
    "I'm having trouble with my identity.",
    "I feel like I'm not worthy of love.",
    "I'm scared of change.",
    "I feel like I'm stuck in a rut.",
    "I can't seem to find my purpose.",
    "I feel like I'm disappointing myself.",
    "I'm having trouble with my emotions.",
    "I feel like I'm not strong enough.",
    "I'm scared of being vulnerable.",
    "I feel like I'm losing myself."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setWellnessBanner(getWellnessContext());
  }, []);

  // Scroll into view when input focuses (helps on mobile keyboards)
  useEffect(() => {
    const handler = () => {
      setTimeout(scrollToBottom, 100);
    };
    const el = inputRef.current;
    if (el) {
      el.addEventListener('focus', handler);
    }
    return () => {
      if (el) {
        el.removeEventListener('focus', handler);
      }
    };
  }, []);

  const getAIResponse = useCallback(
    async (input: string): Promise<{ content: string; sources?: string[] }> => {
    try {
      const ctx = getWellnessContext();
      const prompt =
        ctx?.summary?.trim()
          ? `${t("chat.contextPromptPrefix")}${ctx.summary.trim()}\n\nUser:\n${input}`
          : input;

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, language: language }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract sources from the response
      // Sources are in format: [{ source: "path/to/file", content: "..." }, ...]
      const sourcesList: string[] = [];
      if (data.sources && Array.isArray(data.sources)) {
        data.sources.forEach((src: { source?: string; content?: string }) => {
          if (src.source) {
            // Extract just the filename from the path for cleaner display
            const fileName = src.source.split(/[/\\]/).pop() || src.source;
            sourcesList.push(fileName);
          }
        });
      }

      return {
        content: data.answer || "I'm sorry, I couldn't generate a response. Please try again.",
        sources: sourcesList.length > 0 ? sourcesList : undefined,
      };
    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Fallback response in case of error
      return {
        content: "I'm sorry, I'm having trouble connecting right now. Please check your connection and try again. If the problem persists, I'm still here to listen and support you.",
        sources: undefined,
      };
    }
    },
    [language, t]
  );

  const handleSendMessage = useCallback(async (message?: string) => {
    const messageToSend = (message ?? inputValue).trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    const chips = matchWellnessChips(messageToSend);
    setFeatureChips(chips.length > 0 ? chips : null);

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await getAIResponse(messageToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please check your connection and try again. If the problem persists, I'm still here to listen and support you.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, getAIResponse]);

  useEffect(() => {
    if (!initialMessage || hasProcessedInitialMessage.current) return;

    const trimmed = initialMessage.trim();
    if (!trimmed) return;

    hasProcessedInitialMessage.current = true;
    handleSendMessage(trimmed);
  }, [initialMessage, handleSendMessage]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const bubbleBase =
    "max-w-[min(92vw,42rem)] rounded-2xl px-4 py-3 shadow-md sm:max-w-[44rem]";

  const bubbleEnterUser =
    "motion-reduce:animate-none animate-in fade-in-0 zoom-in-95 slide-in-from-right-4 duration-300 ease-out";
  const bubbleEnterAssistant =
    "motion-reduce:animate-none animate-in fade-in-0 zoom-in-95 slide-in-from-left-4 duration-300 ease-out";

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden bg-chat-surface">
        <header className="shrink-0 border-b border-secondary-foreground/15 bg-secondary px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
              <img
                src="/logo.svg"
                alt=""
                className="h-8 w-auto sm:h-9"
              />
              <div className="min-w-0 leading-tight">
                <p className="font-bold text-secondary-foreground sm:text-lg">HOPEr</p>
                <p className="hidden text-xs text-secondary-foreground/75 sm:block">
                  {t("chat.headerTagline")}
                </p>
              </div>
            </div>
            <div className="min-w-0 flex-1" aria-hidden="true" />
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <span className="inline-flex max-w-[7.5rem] items-center gap-1 rounded-full border border-secondary-foreground/20 bg-secondary-foreground/5 px-2 py-1 text-[10px] font-medium leading-tight text-secondary-foreground/95 sm:max-w-none sm:px-2.5 sm:text-xs">
                <Shield className="h-3.5 w-3.5 shrink-0 opacity-90" />
                <span className="truncate">{t("chat.safePill")}</span>
              </span>
              <LanguageGlobeMenu
                setLanguage={setLanguage}
                menuClassName={chatLangMenuPanel}
                itemClassName={chatLangMenuItem}
                sideOffset={10}
                compact
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-9 shrink-0 px-2 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-primary sm:px-3"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden text-sm font-medium sm:inline">{t("chat.backHome")}</span>
              </Button>
            </div>
          </div>
        </header>

        {wellnessBanner?.summary && (
          <div
            role="status"
            className="shrink-0 border-b border-secondary-foreground/10 bg-secondary-foreground/[0.07] px-3 py-2.5 sm:px-6"
          >
            <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground/70">
                  {t("chat.wellnessBannerTitle")}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-secondary-foreground sm:text-sm">
                  {wellnessBanner.summary}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 px-2 text-[11px] text-secondary-foreground hover:bg-secondary-foreground/10"
                onClick={() => {
                  clearWellnessContext();
                  setWellnessBanner(null);
                }}
              >
                {t("chat.wellnessDismiss")}
              </Button>
            </div>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col bg-chat-surface">
          <div className="flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1 overflow-y-auto bg-chat-thread">
            <ChatThreadDoodles />
            <div className="relative z-10 w-full px-4 py-5 sm:px-6 lg:px-10">
              <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${bubbleBase} ${
                    message.isUser
                      ? `border-2 border-primary/60 bg-golden-yellow text-[hsl(26_18%_14%)] ring-1 ring-primary/30 ${bubbleEnterUser}`
                      : `border-2 border-deep-purple/35 bg-soft-lavender text-foreground shadow-sm ring-1 ring-deep-purple/15 ${bubbleEnterAssistant}`
                  }`}
                >
                  <div className="space-y-3">
                    {message.isUser ? (
                      <p className="leading-relaxed">{message.content}</p>
                    ) : (
                      <AssistantRichText content={message.content} />
                    )}

                    {!message.isUser && message.sources && (
                      <div className="pt-3 border-t border-deep-purple/20">
                        <p className="text-xs text-deep-purple mb-2 font-bold uppercase tracking-wider">
                          Sources:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <span
                              key={index}
                              className="text-xs bg-deep-purple text-white px-2 py-1 rounded-full"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className={`${bubbleBase} border-2 border-deep-purple/35 bg-soft-lavender text-foreground shadow-sm ring-1 ring-deep-purple/15 ${bubbleEnterAssistant}`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-foreground">{t("chat.thinking") || "HOPEr is thinking..."}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {featureChips && featureChips.length > 0 && (
            <div className="shrink-0 border-t border-deep-purple/15 bg-chat-thread/95 px-4 py-2.5 sm:px-6 lg:px-10">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("chat.chipsTitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {featureChips.map((chip) => (
                  <Button
                    key={chip.id}
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="rounded-full border border-deep-purple/25 bg-soft-lavender/80 text-xs font-semibold text-deep-purple hover:bg-soft-lavender"
                    onClick={() => navigate(chip.path)}
                  >
                    {t(`chat.chip.${chip.id}`)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <ChatComposer
            inputValue={inputValue}
            setInputValue={setInputValue}
            onKeyDown={handleComposerKeyDown}
            isTyping={isTyping}
            inputRef={inputRef}
            onIdeasClick={() => setShowAllSuggestions(true)}
            onSend={() => handleSendMessage()}
            t={t}
          />
          </div>
        </div>

        {/* Split Screen Suggestions */}
        {showAllSuggestions && (
          <div className="fixed inset-0 z-[110] flex bg-background/95 backdrop-blur-sm dark:bg-background/98">
            {/* Left Side - Suggestions */}
            <div className="flex w-1/2 min-w-0 flex-col border-r border-deep-purple/20 bg-off-white">
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-secondary-foreground/15 bg-secondary px-4 py-3 sm:px-5">
                <h2 className="truncate text-sm font-bold text-secondary-foreground sm:text-base">
                  {t("chat.startersTitle")}
                </h2>
                <Button
                  type="button"
                  onClick={() => setShowAllSuggestions(false)}
                  variant="ghost"
                  size="sm"
                  className="h-9 shrink-0 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="space-y-2.5">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        handleSuggestionClick(starter);
                        setShowAllSuggestions(false);
                      }}
                      className="group w-full rounded-xl border border-deep-purple/25 bg-card/95 p-3 text-left text-foreground transition-all hover:border-golden-yellow/80 hover:bg-golden-yellow/35 dark:hover:bg-golden-yellow/20"
                    >
                      <p className="text-sm text-foreground/90 group-hover:text-foreground">
                        {starter}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Side - Chat */}
            <div className="flex min-h-0 w-1/2 flex-col bg-background">
              <header className="shrink-0 border-b border-secondary-foreground/15 bg-secondary px-3 py-2.5 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex min-w-0 shrink-0 items-center gap-2">
                    <img src="/logo.svg" alt="" className="h-7 w-auto sm:h-8" />
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-bold text-secondary-foreground sm:text-base">
                        HOPEr
                      </p>
                      <p className="hidden text-[10px] text-secondary-foreground/75 sm:block sm:text-xs">
                        {t("chat.headerTagline")}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1" aria-hidden="true" />
                  <span className="inline-flex max-w-[6.5rem] shrink-0 items-center gap-1 rounded-full border border-secondary-foreground/20 bg-secondary-foreground/5 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground/95 sm:max-w-none sm:text-xs">
                    <Shield className="h-3 w-3 shrink-0" />
                    <span className="truncate">{t("chat.safePill")}</span>
                  </span>
                  <LanguageGlobeMenu
                    setLanguage={setLanguage}
                    menuClassName={chatLangMenuPanel}
                    itemClassName={chatLangMenuItem}
                    sideOffset={8}
                    compact
                  />
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col bg-chat-surface">
                <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative min-h-0 flex-1 overflow-y-auto bg-chat-thread">
                  <ChatThreadDoodles />
                  <div className="relative z-10 w-full p-4 sm:p-5">
                    <div className="space-y-5">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`${bubbleBase} ${
                            message.isUser
                              ? `border-2 border-primary/60 bg-golden-yellow text-[hsl(26_18%_14%)] ring-1 ring-primary/30 ${bubbleEnterUser}`
                              : `border-2 border-deep-purple/35 bg-soft-lavender text-foreground shadow-sm ring-1 ring-deep-purple/15 ${bubbleEnterAssistant}`
                          }`}
                        >
                          <div className="space-y-3">
                            {message.isUser ? (
                              <p className="leading-relaxed">{message.content}</p>
                            ) : (
                              <AssistantRichText content={message.content} />
                            )}

                            {!message.isUser && message.sources && (
                              <div className="pt-3 border-t border-deep-purple/20">
                                <p className="text-xs text-deep-purple mb-2 font-bold uppercase tracking-wider">
                                  Sources:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {message.sources.map((source, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-deep-purple text-white px-2 py-1 rounded-full"
                                    >
                                      {source}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <p className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div
                          className={`${bubbleBase} border-2 border-deep-purple/35 bg-soft-lavender text-foreground shadow-sm ring-1 ring-deep-purple/15 ${bubbleEnterAssistant}`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 animate-bounce rounded-full bg-golden-yellow" style={{ animationDelay: "0ms" }} />
                              <div className="h-2 w-2 animate-bounce rounded-full bg-golden-yellow" style={{ animationDelay: "150ms" }} />
                              <div className="h-2 w-2 animate-bounce rounded-full bg-golden-yellow" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-sm text-foreground">
                              {t("chat.thinking") || "HOPEr is thinking..."}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>

                <ChatComposer
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onKeyDown={handleComposerKeyDown}
                  isTyping={isTyping}
                  onIdeasClick={() => setShowAllSuggestions(false)}
                  onSend={() => handleSendMessage()}
                  t={t}
                />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Chat;
