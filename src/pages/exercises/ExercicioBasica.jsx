import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import basica from "../../data/trilha-basica.json";
import { useProgress } from "../../context/ProgressContext.jsx";

/* ---------- util: Achar atividade ---------- */
function findExerciseById(trilha, id) {
  for (const m of trilha.modulos) {
    for (const a of m.atividades) {
      if (a.id === id) return { atividade: a, modulo: m, trilha };
    }
  }
  return null;
}

/* ---------- UI base ---------- */
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

/* ---------- Painel teórico ---------- */
function TheoryPanel({ teoria }) {
  if (!teoria) return null;
  const { titulo, texto, codigo, linguagem } = teoria;
  return (
    <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-indigo-200">
          {titulo || "Aprenda"}
        </h3>
        {linguagem && (
          <span className="text-[11px] rounded-md px-2 py-0.5 border border-white/10 text-zinc-300">
            {linguagem}
          </span>
        )}
      </div>
      {texto && (
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {texto}
        </p>
      )}
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

/* ---------- Tipos (básicos) ---------- */

/* MÚLTIPLA */
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
          <label
            key={i}
            className={`flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 cursor-pointer ${
              sel === i ? "bg-indigo-600/30" : "bg-zinc-900/40"
            }`}
          >
            <input
              type="radio"
              name="alt"
              className="accent-indigo-500"
              checked={sel === i}
              onChange={() => setSel(i)}
            />
            <span>{alt}</span>
          </label>
        ))}
      </div>
      {sel !== null && (
        <Feedback ok={ok} msg={ok ? "Correto!" : atividade.dica || "Tente novamente."} />
      )}
    </div>
  );
}

/* TABELA VERDADE (leitura = conclui ao abrir) */
function TabelaVerdade({ atividade, onSolved }) {
  useEffect(() => { onSolved?.(); }, [onSolved]);
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria} />
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="overflow-x-auto">
        <table className="min-w-[420px] text-sm">
          <thead>
            <tr className="text-left text-zinc-400">
              <th className="py-2 pr-4">A</th>
              <th className="py-2 pr-4">B</th>
              <th className="py-2 pr-4">Resultado (A E B)</th>
            </tr>
          </thead>
          <tbody>
            {atividade.linhas.map((ln, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="py-2 pr-4">{String(ln.A)}</td>
                <td className="py-2 pr-4">{String(ln.B)}</td>
                <td className="py-2 pr-4 font-semibold">{String(ln.esperado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-zinc-400">
        {atividade.dica || "E é verdadeiro apenas se ambos forem verdadeiros."}
      </div>
    </div>
  );
}

/* helpers */
function shuffleArray(a){const arr=[...a];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr;}
function arraysEqual(a,b){if(a.length!==b.length)return false;for(let i=0;i<a.length;i++) if(a[i]!==b[i]) return false;return true;}

/* ORDEM */
function Ordem({ atividade, onSolved }) {
  const expected = atividade.ordemCorreta.map((i)=>atividade.itens[i]);
  const inicial = useMemo(()=>{
    if(!atividade.itens?.length) return [];
    for(let t=0;t<6;t++){const s=shuffleArray(atividade.itens);if(!arraysEqual(s,expected))return s;}
    return shuffleArray(atividade.itens);
  },[atividade]);
  const [itens,setItens]=useState(inicial);
  const mover=(idx,dir)=>{const j=idx+dir;if(j<0||j>=itens.length)return;const novo=[...itens];[novo[idx],novo[j]]=[novo[j],novo[idx]];setItens(novo);}
  const ok=arraysEqual(itens,expected);
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <ul className="space-y-2">
        {itens.map((it,idx)=>(
          <li key={idx} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-2 border border-white/10">
            <span>{it}</span>
            <div className="flex gap-1">
              <button onClick={()=>mover(idx,-1)} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">↑</button>
              <button onClick={()=>mover(idx,+1)} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">↓</button>
            </div>
          </li>
        ))}
      </ul>
      <Feedback ok={ok} msg={ok ? "Ordem correta!": atividade.dica || "Ajuste a ordem."}/>
    </div>
  );
}

/* V/F explicado */
function VerdadeiroFalsoExplicado({ atividade, onSolved }) {
  const [resposta,setResposta]=useState(null);
  const { variaveis, expressao, esperado, explica }=atividade;
  const computed = useMemo(()=>{
    try{
      let expr=String(expressao);
      Object.entries(variaveis||{}).forEach(([k,v])=>{
        expr=expr.replaceAll(new RegExp(`\\b${k}\\b`,"g"), v?"true":"false");
      });
      const fn=Function(`"use strict";return (${expr});`);
      return !!fn();
    }catch{return null;}
  },[variaveis,expressao]);

  const ok = resposta!==null && resposta===esperado;
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="flex gap-3">
        <button onClick={()=>setResposta(true)}  className={`px-4 py-2 rounded-lg ${resposta===true?"bg-indigo-600 text-white":"bg-zinc-800 text-zinc-200"}`}>Verdadeiro</button>
        <button onClick={()=>setResposta(false)} className={`px-4 py-2 rounded-lg ${resposta===false?"bg-indigo-600 text-white":"bg-zinc-800 text-zinc-200"}`}>Falso</button>
      </div>

      {typeof computed==="boolean" && (
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3 text-sm text-zinc-300">
          <div className="font-semibold mb-1">Passo a passo</div>
          <ul className="list-disc pl-5 space-y-1">
            {Array.isArray(explica)&&explica.map((l,i)=><li key={i}>{l}</li>)}
          </ul>
          <div className="mt-1">Resultado = <b>{computed?"Verdadeiro":"Falso"}</b></div>
        </div>
      )}
      {resposta!==null && <Feedback ok={ok} msg={ok?"Correto!":"Incorreto. Compare com a avaliação."}/>}
    </div>
  );
}

/* Número transform */
function NumeroTransform({ atividade, onSolved }) {
  const [valor,setValor]=useState("");
  const n=Number(String(valor).replace(",","."));
  const valido=!Number.isNaN(n);
  const { entradaVar, transform, passos=[], dica }=atividade;

  const result=useMemo(()=>{
    if(!valido) return null;
    const expr=String(transform);
    if(!/^[\d\s+\-*/().A-Za-z_]+$/.test(expr)) return null;
    const safeExpr=expr.replaceAll(new RegExp(`\\b${entradaVar}\\b`,"g"),`(${n})`);
    try{
      const fn=Function(`"use strict";return (${safeExpr});`);
      const out=fn();
      if(!Number.isFinite(out)) return null;
      return out;
    }catch{return null;}
  },[valido,n,entradaVar,transform]);

  const ok=valido && result!==null;
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-sm text-zinc-400">Informe {entradaVar}:</label>
          <input className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
                 value={valor} onChange={e=>setValor(e.target.value)} placeholder="Ex.: 16" inputMode="numeric"/>
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-zinc-400">Expressão</label>
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm">{transform}</div>
        </div>
      </div>

      {valido && (
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3 text-sm text-zinc-300">
          <div className="font-semibold mb-1">Passo a passo</div>
          <ul className="list-disc pl-5 space-y-1">{passos.map((p,i)=><li key={i}>{p}</li>)}</ul>
          <div className="mt-2">Substituindo <b>{entradaVar}</b> por <b>{n}</b> em <code>{transform}</code></div>
          <div className="mt-1">Resultado: <b>{result ?? "—"}</b></div>
        </div>
      )}
      {!valido && valor!=="" && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-2 text-sm">
          Valor inválido. Digite um número (ex.: 16).
        </div>
      )}
      {dica && <div className="text-xs text-zinc-400">Dica: {dica}</div>}
    </div>
  );
}

/* Form validado */
function FormValidado({ atividade, onSolved }) {
  const [nome,setNome]=useState("");
  const [ano,setAno]=useState("");
  const anoAtual=new Date().getFullYear();
  const anoNum=Number(ano);
  const anoOk=/^\d{4}$/.test(ano)&&anoNum>=(atividade.regras?.anoMin??1900)&&anoNum<=(atividade.regras?.anoMax??2100);
  const idade=anoOk?(anoAtual-anoNum):null;
  const nomeOk=nome.trim().length>=2;
  const ok=nomeOk&&anoOk;
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-sm text-zinc-400">Nome</label>
          <input className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
                 value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome"/>
          {!nomeOk && nome!=="" && <span className="text-xs text-rose-300">Digite pelo menos 2 caracteres.</span>}
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-zinc-400">Ano de nascimento</label>
          <input className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
                 value={ano} onChange={e=>setAno(e.target.value)} placeholder="Ex.: 2007" inputMode="numeric"/>
          {!anoOk && ano!=="" && <span className="text-xs text-rose-300">Use 4 dígitos válidos (ex.: 2007).</span>}
        </div>
      </div>

      {ok && (
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3 text-sm text-zinc-200">
          <div><b>{nome}</b>, sua idade aproximada é <b>{idade}</b> anos.</div>
          <div className="mt-1 text-zinc-300">Cálculo: {anoAtual} − {anoNum} = {idade}</div>
        </div>
      )}
    </div>
  );
}

/* VF variável x */
function VFVariavelX({ atividade, onSolved }) {
  const [resposta,setResposta]=useState(null);
  const ok=resposta!==null && resposta===atividade.esperado;
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3 text-sm text-zinc-300">
        <div className="font-semibold mb-1">Execução passo a passo</div>
        <ul className="list-disc pl-5 space-y-1">
          {atividade.explica?.map((p,i)=><li key={i}>{p}</li>)}
        </ul>
      </div>
      <div className="flex gap-3">
        <button onClick={()=>setResposta(true)}  className={`px-4 py-2 rounded-lg ${resposta===true ?"bg-indigo-600 text-white":"bg-zinc-800 text-zinc-200"}`}>Verdadeiro</button>
        <button onClick={()=>setResposta(false)} className={`px-4 py-2 rounded-lg ${resposta===false?"bg-indigo-600 text-white":"bg-zinc-800 text-zinc-200"}`}>Falso</button>
      </div>
      {resposta!==null && <Feedback ok={ok} msg={ok?"Correto!":"Incorreto. Revise o passo 2 (x = x + 5)."} />}
    </div>
  );
}

/* Drag if */
function DragIf({ atividade, onSolved }) {
  const [pool,setPool]=useState(atividade.blocos);
  const [montado,setMontado]=useState([]);
  const onDragStart=(e,idx,from)=>{e.dataTransfer.setData("text/plain",JSON.stringify({idx,from}));}
  const onDrop=(e,dest)=>{e.preventDefault();const data=JSON.parse(e.dataTransfer.getData("text/plain")||"null");if(!data) return;
    if(data.from==="pool"&&dest==="montado"){const item=pool[data.idx];setPool(pool.filter((_,i)=>i!==data.idx));setMontado([...montado,item]);}
    else if(data.from==="montado"&&dest==="pool"){const item=montado[data.idx];setMontado(montado.filter((_,i)=>i!==data.idx));setPool([...pool,item]);}}
  const allowDrop=e=>e.preventDefault();
  const ok=montado.length===atividade.ordemCorreta.length && montado.every((txt,i)=>txt===atividade.blocos[atividade.ordemCorreta[i]]);
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div onDragOver={allowDrop} onDrop={e=>onDrop(e,"pool")} className="min-h-[140px] rounded-xl border border-white/10 bg-zinc-900/50 p-3">
          <div className="text-sm text-zinc-400 mb-2">Blocos disponíveis</div>
          <div className="flex flex-wrap gap-2">{pool.map((b,i)=>(
            <div key={`p-${i}`} draggable onDragStart={e=>onDragStart(e,i,"pool")} className="cursor-grab select-none rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm">{b}</div>
          ))}</div>
        </div>
        <div onDragOver={allowDrop} onDrop={e=>onDrop(e,"montado")} className="min-h-[140px] rounded-xl border border-white/10 bg-zinc-900/50 p-3">
          <div className="text-sm text-zinc-400 mb-2">Sua estrutura</div>
          <div className="flex flex-col gap-2">{montado.map((b,i)=>(
            <div key={`m-${i}`} draggable onDragStart={e=>onDragStart(e,i,"montado")} className="cursor-grab select-none rounded-lg border border-white/10 bg-indigo-900/40 px-3 py-2 text-sm">{b}</div>
          ))}</div>
        </div>
      </div>
      <Feedback ok={ok} msg={ok?"Estrutura correta!":atividade.dica||"Arraste na ordem: condição → então → senão → fimse."}/>
    </div>
  );
}

/* Simulador loop */
function SimuladorLoop({ atividade, onSolved }) {
  const [seq,setSeq]=useState([]);
  const gerar=()=>{const out=[];for(let i=atividade.inicio;i<=atividade.fim;i++) out.push(i);setSeq(out);onSolved?.();}
  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <button onClick={gerar} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500">Gerar</button>
      {seq.length>0 && (
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3 text-sm text-zinc-300">
          <div className="font-semibold mb-1">Passo a passo (para i = {atividade.inicio} até {atividade.fim}):</div>
          <ul className="list-disc pl-5 space-y-1">{seq.map((n,i)=><li key={i}>Iteração {i+1}: i = {n} → imprime {n}</li>)}</ul>
          <div className="mt-2">Sequência final: <b>{seq.join(", ")}</b></div>
        </div>
      )}
      {atividade.dica && <div className="text-xs text-zinc-400">Dica: {atividade.dica}</div>}
    </div>
  );
}

/* Número-lista */
function NumeroLista({ atividade, onSolved }) {
  const [valor,setValor]=useState("");
  const arr=valor.split(/[,\s]+/).map(v=>Number(v)).filter(v=>!Number.isNaN(v));
  const ok=arr.length===atividade.esperado.length && arr.every((v,i)=>v===atividade.esperado[i]);
  useEffect(()=>{if(ok) onSolved?.();},[ok,onSolved]);

  return (
    <div className="space-y-3">
      <TheoryPanel teoria={atividade.teoria}/>
      <p className="text-zinc-300">{atividade.enunciado}</p>
      <input type="text" className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
             placeholder="Ex.: 3, 6, 9, 12, 15" value={valor} onChange={e=>setValor(e.target.value)}/>
      {valor.trim()!=="" && <Feedback ok={ok} msg={ok?"Sequência correta!":"Dica: 3×1, 3×2, 3×3, 3×4, 3×5."}/>}
    </div>
  );
}

/* ---------- Página ---------- */
export default function ExercicioBasica() {
  const { id } = useParams();
  const { isActivityUnlocked, markExerciseDone } = useProgress();

  const data = findExerciseById(basica, id);
  if (!data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Exercício não encontrado</h1>
          <Link to="/trilha/basica" className="mt-3 inline-block underline text-zinc-300">Voltar</Link>
        </div>
      </main>
    );
  }

  const { atividade, modulo } = data;
  const moduloIndex = basica.modulos.findIndex(m => m.moduloId === modulo.moduloId);
  const atividadeIndex = basica.modulos[moduloIndex].atividades.findIndex(a => a.id === atividade.id);
  const canOpen = isActivityUnlocked("basica", basica, moduloIndex, atividadeIndex);

  if (!canOpen) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold">Atividade bloqueada</h1>
          <p className="mt-2 text-zinc-300">Conclua a atividade anterior para acessar esta.</p>
          <Link to="/trilha/basica" className="mt-4 inline-block underline text-zinc-300">← Voltar para a trilha</Link>
        </div>
      </main>
    );
  }

  const handleSolved = () => markExerciseDone("basica", atividade.id);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <Link to="/trilha/basica" className="text-sm text-zinc-300 underline">← Voltar para {modulo.titulo}</Link>
        <h1 className="mt-3 text-2xl font-extrabold">{atividade.titulo}</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          Tipo: <span className="uppercase">{atividade.tipo}</span>
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
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
        </div>
      </section>
    </main>
  );
}
