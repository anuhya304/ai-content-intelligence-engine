import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
  completedSteps: number[];
}

const steps = [
  { num: 1, label: "DISCOVERY" },
  { num: 2, label: "ANALYSIS" },
  { num: 3, label: "SYNTHESIS" },
] as const;

export function StepIndicator({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = currentStep === step.num;
        const isCompleted = completedSteps.includes(step.num);
        const isClickable = isCompleted || step.num <= Math.max(...completedSteps, currentStep);

        return (
          <div key={step.num} className="flex items-center gap-2">
            <button
              onClick={() => isClickable && onStepClick(step.num as 1 | 2 | 3)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                isClickable ? "cursor-pointer" : "cursor-not-allowed",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {step.num}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold tracking-widest transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 transition-colors duration-300",
                  isCompleted ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
