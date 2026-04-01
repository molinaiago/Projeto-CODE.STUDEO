import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import inter from "../../data/trilha-intermediaria.json";
import { useProgress } from "../../context/ProgressContext.jsx";

/* util */
function findExerciseById(trilha, id){
  for (const m of trilha.modulos) for (const a of m.atividades) if (a.id===id) return { atividade:a, modulo:m, trilha };
  return null;
}

/* UI... */
function Feedback({ ok, msg }){ return (
  <div className={`mt-3 rounded-xl border px-4 py-3 text-sm ${ok?"border-emerald-500/30 bg-emerald-500/10 text-emerald-200":"border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>{msg}</div>
);}

function TheoryPanel({ teoria }) {
  if (!teoria) return null;
  const { titulo, texto, codigo, linguagem } = teoria;
  return (
    <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-indigo-200">{titulo || "Aprenda"}</h3>
        {linguagem && <span className="text-[11px] rounded-md px-2 py-0.5 border border-white/10 text-zinc-300">{linguagem}</span>}
      </div>
      {texto && <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{texto}</p>}
      {codigo && (
        <div className="mt-3 overflow-x-auto">
          <pre className="rounded-xl border border-white/10 bg-zinc-950 p-3 text-xs leading-relaxed"><code>{codigo}</code></pre>
        </div>
      )}
    </div>
  );
}

/* ---------- tipos básicos reusados (múltipla etc) – mesmo que na básica (pode colar/encurtar) ---------- */
function Multipla({ atividade, onSolved }) {
  const [sel,setSel]=useState(null);
  const ok=sel===atividade.corretaIndex;
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="grid gap-2">
        {atividade.alternativas.map((alt,i)=>(
          <label key={i} className={`flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 cursor-pointer ${sel===i?"bg-indigo-600/30":"bg-zinc-900/40"}`}>
            <input type="radio" name="alt" className="accent-indigo-500" checked={sel===i} onChange={()=>setSel(i)}/>
            <span>{alt}</span>
          </label>
        ))}
      </div>
      {sel!==null && <Feedback ok={ok} msg={ok?"Correto!":atividade.dica||"Tente novamente."}/>}
    </div>
  );
}

/* ---------- NOVO: CodeJSExercise ---------- */
/**
 * Espera no JSON algo como:
 * {
 *   "tipo": "code-js",
 *   "titulo": "Soma simples",
 *   "enunciado": "Implemente a função soma(a,b).",
 *   "assinatura": "function soma(a,b) { /* seu código *\/ }",
 *   "tests": [
 *      {"call":"soma(2,3)","expected":5},
 *      {"call":"soma(-1,1)","expected":0}
 *   ],
 *   "teoria": {... opcional ...}
 * }
 */
function CodeJSExercise({ atividade, onSolved }) {
  const [code,setCode]=useState(atividade.assinatura || "function f(){ /* ... */ }");
  const [result,setResult]=useState(null); // {ok, logs:[], fails:[]}

  const runTests=()=>{
    const logs=[];
    const fails=[];
    try{
      // sandbox simples
      const wrapped = `(function(){ ${code}; return {${atividade.exportName || "soma"}}; })()`;
      const mod = Function('"use strict"', `return ${wrapped}`)();
      const fnName = atividade.exportName || "soma";
      if(typeof mod[fnName] !== "function") {
        setResult({ok:false, logs, fails:[`Função ${fnName} não encontrada.`]}); 
        return;
      }
      for(const t of atividade.tests || []){
        // avalia chamada sem acesso ao escopo externo:
        const value = Function(fnName, `"use strict"; return ${t.call};`)(mod[fnName]);
        const ok = Object.is(value, t.expected);
        if(!ok) fails.push(`Esperado ${t.expected} para ${t.call}, obtido ${String(value)}`);
        else logs.push(`OK: ${t.call} → ${t.expected}`);
      }
      const ok = fails.length===0;
      setResult({ok, logs, fails});
      if(ok) onSolved?.();
    }catch(err){
      setResult({ok:false, logs, fails:[`Erro ao executar: ${err.message}`]});
    }
  };

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>

      <div className="grid gap-2">
        <label className="text-sm text-zinc-400">Edite seu código:</label>
        <textarea
          className="min-h-[160px] rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500/60"
          value={code}
          onChange={e=>setCode(e.target.value)}
        />
        <button onClick={runTests} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold">
          Executar testes
        </button>
      </div>

      {result && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${result.ok?"border-emerald-500/30 bg-emerald-500/10 text-emerald-200":"border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>
          <div className="font-semibold mb-1">{result.ok ? "Todos os testes passaram!" : "Alguns testes falharam"}</div>
          {result.logs?.length>0 && (
            <div className="mb-1">
              {result.logs.map((l,i)=><div key={i}>• {l}</div>)}
            </div>
          )}
          {result.fails?.length>0 && (
            <div>
              {result.fails.map((f,i)=><div key={i}>• {f}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Página ---------- */
export default function ExercicioIntermediaria(){
  const { id } = useParams();
  const { isActivityUnlocked, markExerciseDone } = useProgress();

  const data = findExerciseById(inter, id);
  if (!data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Exercício não encontrado</h1>
          <Link to="/trilha/intermediaria" className="mt-3 inline-block underline text-zinc-300">Voltar</Link>
        </div>
      </main>
    );
  }

  const { atividade, modulo } = data;
  const moduloIndex = inter.modulos.findIndex(m => m.moduloId===modulo.moduloId);
  const atividadeIndex = inter.modulos[moduloIndex].atividades.findIndex(a=>a.id===atividade.id);
  const canOpen = isActivityUnlocked("intermediaria", inter, moduloIndex, atividadeIndex);

  if (!canOpen) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold">Atividade bloqueada</h1>
          <p className="mt-2 text-zinc-300">Conclua a atividade anterior para acessar esta.</p>
          <Link to="/trilha/intermediaria" className="mt-4 inline-block underline text-zinc-300">← Voltar para a trilha</Link>
        </div>
      </main>
    );
  }

  const handleSolved = () => markExerciseDone("intermediaria", atividade.id);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <Link to="/trilha/intermediaria" className="text-sm text-zinc-300 underline">← Voltar para {modulo.titulo}</Link>
        <h1 className="mt-3 text-2xl font-extrabold">{atividade.titulo}</h1>
        <p className="mt-1 text-zinc-400 text-sm">Tipo: <span className="uppercase">{atividade.tipo}</span></p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
          {atividade.tipo === "multipla"      && <Multipla atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "code-js"       && <CodeJSExercise atividade={atividade} onSolved={handleSolved} />}
          {/* Caso queira reaproveitar outros tipos simples aqui também, pode adicionar. */}
        </div>
      </section>
    </main>
  );
}
