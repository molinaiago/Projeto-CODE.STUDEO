import { useCallback, useEffect, useMemo, useState } from "react";
import CodeEditorBasic from "./CodeEditorBasic.jsx";
import { runJsInWorker } from "../utils/runJsInWorker.js";

function addLineNumbers(text) {
  const lines = String(text ?? "").split("\n");
  const pad = String(lines.length).length;
  return lines.map((ln, i) => `${String(i + 1).padStart(pad, " ")} | ${ln}`).join("\n");
}

export default function CodeJSExercise({ atividade, onSolved }) {
  const [code, setCode] = useState(atividade.starter || "");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);

  // sanitiza no componente também (ajuda UX e pré-validação)
  const sanitizedCode = useMemo(() => {
    return String(code ?? "")
      .replace(/\uFEFF/g, "")
      .replace(/\r\n?/g, "\n")
      .replace(/\u00A0/g, " ")
      .replace(/[\u200B-\u200D\u2060]/g, "")
      .replace(/\u2028|\u2029/g, "\n")
      .replace(/```[a-z]*\s*/gi, "")
      .replace(/```/g, "")
      .trim();
  }, [code]);

  // pré-validação: a função existe no texto?
  const preflightError = useMemo(() => {
    const fn = atividade.functionName;
    if (!fn) return "Atividade sem 'functionName' configurada.";
    const re = new RegExp(
      `\\b(function\\s+${fn}\\s*\\(|(?:const|let|var)\\s+${fn}\\s*=|\\b${fn}\\s*=\\s*\\()`
    );
    if (!re.test(sanitizedCode)) {
      return `Defina a função ${fn} corretamente (ex.: "function ${fn}(...) { ... }").`;
    }
    return null;
  }, [sanitizedCode, atividade.functionName]);

  const run = useCallback(async () => {
    setReport(null);
    setRunning(true);
    try {
      const res = await runJsInWorker({
        code: sanitizedCode,
        functionName: atividade.functionName,
        tests: atividade.tests || [],
        hiddenTests: atividade.hiddenTests || [],
        timeoutMs: atividade.timeoutMs || 1500,
      });
      setReport(res);
      if (res.ok) onSolved?.();
    } catch (err) {
      setReport({
        ok: false,
        buildError: err?.message || String(err),
        results: [],
        debug: { factorySrcPreview: null }
      });
    } finally {
      setRunning(false);
    }
  }, [sanitizedCode, atividade, onSolved]);

  // Ctrl/Cmd + Enter executa
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!running) run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, running]);

  return (
    <div className="space-y-4">
      {atividade.teoria && (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-indigo-200">
              {atividade.teoria.titulo || "Aprenda"}
            </h3>
            <span className="text-[11px] rounded-md px-2 py-0.5 border border-white/10 text-zinc-300">JavaScript</span>
          </div>
          {atividade.teoria.texto && (
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line mt-1">
              {atividade.teoria.texto}
            </p>
          )}
          {atividade.teoria.codigo && (
            <pre className="mt-3 rounded-xl border border-white/10 bg-zinc-950 p-3 text-xs overflow-x-auto">
              <code>{atividade.teoria.codigo}</code>
            </pre>
          )}
        </div>
      )}

      <p className="text-zinc-300">{atividade.enunciado}</p>

      <div className="grid gap-2">
        <div className="text-xs text-zinc-400">
          Implemente: <b>{atividade.functionName}(...)</b>
          <span className="ml-3 opacity-70">(Ctrl/⌘ + Enter executa)</span>
        </div>
        <CodeEditorBasic value={code} onChange={setCode} height={260} />
      </div>

      <button
        onClick={run}
        disabled={running || !!preflightError}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
      >
        {running ? "Executando..." : "Executar testes"}
      </button>

      {preflightError && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">
          {preflightError}
        </div>
      )}

      {report && (
        <div className={`mt-2 rounded-xl border px-4 py-3 text-sm ${
          report.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-200"
        }`}>
          <div className="font-semibold mb-2">
            {report.ok ? "Todos os testes passaram! ✅" : "Alguns testes falharam"}
          </div>

          {report.buildError && (
            <div className="mb-2">Erro ao executar: <b>{report.buildError}</b></div>
          )}

          {/* Debug detalhado */}
          {!report.ok && report.buildError && (
            <div className="mt-2 space-y-3">
              <details open className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                <summary className="cursor-pointer text-xs text-zinc-300">Código do aluno (com numeração)</summary>
                <pre className="mt-2 rounded-lg border border-white/10 bg-zinc-950 p-3 text-[11px] overflow-x-auto">
                  <code>{addLineNumbers(sanitizedCode)}</code>
                </pre>
              </details>
              {report.debug?.factorySrcPreview && (
                <details className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                  <summary className="cursor-pointer text-xs text-zinc-300">Fonte gerada para execução</summary>
                  <pre className="mt-2 rounded-lg border border-white/10 bg-zinc-950 p-3 text-[11px] overflow-x-auto">
                    <code>{report.debug.factorySrcPreview}</code>
                  </pre>
                </details>
              )}
            </div>
          )}

          {Array.isArray(report.results) && report.results.length > 0 && (
            <ul className="space-y-2 mt-3">
              {report.results.map((r, i) => (
                <li key={i} className="rounded-lg border border-white/10 bg-zinc-900/40 p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      {r.type === "hidden" ? "Oculto" : "Público"}
                    </div>
                    <div className={`text-xs ${r.pass ? "text-emerald-300" : "text-rose-300"}`}>
                      {r.pass ? "OK" : "Falhou"}
                    </div>
                  </div>
                  {"args" in r && (
                    <div className="text-xs mt-1 text-zinc-300">
                      args: <code>{JSON.stringify(r.args)}</code>
                    </div>
                  )}
                  {"got" in r && (
                    <div className="text-xs text-zinc-300">
                      retorno: <code>{JSON.stringify(r.got)}</code>
                    </div>
                  )}
                  {"expect" in r && (
                    <div className="text-xs text-zinc-300">
                      esperado: <code>{JSON.stringify(r.expect)}</code>
                    </div>
                  )}
                  {r.reason && <div className="text-xs text-amber-300 mt-1">{r.reason}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
