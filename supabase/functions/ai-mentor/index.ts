// AI Climate Mentor edge function using Lovable AI Gateway
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are EcoLara's AI Climate Mentor — a friendly, encouraging, and knowledgeable guide for Nigerian university students learning about climate change. Your personality is warm, like a trusted older student. Keep all responses under 150 words. Use simple language — no jargon without explanation. Always connect your answers to local Nigerian context when relevant (Lagos flooding, Sahel desertification, Niger Delta oil spills, etc.). End each response with one short follow-up question to encourage continued learning. Never give medical, legal, or financial advice. If asked about something unrelated to climate or environment (sports, celebrities, coding, math homework, relationships, politics not tied to climate, etc.), gently redirect: "I'm best at helping with climate topics — want to explore something about the environment?" Refuse harmful, hateful, sexual, or violent requests politely and redirect to climate topics.`;

const REDIRECT_MSG = "I'm best at helping with climate topics — want to explore something about the environment? 🌍";

// Quick keyword filter for obviously off-topic / unsafe prompts
const BLOCKED_PATTERNS = [
  /\b(porn|sex|nude|nsfw)\b/i,
  /\b(kill|murder|suicide|bomb|weapon)\b/i,
  /\b(hack|exploit|malware|password|credit card)\b/i,
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!apiKey || !supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastUser = [...messages].reverse().find((m) => m?.role === "user");
    const lastText = String(lastUser?.content ?? "");

    // Local safety filter — short-circuit before consuming AI credits
    if (BLOCKED_PATTERNS.some((re) => re.test(lastText))) {
      return new Response(JSON.stringify({ reply: REDIRECT_MSG, redirected: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit check (per user, enforced in DB)
    const { data: rl, error: rlErr } = await supabase.rpc("check_mentor_rate_limit");
    if (rlErr) {
      console.error("rate limit check failed", rlErr);
      return new Response(JSON.stringify({ error: "Auth check failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (rl && (rl as any).allowed === false) {
      return new Response(
        JSON.stringify({ error: (rl as any).message || "Rate limit exceeded", rate_limited: true, reason: (rl as any).reason }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmed = messages.slice(-10);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmed,
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gateway error", res.status, text);
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "AI service is busy. Please try again in a moment.", rate_limited: true }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "The mentor is having trouble responding. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const reply = String(data?.choices?.[0]?.message?.content ?? "").trim();

    if (!reply) {
      return new Response(
        JSON.stringify({ reply: "Hmm, I couldn't find a good answer for that. Could you rephrase your climate question?", empty: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-mentor error", e);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
