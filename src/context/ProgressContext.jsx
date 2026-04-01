import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProgressContext = createContext(null);
const KEY = "code-studeo:progress:v1";

export function ProgressProvider({ children }) {
  const [data, setData] = useState({}); // { [slug]: { done: { [atividadeId]: true } } }

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      setData(saved);
    } catch {
      setData({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const markExerciseDone = (slug, atividadeId) => {
    setData(prev => {
      const t = prev[slug] || { done: {} };
      if (t.done[atividadeId]) return prev;
      return { ...prev, [slug]: { ...t, done: { ...t.done, [atividadeId]: true } } };
    });
  };

  const isExerciseDone = (slug, atividadeId) => !!data?.[slug]?.done?.[atividadeId];

  const isModuleDone = (slug, modulo) =>
    (modulo.atividades || []).every(a => isExerciseDone(slug, a.id));

  const isModuleUnlocked = (slug, trilha, moduloIndex) => {
    if (moduloIndex === 0) return true;
    return isModuleDone(slug, trilha.modulos[moduloIndex - 1]);
  };

  const isActivityUnlocked = (slug, trilha, moduloIndex, atividadeIndex) => {
    if (!isModuleUnlocked(slug, trilha, moduloIndex)) return false;
    if (atividadeIndex === 0) return true;
    const anteriores = trilha.modulos[moduloIndex].atividades.slice(0, atividadeIndex);
    return anteriores.every(a => isExerciseDone(slug, a.id));
  };

  const value = useMemo(() => ({
    markExerciseDone,
    isExerciseDone,
    isModuleDone,
    isModuleUnlocked,
    isActivityUnlocked,
  }), [data]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress precisa estar dentro de ProgressProvider");
  return ctx;
}
