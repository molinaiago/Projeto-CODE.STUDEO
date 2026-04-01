// src/pages/TrilhaDetalhe.jsx
import { Link, useParams } from "react-router-dom";
import basica from "../data/trilha-basica.json";
import intermediaria from "../data/trilha-intermediaria.json";
import avancada from "../data/trilha-avancada.json";
import { useProgress } from "../context/ProgressContext.jsx";

function getTrilhaBySlug(slug) {
  switch (slug) {
    case "basica": return basica;
    case "intermediaria": return intermediaria;
    case "avancada": return avancada;
    default: return null;
  }
}

function StatusBadge({ status }) {
  // status: "done" | "unlocked" | "locked"
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-200">
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Concluída
      </span>
    );
  }
  if (status === "unlocked") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-200">
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path d="M7 10V7a5 5 0 0 1 9.9-1" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <rect x="4" y="10" width="16" height="10" rx="2" className="fill-current" opacity=".15"/>
          <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        </svg>
        Desbloqueada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600/40 bg-zinc-800/60 px-2 py-1 text-xs font-medium text-zinc-300">
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <rect x="4" y="10" width="16" height="10" rx="2" className="fill-current" opacity=".15"/>
        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      </svg>
      Bloqueada
    </span>
  );
}

export default function TrilhaDetalhe() {
  const { slug } = useParams();
  const trilha = getTrilhaBySlug(slug);
  const { isExerciseDone, isActivityUnlocked } = useProgress();

  // slug inválido
  if (!trilha) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Trilha não encontrada</h1>
          <Link to="/trilhas" className="mt-3 inline-block underline text-zinc-300">Voltar</Link>
        </div>
      </main>
    );
  }

  // estrutura inválida
  if (!Array.isArray(trilha.modulos)) {
    console.error("[Trilha inválida]", { slug, trilha });
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold">Formato da trilha inválido</h1>
          <p className="mt-2 text-zinc-300">
            A trilha “{trilha.titulo || slug}” não possui uma lista válida de módulos.
            Verifique se o JSON contém a chave <code>modulos</code> como um array.
          </p>
          <Link to="/trilhas" className="mt-4 inline-block underline text-zinc-300">← Voltar</Link>
        </div>
      </main>
    );
  }

  const trilhaSlug = trilha.slug || slug;

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 h-[42rem] w-[42rem] rounded-full bg-indigo-700/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[36rem] w-[36rem] rounded-full bg-violet-700/15 blur-[120px]" />
      </div>

      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-6">
          <Link to="/trilhas" className="text-sm text-zinc-300 underline">← Voltar</Link>
        </div>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{trilha.titulo}</h1>
          <p className="mt-2 text-zinc-300 leading-relaxed">{trilha.descricao}</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {trilha.modulos.map((m, mIdx) => {
            const total = Array.isArray(m.atividades) ? m.atividades.length : 0;
            const concluidas = (m.atividades || []).filter(a => isExerciseDone(trilhaSlug, a.id)).length;

            return (
              <article
                key={m.moduloId || mIdx}
                className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur shadow-lg"
              >
                <div className="flex items-start justify-between gap-4 p-6 pb-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      Módulo {mIdx + 1} de {trilha.modulos.length}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mt-1">{m.titulo}</h2>
                    {m.resumo && <p className="text-zinc-300 mt-1">{m.resumo}</p>}
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-indigo-200 text-sm">
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <path d="M4 6h16v12H4z" opacity=".25" fill="currentColor"/>
                      <path d="M8 9h8M8 12h6M8 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    {concluidas}/{total} Concluídas
                  </span>
                </div>

                {m.introducao && (
                  <div className="px-6">
                    <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
                      <div className="text-sm text-zinc-300 whitespace-pre-line">
                        {m.introducao}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 pt-4">
                  <div className="grid gap-3">
                    {(m.atividades || []).map((a, aIdx) => {
                      const done = isExerciseDone(trilhaSlug, a.id);
                      const unlocked = isActivityUnlocked(trilhaSlug, trilha, mIdx, aIdx);
                      const status = done ? "done" : (unlocked ? "unlocked" : "locked");

                      const base = "group flex items-center justify-between rounded-xl border px-4 py-3 transition";
                      const styleByStatus = {
                        done: "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15",
                        unlocked: "border-white/10 bg-zinc-950/40 hover:bg-white/10",
                        locked: "border-white/10 bg-zinc-900/40 opacity-60 cursor-not-allowed",
                      }[status];

                      const content = (
                        <>
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-lg grid place-items-center border ${
                                status === "done"
                                  ? "bg-emerald-500/20 border-emerald-500/40"
                                  : status === "unlocked"
                                  ? "bg-indigo-600/20 border-indigo-500/40"
                                  : "bg-zinc-800 border-white/10"
                              }`}
                            >
                              <span className={`text-xs font-semibold ${
                                status === "done" ? "text-emerald-200" :
                                status === "unlocked" ? "text-indigo-200" : "text-zinc-300"
                              }`}>
                                Ex {aIdx + 1}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{a.titulo}</div>
                              <div className="text-xs text-zinc-400 mt-0.5">Tipo: {a.tipo}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <StatusBadge status={status} />
                            {status !== "locked" ? (
                              <svg viewBox="0 0 24 24" className="h-4 w-4 text-zinc-300 group-hover:text-white">
                                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="h-4 w-4 text-zinc-400">
                                <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                                <rect x="4" y="10" width="16" height="10" rx="2" className="fill-current" opacity=".15"/>
                                <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                              </svg>
                            )}
                          </div>
                        </>
                      );

                      // 🚩 AQUI: linka para a rota por trilha
                      return (unlocked || done) ? (
                        <Link
                          key={a.id}
                          to={`/trilha/${trilhaSlug}/exercicio/${a.id}`}
                          className={`${base} ${styleByStatus}`}
                        >
                          {content}
                        </Link>
                      ) : (
                        <div
                          key={a.id}
                          className={`${base} ${styleByStatus}`}
                          title="Conclua a atividade anterior para desbloquear"
                          role="button"
                          aria-disabled="true"
                        >
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
