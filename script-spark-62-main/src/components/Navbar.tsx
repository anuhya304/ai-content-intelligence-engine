import { StepIndicator } from "./StepIndicator";
import { Cpu, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavedScripts } from "@/hooks/use-saved-scripts";

export type View = "engine" | "saved";

interface NavbarProps {
  view: View;
  onViewChange: (view: View) => void;
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
  completedSteps: number[];
}

export function Navbar({ view, onViewChange, currentStep, onStepClick, completedSteps }: NavbarProps) {
  const { items } = useSavedScripts();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewChange("engine")}
            className="flex items-center gap-2"
          >
            <span className="font-display text-lg font-bold tracking-tight">CIE</span>
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary font-mono-alt">
              V2.0
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            <button
              onClick={() => onViewChange("engine")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
                view === "engine"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              ENGINE
            </button>
            <button
              onClick={() => onViewChange("saved")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
                view === "saved"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Bookmark className="h-3.5 w-3.5" />
              SAVED
              {items.length > 0 && (
                <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">
                  {items.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {view === "engine" ? (
          <StepIndicator currentStep={currentStep} onStepClick={onStepClick} completedSteps={completedSteps} />
        ) : (
          <div className="flex-1" />
        )}

        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
          <Cpu className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono-alt tracking-wide">ENGINE ACTIVE</span>
        </div>
      </div>
    </header>
  );
}
