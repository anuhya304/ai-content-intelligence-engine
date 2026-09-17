import { useEffect, useState, useCallback } from "react";
import type { GeneratedScript, GeneratedHook, GeneratedCTA } from "@/types/content-engine";

const STORAGE_KEY = "cie:saved-scripts";

export interface SavedScript {
  id: string;
  savedAt: number;
  script: GeneratedScript;
  hooks?: GeneratedHook[];
  ctas?: GeneratedCTA[];
  context?: {
    niche?: string;
    platform?: string;
  };
}

function readStorage(): SavedScript[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedScript[];
  } catch {
    return [];
  }
}

function writeStorage(items: SavedScript[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cie:saved-scripts-updated"));
}

export function useSavedScripts() {
  const [items, setItems] = useState<SavedScript[]>(() => readStorage());

  useEffect(() => {
    const sync = () => setItems(readStorage());
    window.addEventListener("cie:saved-scripts-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cie:saved-scripts-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback(
    (scriptId: string) => items.some((i) => i.script.id === scriptId),
    [items],
  );

  const save = useCallback((entry: Omit<SavedScript, "savedAt" | "id"> & { id?: string }) => {
    const current = readStorage();
    if (current.some((i) => i.script.id === entry.script.id)) return;
    const next: SavedScript = {
      id: entry.id ?? `saved-${Date.now()}`,
      savedAt: Date.now(),
      script: entry.script,
      hooks: entry.hooks,
      ctas: entry.ctas,
      context: entry.context,
    };
    writeStorage([next, ...current]);
  }, []);

  const update = useCallback((scriptId: string, patch: Partial<Omit<SavedScript, "id" | "script">>) => {
    const current = readStorage();
    const next = current.map((i) => (i.script.id === scriptId ? { ...i, ...patch } : i));
    writeStorage(next);
  }, []);

  const remove = useCallback((scriptId: string) => {
    const current = readStorage();
    writeStorage(current.filter((i) => i.script.id !== scriptId));
  }, []);

  return { items, isSaved, save, update, remove };
}
