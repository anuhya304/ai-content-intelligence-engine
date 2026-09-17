import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DiscoveryInput, Platform, Goal, Tone } from "@/types/content-engine";
import { Target, Users, MonitorSmartphone, Crosshair, MessageSquare, Lightbulb, ArrowRight } from "lucide-react";

const TOPIC_SUGGESTIONS = [
  { emoji: "💡", label: "Agency cash flow" },
  { emoji: "⚠️", label: "Client red flags" },
  { emoji: "📬", label: "Outreach that works" },
  { emoji: "⚡", label: "Busy vs building" },
  { emoji: "🚀", label: "Landing first client" },
  { emoji: "💰", label: "Pricing strategy" },
  { emoji: "🧠", label: "Impostor syndrome" },
  { emoji: "📊", label: "Content mistakes" },
  { emoji: "⚙️", label: "Scaling the agency" },
  { emoji: "🎯", label: "Niching down" },
  { emoji: "🤯", label: "Burnout & hustle" },
  { emoji: "🧩", label: "Productised offers" },
];

interface DiscoveryStepProps {
  onSubmit: (data: DiscoveryInput) => void;
  isLoading: boolean;
  initialData?: DiscoveryInput;
}

export function DiscoveryStep({ onSubmit, isLoading, initialData }: DiscoveryStepProps) {
  const [form, setForm] = useState<DiscoveryInput>(
    initialData || {
      niche: "",
      targetAudience: "",
      platform: "instagram",
      goal: "growth",
      tone: "storytelling",
      topicSeeds: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.niche.trim() || !form.targetAudience.trim()) return;
    onSubmit(form);
  };

  const addTopicSeed = (label: string) => {
    const current = form.topicSeeds.trim();
    if (current.toLowerCase().includes(label.toLowerCase())) return;
    setForm((prev) => ({
      ...prev,
      topicSeeds: current ? `${current}. ${label}` : label,
    }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl" style={{ lineHeight: "1.1" }}>
        DISCOVERY LAB
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
        Input your niche, audience, and raw ideas. The engine pattern-matches your input
        against <span className="font-semibold text-primary">60+ viral frameworks</span> and
        generates fully written, unique scripts every single run.
      </p>

      <form onSubmit={handleSubmit} className="mt-10">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-8">
          {/* Row 1: Niche + Target Audience */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-label uppercase font-mono-alt">
                <Target className="h-3.5 w-3.5" /> Niche
              </label>
              <Input
                value={form.niche}
                onChange={(e) => setForm((p) => ({ ...p, niche: e.target.value }))}
                placeholder="e.g. Fitness, SaaS, Real Estate"
                className="h-12 bg-input border-border text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-label uppercase font-mono-alt">
                <Users className="h-3.5 w-3.5" /> Target Audience
              </label>
              <Input
                value={form.targetAudience}
                onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                placeholder="e.g. Beginners, Agency owners, Trainers"
                className="h-12 bg-input border-border text-base"
              />
            </div>
          </div>

          {/* Row 2: Platform + Goal */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-label uppercase font-mono-alt">
                <MonitorSmartphone className="h-3.5 w-3.5" /> Platform
              </label>
              <Select value={form.platform} onValueChange={(v) => setForm((p) => ({ ...p, platform: v as Platform }))}>
                <SelectTrigger className="h-12 bg-input border-border text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-label uppercase font-mono-alt">
                <Crosshair className="h-3.5 w-3.5" /> Goal
              </label>
              <Select value={form.goal} onValueChange={(v) => setForm((p) => ({ ...p, goal: v as Goal }))}>
                <SelectTrigger className="h-12 bg-input border-border text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Tone */}
          <div className="max-w-sm space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-label uppercase font-mono-alt">
              <MessageSquare className="h-3.5 w-3.5" /> Tone
            </label>
            <Select value={form.tone} onValueChange={(v) => setForm((p) => ({ ...p, tone: v as Tone }))}>
              <SelectTrigger className="h-12 bg-input border-border text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="storytelling">Storytelling</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="controversial">Controversial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic Seeds */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-label uppercase font-mono-alt">
                <Lightbulb className="h-3.5 w-3.5" /> Your Ideas / Topic Seeds
              </label>
              <span className="text-xs text-muted-foreground font-mono-alt tracking-wide">
                THE ENGINE BUILDS DIRECTLY FROM WHAT YOU WRITE HERE
              </span>
            </div>
            <Textarea
              value={form.topicSeeds}
              onChange={(e) => setForm((p) => ({ ...p, topicSeeds: e.target.value }))}
              placeholder="Dump your raw, unfiltered ideas here — the more specific, the more tailored your output.&#10;&#10;e.g. Why most agency owners stay broke even with good clients — they confuse revenue with profit. Client red flags before signing. How I landed my first clients with no portfolio."
              rows={5}
              className="bg-input border-border text-base resize-y"
            />
          </div>

          {/* Topic suggestion chips */}
          <div className="flex flex-wrap gap-2">
            {TOPIC_SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => addTopicSeed(s.label)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground active:scale-[0.97]"
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading || !form.niche.trim() || !form.targetAudience.trim()}
          size="lg"
          className="mt-8 w-full h-14 text-base font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Researching & Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Initiate Pattern Analysis <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
