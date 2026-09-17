import { Button } from "@/components/ui/button";
import type { GeneratedScript, GeneratedHook, GeneratedCTA } from "@/types/content-engine";
import { cn } from "@/lib/utils";
import { ArrowLeft, Copy, Check, Zap, MessageCircle, RefreshCw, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSavedScripts } from "@/hooks/use-saved-scripts";

interface SynthesisStepProps {
  script: GeneratedScript;
  hooks: GeneratedHook[];
  ctas: GeneratedCTA[];
  onBack: () => void;
  onRegenerate: () => void;
  onStartOver: () => void;
  isLoading: boolean;
  saveContext?: { niche?: string; platform?: string };
}

const hookTypeColors: Record<string, string> = {
  question: "bg-blue-500/15 text-blue-400",
  statistic: "bg-amber-500/15 text-amber-400",
  story: "bg-emerald-500/15 text-emerald-400",
  "bold-claim": "bg-rose-500/15 text-rose-400",
  "pain-point": "bg-orange-500/15 text-orange-400",
};

const ctaTypeColors: Record<string, string> = {
  direct: "bg-primary/15 text-primary",
  soft: "bg-sky-500/15 text-sky-400",
  urgency: "bg-red-500/15 text-red-400",
  "value-driven": "bg-emerald-500/15 text-emerald-400",
};

export function SynthesisStep({ script, hooks, ctas, onBack, onRegenerate, onStartOver, isLoading, saveContext }: SynthesisStepProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isSaved, save, remove } = useSavedScripts();
  const saved = isSaved(script.id);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSave = () => {
    if (saved) {
      remove(script.id);
      toast.success("Removed from saved");
    } else {
      save({ script, hooks, ctas, context: saveContext });
      toast.success("Saved with hooks & CTAs");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ lineHeight: "1.1" }}>
            SYNTHESIS
          </h1>
          <p className="mt-3 text-muted-foreground">
            Hooks and CTAs generated for: <span className="text-foreground font-medium">{script.title}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={saved ? "default" : "outline"}
            size="sm"
            onClick={handleToggleSave}
            className="gap-2"
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isLoading} className="gap-2">
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Inspiration Imagery */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <figure className="group relative overflow-hidden rounded-xl border border-border bg-card">
          <img
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80"
            alt="Creator filming content with smartphone and ring light"
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3 text-xs text-foreground/90">
            Capture attention in the first 3 seconds
          </figcaption>
        </figure>
        <figure className="group relative overflow-hidden rounded-xl border border-border bg-card">
          <img
            src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=80"
            alt="Audience engagement and social media analytics"
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3 text-xs text-foreground/90">
            Convert viewers with a sharp CTA
          </figcaption>
        </figure>
      </div>

      {/* Hooks */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Zap className="h-5 w-5 text-primary" /> Hooks
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Attention-grabbing openers for your script</p>

        <div className="mt-4 space-y-3">
          {hooks.map((hook, i) => (
            <div
              key={hook.id}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={cn("shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider", hookTypeColors[hook.type] || "bg-muted text-muted-foreground")}>
                {hook.type.replace("-", " ")}
              </span>
              <p className="flex-1 text-sm leading-relaxed">{hook.text}</p>
              <button
                onClick={() => copyToClipboard(hook.text, hook.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
              >
                {copiedId === hook.id ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <MessageCircle className="h-5 w-5 text-primary" /> CTAs
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Calls-to-action to close your content</p>

        <div className="mt-4 space-y-3">
          {ctas.map((cta, i) => (
            <div
              key={cta.id}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={cn("shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider", ctaTypeColors[cta.type] || "bg-muted text-muted-foreground")}>
                {cta.type.replace("-", " ")}
              </span>
              <p className="flex-1 text-sm leading-relaxed">{cta.text}</p>
              <button
                onClick={() => copyToClipboard(cta.text, cta.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
              >
                {copiedId === cta.id ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Full Script Reference */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Full Script</h2>
        <div className="mt-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-primary font-mono-alt tracking-wide">{script.framework}</span>
            <button
              onClick={() => copyToClipboard(script.fullScript, "full-script")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedId === "full-script" ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              Copy script
            </button>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{script.fullScript}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onStartOver}
          className="flex-1 h-12 text-base font-semibold tracking-wider uppercase rounded-xl active:scale-[0.98] gap-2"
        >
          Start New Session
        </Button>
      </div>
    </div>
  );
}
