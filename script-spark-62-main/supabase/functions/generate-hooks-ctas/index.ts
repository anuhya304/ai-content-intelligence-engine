import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { script, platform, targetAudience, niche, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert at writing attention-grabbing hooks and compelling CTAs for social media content. You must respond using the generate_hooks_ctas tool.

Generate 5 hooks and 4 CTAs for the given script.

Hook types to use (mix them): question, statistic, story, bold-claim, pain-point
CTA types to use (mix them): direct, soft, urgency, value-driven

Each hook should be 1-2 sentences that stop the scroll.
Each CTA should be 1-2 sentences that drive action.
Tailor everything to ${platform}, targeting ${targetAudience} in ${niche} with a ${tone} tone.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate hooks and CTAs for this script:\n\nTitle: ${script.title}\nFramework: ${script.framework}\nScript:\n${script.fullScript}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_hooks_ctas",
              description: "Return hooks and CTAs",
              parameters: {
                type: "object",
                properties: {
                  hooks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        type: { type: "string", enum: ["question", "statistic", "story", "bold-claim", "pain-point"] },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  ctas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        type: { type: "string", enum: ["direct", "soft", "urgency", "value-driven"] },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["hooks", "ctas"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_hooks_ctas" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-hooks-ctas error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
