import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { GeneratedScript } from "@/types/content-engine";
import { cn } from "@/lib/utils";
import { Check, FileText, ArrowRight, ArrowLeft, RefreshCw, Bookmark, BookmarkCheck } from "lucide-react";
import { useSavedScripts } from "@/hooks/use-saved-scripts";
import { toast } from "sonner";

interface AnalysisStepProps {
  scripts: GeneratedScript[];
  onSelectScript: (script: GeneratedScript) => void;
  onBack: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  saveContext?: { niche?: string; platform?: string };
}

export function AnalysisStep({ scripts, onSelectScript, onBack, onRegenerate, isLoading, saveContext }: AnalysisStepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isSaved, save, remove } = useSavedScripts();

  const handleToggleSave = (e: React.MouseEvent, script: GeneratedScript) => {
    e.stopPropagation();
    if (isSaved(script.id)) {
      remove(script.id);
      toast.success("Removed from saved");
    } else {
      save({ script, context: saveContext });
      toast.success("Saved to library");
    }
  };

  const handleSelect = (script: GeneratedScript) => {
    setSelectedId(script.id);
  };

  const handleProceed = () => {
    const script = scripts.find((s) => s.id === selectedId);
    if (script) onSelectScript(script);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ lineHeight: "1.1" }}>
            ANALYSIS
          </h1>
          <p className="mt-3 text-muted-foreground">
            Select a script that resonates. We'll generate hooks & CTAs for it.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          Regenerate
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {scripts.map((script, i) => (
          <div
            key={script.id}
            className={cn(
              "group rounded-xl border bg-card p-5 transition-all duration-300 cursor-pointer",
              selectedId === script.id
                ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.12)]"
                : "border-border hover:border-primary/30",
            )}
            onClick={() => handleSelect(script)}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{script.title}</h3>
                    <span className="text-xs text-primary font-mono-alt tracking-wide">{script.framework}</span>
                  </div>
                </div>

                {/* Outline */}
                <ul className="mt-4 ml-11 space-y-1.5">
                  {script.outline.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/50 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Expanded full script */}
                {expandedId === script.id && (
                  <div className="mt-4 ml-11 rounded-lg bg-muted/50 p-4 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
                    {script.fullScript}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleToggleSave(e, script)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isSaved(script.id)
                      ? "text-primary hover:bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  aria-label={isSaved(script.id) ? "Remove from saved" : "Save script"}
                  title={isSaved(script.id) ? "Saved" : "Save script"}
                >
                  {isSaved(script.id) ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
                {selectedId === script.id && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedId(expandedId === script.id ? null : script.id);
              }}
              className="mt-3 ml-11 flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <FileText className="h-3 w-3" />
              {expandedId === script.id ? "Hide full script" : "View full script"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleProceed}
          disabled={!selectedId || isLoading}
          className="flex-1 h-12 text-base font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 active:scale-[0.98] gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Generating...
            </span>
          ) : (
            <>
              Generate Hooks & CTAs <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
