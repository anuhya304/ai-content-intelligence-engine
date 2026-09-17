import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { niche, targetAudience, platform, goal, tone, topicSeeds, researchData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert content strategist and scriptwriter. You create viral scripts for social media content creators.

You must respond using the suggest_scripts tool with exactly 3 scripts.

Each script must:
- Be tailored to the ${platform} platform
- Target ${targetAudience} in the ${niche} niche
- Optimize for ${goal}
- Use a ${tone} tone
- Be based on proven viral frameworks (name the framework used)
- Include a clear outline and full script text

Use any research data provided to make scripts more specific and relevant.`;

    const userPrompt = `Create 3 unique content scripts based on:

Niche: ${niche}
Target Audience: ${targetAudience}
Platform: ${platform}
Goal: ${goal}
Tone: ${tone}
Topic Seeds: ${topicSeeds || "No specific seeds provided"}

Research/Trend Data:
${researchData || "No research data available"}

Generate 3 completely different scripts using different viral frameworks.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_scripts",
              description: "Return 3 generated scripts",
              parameters: {
                type: "object",
                properties: {
                  scripts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        framework: { type: "string", description: "Name of the viral framework used" },
                        outline: { type: "array", items: { type: "string" }, description: "3-5 key points" },
                        fullScript: { type: "string", description: "The complete script text, 150-300 words" },
                      },
                      required: ["title", "framework", "outline", "fullScript"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["scripts"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_scripts" } },
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
    console.error("generate-scripts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
