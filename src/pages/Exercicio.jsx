import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import basica from "../data/trilha-basica.json";
import intermediaria from "../data/trilha-intermediaria.json";
import avancada from "../data/trilha-avancada.json";
import { useProgress } from "../context/ProgressContext.jsx";
import CodeJSExercise from "../components/CodeJSExercise.jsx";

const TRILHAS_MAP = {
  basica,
  intermediaria,
  avancada,
};

function findExerciseById(trilha, id) {
  if (!trilha || !Array.isArray(trilha.modulos)) return null;
  for (const m of trilha.modulos) {
    if (Array.isArray(m.atividades)) {
      for (const a of m.atividades) {
        if (a.id === id) return { atividade: a, modulo: m, trilha };
      }
    }
  }
  return null;
}

function Feedback({ ok, msg }) {
  return (
    <div
      className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
        ok
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : "border-amber-500/30 bg-amber-500/10 text-amber-200"
      }`}
    >
      {msg}
    </div>
  );
}

function TheoryPanel({ teoria }) {
  if (!teoria) return null;
  const { titulo, texto, codigo, linguagem } = teoria;
  return (
    <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-indigo-200">{titulo || "Aprenda"}</h3>
        {linguagem && (<span className="text-[11px] rounded-md px-2 py-0.5 border border-white/10 text-zinc-300">{linguagem}</span>)}
      </div>
      {texto && (<p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{texto}</p>)}
      {codigo && (
        <div className="mt-3 overflow-x-auto">
          <pre className="rounded-xl border border-white/10 bg-zinc-950 p-3 text-xs leading-relaxed">
            <code>{codigo}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/* ---------------- Tipos de atividade ---------------- */

function Multipla({ atividade, onSolved }) {
  const [sel, setSel] = useState(null);
  const ok = sel === atividade.corretaIndex;
  useEffect(() => { if (ok) onSolved?.(); }, [ok, onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="grid gap-2">
        {atividade.alternativas.map((alt, i) => (
          <label key={i} className={`flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 cursor-pointer ${ sel === i ? "bg-indigo-600/30" : "bg-zinc-900/40" }`}>
            <input type="radio" name={atividade.id} className="accent-indigo-500" checked={sel === i} onChange={() => setSel(i)} />
            <span>{alt}</span>
          </label>
        ))}
      </div>
      {sel !== null && <Feedback ok={ok} msg={ok ? "Correto!" : atividade.dica || "Tente novamente."} />}
    </div>
  );
}

function TabelaVerdade({ atividade, onSolved }) {
  useEffect(() => { onSolved?.(); }, [onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="overflow-x-auto">
        <table className="min-w-[420px] text-sm">
          <thead><tr className="text-left text-zinc-400"><th className="py-2 pr-4">A</th><th className="py-2 pr-4">B</th><th className="py-2 pr-4">Resultado (A E B)</th></tr></thead>
          <tbody>
            {atividade.linhas.map((ln, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="py-2 pr-4">{String(ln.A)}</td><td className="py-2 pr-4">{String(ln.B)}</td><td className="py-2 pr-4 font-semibold">{String(ln.esperado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-zinc-400">{atividade.dica || "Lembre: E só é verdadeiro se ambos forem verdadeiros."}</div>
    </div>
  );
}

function shuffleArray(a){const arr=[...a];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function arraysEqual(a,b){if(a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true;}

function Ordem({ atividade, onSolved }) {
  const expected=atividade.ordemCorreta.map((i)=>atividade.itens[i]);
  const inicial=useMemo(()=>{for(let t=0;t<6;t++){const s=shuffleArray(atividade.itens);if(!arraysEqual(s,expected))return s;}return shuffleArray(atividade.itens);},[atividade.itens, expected]);
  const[itens,setItens]=useState(inicial);
  const mover=(idx,dir)=>{const j=idx+dir;if(j<0||j>=itens.length)return;const n=[...itens];[n[idx],n[j]]=[n[j],n[idx]];setItens(n);};
  const ok=arraysEqual(itens,expected);
  useEffect(()=>{if(ok)onSolved?.();},[ok,onSolved]);
  return(
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/><p className="text-zinc-300">{atividade.enunciado}</p>
      <ul className="space-y-2">
        {itens.map((it,idx)=>(<li key={idx} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-2 border border-white/10"><span>{it}</span><div className="flex gap-1"><button onClick={()=>mover(idx,-1)} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">↑</button><button onClick={()=>mover(idx,+1)} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">↓</button></div></li>))}
      </ul>
      <Feedback ok={ok} msg={ok?"Ordem correta!":atividade.dica||"Ajuste a ordem."}/>
    </div>
  );
}

function VerdadeiroFalsoExplicado({ atividade, onSolved }) {
  const [resposta, setResposta] = useState(null);
  const ok = resposta === atividade.esperado;
  useEffect(() => { if (ok) onSolved?.(); }, [ok, onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="flex gap-3">
        <button onClick={() => setResposta(true)} className={`px-4 py-2 rounded-lg ${resposta === true ? "bg-indigo-600" : "bg-zinc-800"}`}>Verdadeiro</button>
        <button onClick={() => setResposta(false)} className={`px-4 py-2 rounded-lg ${resposta === false ? "bg-indigo-600" : "bg-zinc-800"}`}>Falso</button>
      </div>
      {resposta !== null && <Feedback ok={ok} msg={ok ? "Correto!" : atividade.dica || "Resposta incorreta."} />}
    </div>
  );
}

function NumeroTransform({ atividade, onSolved }) {
  const [valor, setValor] = useState("");
  const n = Number(String(valor).replace(",","."));
  const valido = !isNaN(n);
  const ok = valido;
  useEffect(() => { if (ok && valor !== "") onSolved?.(); }, [ok, valor, onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <input type="text" value={valor} onChange={e => setValor(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3" />
      {valido && valor !== "" && <Feedback ok={ok} msg={`Resultado: ${n + 5}`} />}
    </div>
  );
}

function FormValidado({ atividade, onSolved }) {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const ok = nome.trim().length > 1 && /^\d{4}$/.test(ano);
  useEffect(() => { if (ok) onSolved?.(); }, [ok, onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3" />
      <input type="text" placeholder="Ano (4 dígitos)" value={ano} onChange={e => setAno(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3" />
      {ok && <Feedback ok={ok} msg="Campos preenchidos corretamente." />}
    </div>
  );
}

function VFVariavelX({ atividade, onSolved }) {
  const [resposta, setResposta] = useState(null);
  const ok = resposta === atividade.esperado;
  useEffect(() => { if (ok) onSolved?.(); }, [ok, onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="flex gap-3">
        <button onClick={() => setResposta(true)} className={`px-4 py-2 rounded-lg ${resposta === true ? "bg-indigo-600" : "bg-zinc-800"}`}>Verdadeiro</button>
        <button onClick={() => setResposta(false)} className={`px-4 py-2 rounded-lg ${resposta === false ? "bg-indigo-600" : "bg-zinc-800"}`}>Falso</button>
      </div>
      {resposta !== null && <Feedback ok={ok} msg={ok ? "Correto!" : atividade.dica || "Incorreto."} />}
    </div>
  );
}

function DragIf({ atividade, onSolved }) {
  return <Ordem atividade={atividade} onSolved={onSolved} />
}

function SimuladorLoop({ atividade, onSolved }) {
  useEffect(() => { onSolved?.(); }, [onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <Feedback ok={true} msg="Exercício de leitura concluído." />
    </div>
  );
}

function NumeroLista({ atividade, onSolved }) {
  const [valor, setValor] = useState("");
  const arr = valor.split(/[,\s]+/).map(v=>Number(v)).filter(v=>!isNaN(v));
  const ok = arraysEqual(arr, atividade.esperado);
  useEffect(() => { if (ok) onSolved?.(); }, [ok, onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <input type="text" value={valor} onChange={e => setValor(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3" />
      {valor.trim() !== "" && <Feedback ok={ok} msg={ok ? "Correto!" : atividade.dica || "Sequência incorreta."} />}
    </div>
  );
}

/* ---------------- Página ---------------- */
export default function Exercicio() {
  const { id, slug } = useParams();
  const { isActivityUnlocked, markExerciseDone, isExerciseDone } = useProgress();

  const trilhaSlug = slug || "basica";
  const trilhaSelecionada = TRILHAS_MAP[trilhaSlug];

  if (!trilhaSelecionada || !Array.isArray(trilhaSelecionada.modulos)) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Trilha Inválida</h1>
          <p className="text-zinc-300 mt-2">O conteúdo para esta trilha não foi encontrado ou está mal formatado.</p>
          <Link to="/trilhas" className="mt-4 inline-block underline">Voltar para Trilhas</Link>
        </div>
      </main>
    );
  }

  const data = findExerciseById(trilhaSelecionada, id);

  if (!data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Exercício não encontrado</h1>
          <Link to={`/trilha/${trilhaSlug}`} className="mt-3 inline-block underline">Voltar para a trilha</Link>
        </div>
      </main>
    );
  }

  const { atividade, modulo } = data;
  
  const moduloIndex = trilhaSelecionada.modulos.findIndex((m) => m.moduloId === modulo.moduloId);
  const atividadeIndex = (modulo.atividades || []).findIndex((a) => a.id === atividade.id);

  const canOpen = isActivityUnlocked(trilhaSlug, trilhaSelecionada, moduloIndex, atividadeIndex);

  const proximaAtividadeUrl = useMemo(() => {
    const modulos = trilhaSelecionada.modulos;
    const atividadesAtuais = modulos[moduloIndex]?.atividades || [];
    if (atividadeIndex < atividadesAtuais.length - 1) {
      const proxima = atividadesAtuais[atividadeIndex + 1];
      return `/trilha/${trilhaSlug}/exercicio/${proxima.id}`;
    }
    if (moduloIndex < modulos.length - 1) {
      const proximoModulo = modulos[moduloIndex + 1];
      if (proximoModulo?.atividades?.length > 0) {
        const proxima = proximoModulo.atividades[0];
        return `/trilha/${trilhaSlug}/exercicio/${proxima.id}`;
      }
    }
    return `/trilha/${trilhaSlug}`;
  }, [trilhaSlug, trilhaSelecionada, moduloIndex, atividadeIndex]);

  const isFinalDaTrilha = proximaAtividadeUrl === `/trilha/${trilhaSlug}`;

  if (!canOpen && !isExerciseDone(trilhaSlug, atividade.id)) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold">Atividade Bloqueada</h1>
          <p className="mt-2 text-zinc-300">Você precisa concluir a atividade anterior para acessar esta.</p>
          <Link to={`/trilha/${trilhaSlug}`} className="mt-4 inline-block underline">← Voltar para a trilha</Link>
        </div>
      </main>
    );
  }

  const handleSolved = () => markExerciseDone(trilhaSlug, atividade.id);
  const isDone = isExerciseDone(trilhaSlug, atividade.id);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <Link to={`/trilha/${trilhaSlug}`} className="text-sm text-zinc-300 underline">
          ← Voltar para {modulo.titulo}
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold">{atividade.titulo}</h1>
        <p className="mt-1 text-zinc-400 text-sm">Tipo: <span className="uppercase">{atividade.tipo}</span></p>

        {atividade.leitura && (
          <div className="my-6">
            <Link 
              to={`/trilha/${trilhaSlug}/exercicio/${atividade.id}/leitura`}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M5.5 16.5a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5h5.25a1.5 1.5 0 011.5 1.5v2.25a.75.75 0 001.5 0V5.25a3 3 0 00-3-3H5.5a3 3 0 00-3 3v9.75a3 3 0 003 3H9A.75.75 0 009 15H5.5z"/><path d="M12.5 4.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5zM12.5 7.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM12.5 10.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"/></svg>
              Para Estudar
            </Link>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
          {atividade.tipo === "multipla" && <Multipla atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "tabela-verdade" && <TabelaVerdade atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "ordem" && <Ordem atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "verdadeiro-falso-explicado" && <VerdadeiroFalsoExplicado atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "numero-transform" && <NumeroTransform atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "form-validado" && <FormValidado atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "vf-variavel-x" && <VFVariavelX atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "drag-if" && <DragIf atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "simulador-loop" && <SimuladorLoop atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "numero-lista" && <NumeroLista atividade={atividade} onSolved={handleSolved} />}
          {atividade.tipo === "code-js" && <CodeJSExercise atividade={atividade} onSolved={handleSolved} />}
        </div>

        {isDone && (
          <div className="mt-6 flex justify-end">
            <Link
              to={proximaAtividadeUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition"
            >
              {isFinalDaTrilha ? 'Finalizar Trilha' : 'Próxima Atividade'}
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}