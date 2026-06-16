import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Send, Leaf } from "lucide-react";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What is causing climate change in Nigeria?",
  "How does the Paris Agreement work?",
  "What can I do to reduce my carbon footprint?",
  "Explain ocean acidification simply",
];

const ERROR_MSG = "I'm having trouble connecting right now. Try again in a moment.";

export default function AIMentor() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const awardedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed || loading) return;

    const userMsg: ChatMsg = { role: "user", content: trimmed };
    const history = [...messages, userMsg].slice(-10);
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    if (!awardedRef.current) {
      awardedRef.current = true;
      (supabase.rpc as any)("award_mentor_points").catch(() => {});
    }

    try {
      const { data, error } = await supabase.functions.invoke("ai-mentor", {
        body: { messages: history },
      });
      if (error || !data?.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data?.error || ERROR_MSG }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: ERROR_MSG }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <Layout>
      <div className="container max-w-lg mx-auto flex flex-col h-[calc(100vh-9rem)]">
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full eco-gradient flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold leading-tight">AI Climate Mentor</h1>
              <p className="text-xs text-muted-foreground">Ask anything about climate change</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full eco-gradient flex items-center justify-center mb-3">
                  <Leaf className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Hi! I'm your Climate Mentor. Ask me anything about our planet.
                </p>
              </div>
              <div className="grid gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full eco-gradient flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-sm whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                    : "bg-card border border-border rounded-2xl rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full eco-gradient flex items-center justify-center shrink-0 mt-0.5">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-card border-t border-border p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            placeholder="Ask about climate change..."
            maxLength={500}
            disabled={loading}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-xl bg-primary text-primary-foreground px-4 flex items-center justify-center disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Layout>
  );
}
