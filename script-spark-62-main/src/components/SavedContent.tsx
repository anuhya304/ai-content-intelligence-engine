import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSavedScripts, type SavedScript } from "@/hooks/use-saved-scripts";
import { cn } from "@/lib/utils";
import { Bookmark, Copy, Check, Trash2, Zap, MessageCircle, FileText, Inbox } from "lucide-react";
import { toast } from "sonner";

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

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SavedContent() {
  const { items, remove } = useSavedScripts();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleRemove = (item: SavedScript) => {
    remove(item.script.id);
    toast.success("Removed from saved");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ lineHeight: "1.1" }}>
            SAVED CONTENT
          </h1>
          <p className="mt-3 text-muted-foreground">
            {items.length === 0
              ? "Scripts you save will appear here."
              : `${items.length} saved script${items.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <span className="flex items-center gap-2 text-xs text-muted-foreground font-mono-alt tracking-wide">
          <Bookmark className="h-3.5 w-3.5 text-primary" /> LIBRARY
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-lg font-semibold">Nothing saved yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Generate scripts in Discovery, then click the bookmark icon on any script to keep it here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item, i) => {
            const expanded = expandedId === item.script.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold truncate">{item.script.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="text-primary font-mono-alt tracking-wide">{item.script.framework}</span>
                        <span className="text-muted-foreground">{formatDate(item.savedAt)}</span>
                        {item.context?.niche && (
                          <span className="text-muted-foreground">· {item.context.niche}</span>
                        )}
                        {item.context?.platform && (
                          <span className="text-muted-foreground">· {item.context.platform}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    className="shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <ul className="mt-4 ml-11 space-y-1.5">
                  {item.script.outline.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/50 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 ml-11 flex items-center gap-3">
                  <button
                    onClick={() => setExpandedId(expanded ? null : item.script.id)}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <FileText className="h-3 w-3" />
                    {expanded ? "Hide details" : "View details"}
                  </button>
                  <button
                    onClick={() => copy(item.script.fullScript, `script-${item.id}`)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedId === `script-${item.id}` ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy script
                  </button>
                </div>

                {expanded && (
                  <div className="mt-4 ml-11 space-y-5 animate-in fade-in duration-300">
                    <div className="rounded-lg bg-muted/50 p-4 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {item.script.fullScript}
                    </div>

                    {item.hooks && item.hooks.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold">
                          <Zap className="h-4 w-4 text-primary" /> Hooks
                        </h4>
                        <div className="mt-2 space-y-2">
                          {item.hooks.map((hook) => (
                            <div
                              key={hook.id}
                              className="group flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3"
                            >
                              <span
                                className={cn(
                                  "shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider",
                                  hookTypeColors[hook.type] || "bg-muted text-muted-foreground",
                                )}
                              >
                                {hook.type.replace("-", " ")}
                              </span>
                              <p className="flex-1 text-sm leading-relaxed">{hook.text}</p>
                              <button
                                onClick={() => copy(hook.text, `hook-${hook.id}`)}
                                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                              >
                                {copiedId === `hook-${hook.id}` ? (
                                  <Check className="h-4 w-4 text-primary" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.ctas && item.ctas.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold">
                          <MessageCircle className="h-4 w-4 text-primary" /> CTAs
                        </h4>
                        <div className="mt-2 space-y-2">
                          {item.ctas.map((cta) => (
                            <div
                              key={cta.id}
                              className="group flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3"
                            >
                              <span
                                className={cn(
                                  "shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider",
                                  ctaTypeColors[cta.type] || "bg-muted text-muted-foreground",
                                )}
                              >
                                {cta.type.replace("-", " ")}
                              </span>
                              <p className="flex-1 text-sm leading-relaxed">{cta.text}</p>
                              <button
                                onClick={() => copy(cta.text, `cta-${cta.id}`)}
                                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                              >
                                {copiedId === `cta-${cta.id}` ? (
                                  <Check className="h-4 w-4 text-primary" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
