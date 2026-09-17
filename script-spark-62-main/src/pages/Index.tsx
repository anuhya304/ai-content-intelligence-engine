import { useState, useCallback } from "react";
import { Navbar, type View } from "@/components/Navbar";
import { LoginPage } from "@/components/LoginPage";
import { DiscoveryStep } from "@/components/DiscoveryStep";
import { AnalysisStep } from "@/components/AnalysisStep";
import { SynthesisStep } from "@/components/SynthesisStep";
import { SavedContent } from "@/components/SavedContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type {
  DiscoveryInput,
  GeneratedScript,
  GeneratedHook,
  GeneratedCTA,
} from "@/types/content-engine";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<View>("engine");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [discovery, setDiscovery] = useState<DiscoveryInput | null>(null);
  const [scripts, setScripts] = useState<GeneratedScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<GeneratedScript | null>(null);
  const [hooks, setHooks] = useState<GeneratedHook[]>([]);
  const [ctas, setCtas] = useState<GeneratedCTA[]>([]);
  const [researchData, setResearchData] = useState("");

  const handleDiscoverySubmit = useCallback(async (data: DiscoveryInput) => {
    setDiscovery(data);
    setIsLoading(true);

    try {
      // Step 1: Research via Firecrawl
      let research = "";
      try {
        const searchQuery = `${data.niche} ${data.targetAudience} ${data.platform} trending content tips 2024 2025`;
        const { data: searchResult, error: searchError } = await supabase.functions.invoke("firecrawl-search", {
          body: { query: searchQuery, options: { limit: 3 } },
        });

        if (!searchError && searchResult?.data) {
          research = searchResult.data
            .map((r: any) => `${r.title || ""}: ${r.markdown?.slice(0, 500) || r.description || ""}`)
            .join("\n\n");
        }
      } catch (err) {
        console.warn("Research failed, proceeding without:", err);
      }
      setResearchData(research);

      // Step 2: Generate scripts
      const { data: scriptData, error: scriptError } = await supabase.functions.invoke("generate-scripts", {
        body: { ...data, researchData: research },
      });

      if (scriptError) throw new Error(scriptError.message);
      if (scriptData?.error) throw new Error(scriptData.error);

      const generatedScripts: GeneratedScript[] = scriptData.scripts.map((s: any, i: number) => ({
        id: `script-${i}-${Date.now()}`,
        ...s,
      }));

      setScripts(generatedScripts);
      setCompletedSteps((prev) => [...new Set([...prev, 1])]);
      setStep(2);
    } catch (err: any) {
      console.error("Discovery error:", err);
      toast.error(err.message || "Failed to generate scripts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectScript = useCallback(async (script: GeneratedScript) => {
    setSelectedScript(script);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-hooks-ctas", {
        body: {
          script,
          platform: discovery?.platform,
          targetAudience: discovery?.targetAudience,
          niche: discovery?.niche,
          tone: discovery?.tone,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setHooks(data.hooks.map((h: any, i: number) => ({ id: `hook-${i}-${Date.now()}`, ...h })));
      setCtas(data.ctas.map((c: any, i: number) => ({ id: `cta-${i}-${Date.now()}`, ...c })));
      setCompletedSteps((prev) => [...new Set([...prev, 2])]);
      setStep(3);
    } catch (err: any) {
      console.error("Hooks/CTAs error:", err);
      toast.error(err.message || "Failed to generate hooks & CTAs.");
    } finally {
      setIsLoading(false);
    }
  }, [discovery]);

  const handleRegenerateScripts = useCallback(() => {
    if (discovery) handleDiscoverySubmit(discovery);
  }, [discovery, handleDiscoverySubmit]);

  const handleRegenerateHooksCtas = useCallback(() => {
    if (selectedScript) handleSelectScript(selectedScript);
  }, [selectedScript, handleSelectScript]);

  const handleStartOver = () => {
    setStep(1);
    setCompletedSteps([]);
    setScripts([]);
    setSelectedScript(null);
    setHooks([]);
    setCtas([]);
    setResearchData("");
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const saveContext = discovery
    ? { niche: discovery.niche, platform: discovery.platform }
    : undefined;

  const handleStepClick = (s: 1 | 2 | 3) => {
    setView("engine");
    setStep(s);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        view={view}
        onViewChange={setView}
        currentStep={step}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        {view === "saved" ? (
          <SavedContent />
        ) : (
          <>
            {step === 1 && (
              <DiscoveryStep
                onSubmit={handleDiscoverySubmit}
                isLoading={isLoading}
                initialData={discovery || undefined}
              />
            )}
            {step === 2 && (
              <AnalysisStep
                scripts={scripts}
                onSelectScript={handleSelectScript}
                onBack={() => setStep(1)}
                onRegenerate={handleRegenerateScripts}
                isLoading={isLoading}
                saveContext={saveContext}
              />
            )}
            {step === 3 && selectedScript && (
              <SynthesisStep
                script={selectedScript}
                hooks={hooks}
                ctas={ctas}
                onBack={() => setStep(2)}
                onRegenerate={handleRegenerateHooksCtas}
                onStartOver={handleStartOver}
                isLoading={isLoading}
                saveContext={saveContext}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
