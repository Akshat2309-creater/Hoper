import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Heart, Shield, Clock, Lightbulb, X } from "lucide-react";

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

const Chat = ({ isOpen, onClose, initialMessage }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm HOPEr, your empathetic AI companion. I'm here to provide safe, supportive guidance whenever you need it. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
      sources: ["Mental Health First Aid Guide", "Mindfulness for Students"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
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

  // API call to backend
  const getAIResponse = async (input: string): Promise<{ content: string; sources?: string[] }> => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
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
  };

  const handleSendMessage = useCallback(async (message?: string) => {
    const messageToSend = (message ?? inputValue).trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      // Call the backend API
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
  }, [inputValue]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col min-h-[100dvh] w-screen overflow-hidden">
        {/* Header */}
        <div className="bg-secondary px-3 sm:px-6 py-4 flex items-center justify-between border-b-2 border-deep-purple">
          <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer -ml-2 sm:ml-0"
            >
              <img src="/logo.svg" alt="HOPEr Logo" className="h-12 sm:h-16 w-auto" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-secondary-foreground">HOPEr</h1>
                <p className="text-xs sm:text-sm text-secondary-foreground/80 hidden md:block">Your empathetic AI companion</p>
              </div>
            </button>
          </div>
          
          {/* Right Side - Safe & Back Button */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-secondary-foreground/80">
              <Shield className="w-4 h-4" />
              <span className="hidden lg:inline">Safe & Private</span>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="lg"
              className="text-secondary-foreground hover:text-primary px-3 sm:px-6 py-2 -mr-2 sm:mr-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Back to Website</span>
            </Button>
          </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-off-white">
          <div className="container mx-auto max-w-6xl p-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 relative ${
                    message.isUser
                      ? "bg-golden-yellow text-charcoal-gray ml-12 after:content-[''] after:absolute after:top-4 after:-right-2 after:w-0 after:h-0 after:border-l-[12px] after:border-l-golden-yellow after:border-t-[8px] after:border-t-transparent after:border-b-[8px] after:border-b-transparent"
                      : "bg-soft-lavender text-charcoal-gray mr-12 before:content-[''] before:absolute before:top-4 before:-left-2 before:w-0 before:h-0 before:border-r-[12px] before:border-r-soft-lavender before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent"
                  }`}
                >
                  <div className="space-y-3">
                    <p className="leading-relaxed">{message.content}</p>
                    
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
                    
                    <p className="text-xs text-charcoal-gray/60">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-soft-lavender rounded-lg p-4 mr-12 relative before:content-[''] before:absolute before:top-4 before:-left-2 before:w-0 before:h-0 before:border-r-[12px] before:border-r-soft-lavender before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-charcoal-gray">HOPEr is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Conversation Starters */}
            {showSuggestions && messages.length === 1 && (
              <div className="mt-8 p-6 bg-white border-2 border-deep-purple rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-golden-yellow" />
                  <h3 className="text-lg font-bold text-deep-purple">
                    Need help getting started?
                  </h3>
                </div>
                <p className="text-sm text-charcoal-gray mb-4">
                  Here are some things you can talk about with HOPEr:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(starter)}
                      className="text-left p-3 bg-off-white hover:bg-golden-yellow hover:text-charcoal-gray rounded-lg border-2 border-deep-purple hover:border-golden-yellow transition-all duration-200 group"
                    >
                      <p className="text-sm text-charcoal-gray group-hover:text-charcoal-gray">
                        {starter}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white sticky bottom-0 z-10 border-t border-deep-purple/20 pb-[env(safe-area-inset-bottom)]">
          <div className="container mx-auto max-w-6xl p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to listen and support you."
                className="h-12 text-base bg-golden-yellow/60 text-charcoal-gray placeholder-charcoal-gray/70 focus:bg-golden-yellow focus:ring-2 focus:ring-deep-purple transition-colors duration-200"
                disabled={isTyping}
                ref={inputRef}
              />
            </div>
            <Button
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
              className="h-12 px-4 bg-golden-yellow text-charcoal-gray hover:bg-golden-yellow/80"
            >
              <Lightbulb className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="h-12 px-6 bg-deep-purple text-white hover:bg-deep-purple/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          </div>
        </div>

        {/* Split Screen Suggestions */}
        {showAllSuggestions && (
          <div className="fixed inset-0 bg-white z-60 flex">
            {/* Left Side - Suggestions */}
            <div className="w-1/2 bg-off-white border-r-2 border-deep-purple flex flex-col">
              <div className="bg-secondary px-6 py-4 flex items-center justify-between border-b-2 border-deep-purple">
                <h2 className="text-xl font-bold text-secondary-foreground">Conversation Starters</h2>
                <Button
                  onClick={() => setShowAllSuggestions(false)}
                  variant="ghost"
                  size="sm"
                  className="text-secondary-foreground hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-3">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleSuggestionClick(starter);
                        setShowAllSuggestions(false);
                      }}
                      className="w-full text-left p-3 bg-white hover:bg-golden-yellow hover:text-charcoal-gray rounded-lg border-2 border-deep-purple hover:border-golden-yellow transition-all duration-200 group"
                    >
                      <p className="text-sm text-charcoal-gray group-hover:text-charcoal-gray">
                        {starter}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Side - Chat */}
            <div className="w-1/2 flex flex-col">
              {/* Header */}
              <div className="bg-secondary px-6 py-4 flex items-center justify-between border-b-2 border-deep-purple">
                <button 
                  onClick={onClose}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img src="/logo.svg" alt="HOPEr Logo" className="h-16 w-auto" />
                  <div>
                    <h1 className="text-xl font-bold text-secondary-foreground">HOPEr</h1>
                    <p className="text-sm text-secondary-foreground/80">Your empathetic AI companion</p>
                  </div>
                </button>
                <div className="flex items-center space-x-2 text-xs text-secondary-foreground/80">
                  <Shield className="w-4 h-4" />
                  <span>Safe & Private</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto bg-off-white">
                <div className="container mx-auto max-w-6xl p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-3xl rounded-lg p-4 relative ${
                            message.isUser
                              ? "bg-golden-yellow text-charcoal-gray ml-12 after:content-[''] after:absolute after:top-4 after:-right-2 after:w-0 after:h-0 after:border-l-[12px] after:border-l-golden-yellow after:border-t-[8px] after:border-t-transparent after:border-b-[8px] after:border-b-transparent"
                              : "bg-soft-lavender text-charcoal-gray mr-12 before:content-[''] before:absolute before:top-4 before:-left-2 before:w-0 before:h-0 before:border-r-[12px] before:border-r-soft-lavender before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent"
                          }`}
                        >
                          <div className="space-y-3">
                            <p className="leading-relaxed">{message.content}</p>
                            
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
                            
                            <p className="text-xs text-charcoal-gray/60">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-soft-lavender rounded-lg p-4 mr-12 relative before:content-[''] before:absolute before:top-4 before:-left-2 before:w-0 before:h-0 before:border-r-[12px] before:border-r-soft-lavender before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-2 h-2 bg-golden-yellow rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-sm text-charcoal-gray">HOPEr is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-white">
                <div className="container mx-auto max-w-6xl p-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share what's on your mind... I'm here to listen and support you."
                        className="h-12 text-base bg-golden-yellow/60 text-charcoal-gray placeholder-charcoal-gray/70 focus:bg-golden-yellow focus:ring-2 focus:ring-deep-purple transition-colors duration-200"
                        disabled={isTyping}
                      />
                    </div>
                    <Button
                      onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                      className="h-12 px-4 bg-golden-yellow text-charcoal-gray hover:bg-golden-yellow/80"
                    >
                      <Lightbulb className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="h-12 px-6 bg-deep-purple text-white hover:bg-deep-purple/90"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Chat;
