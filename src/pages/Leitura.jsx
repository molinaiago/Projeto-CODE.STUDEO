import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import basica from "../data/trilha-basica.json";
import intermediaria from "../data/trilha-intermediaria.json";
import avancada from "../data/trilha-avancada.json";

const TRILHAS_MAP = { basica, intermediaria, avancada };

function findLeituraById(trilha, id) {
  if (!trilha || !Array.isArray(trilha.modulos)) return null;
  for (const m of trilha.modulos) {
    if (Array.isArray(m.atividades)) {
      for (const a of m.atividades) {
        if (a.id === id) return a.leitura || null;
      }
    }
  }
  return null;
}

export default function Leitura() {
  const { id, slug } = useParams();
  const trilha = TRILHAS_MAP[slug] || basica;
  const leitura = findLeituraById(trilha, id);

  const [resumo, setResumo] = useState("");
  const [respostas, setRespostas] = useState({});
  const [feedback, setFeedback] = useState(null);

  const handleAnswerChange = (questionId, answerIndex) => {
    setRespostas(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let acertos = 0;
    leitura.perguntas.forEach(q => {
      if (respostas[q.id] === q.respostaCorreta) {
        acertos++;
      }
    });

    if (acertos === leitura.perguntas.length) {
      setFeedback({ ok: true, msg: "Excelente! Todas as respostas estão corretas." });
    } else {
      setFeedback({ ok: false, msg: `Você acertou ${acertos} de ${leitura.perguntas.length}. Revise o texto e tente novamente.` });
    }
  };

  if (!leitura) {
    return (
      <PageLayout>
        <section className="max-w-4xl mx-auto py-10 px-4 text-center">
          <h1 className="text-2xl font-bold">Material de Leitura Não Encontrado</h1>
          <Link to={`/trilha/${slug}/exercicio/${id}`} className="mt-4 inline-block underline text-indigo-400">
            Voltar ao Exercício
          </Link>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-8">
          <Link to={`/trilha/${slug}/exercicio/${id}`} className="text-sm text-zinc-300 underline">
            ← Voltar ao Exercício
          </Link>
        </div>

        <article className="prose prose-invert prose-lg max-w-none bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h1 className="!mb-4">{leitura.titulo}</h1>
          <p className="whitespace-pre-line text-zinc-300">{leitura.texto}</p>
          {leitura.referencia && <footer className="text-xs text-zinc-500 italic mt-4">Referência: {leitura.referencia}</footer>}
        </article>

        <div className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-bold">Verificação de Leitura</h2>
          <p className="mt-1 text-zinc-400">Responda às questões abaixo para fixar o conteúdo.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            <div>
              <label htmlFor="resumo" className="block text-sm font-medium text-zinc-300">
                1. Faça um breve resumo (1-2 frases) do que você aprendeu com o texto:
              </label>
              <textarea
                id="resumo"
                rows={3}
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ex: Um algoritmo precisa ter passos claros e sempre terminar..."
              />
            </div>
            
            {leitura.perguntas.map((q, index) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-zinc-300">{index + 2}. {q.pergunta}</p>
                <div className="mt-2 space-y-2">
                  {q.alternativas.map((alt, altIndex) => (
                    <label key={altIndex} className="block cursor-pointer rounded-lg p-3 bg-zinc-900/50 border border-transparent has-[:checked]:border-indigo-500/50 has-[:checked]:bg-indigo-500/10">
                      <div className="flex items-center gap-3">
                        <input type="radio" name={q.id} value={altIndex} onChange={() => handleAnswerChange(q.id, altIndex)} className="h-4 w-4 accent-indigo-500"/>
                        <span className="text-zinc-300">{alt}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold hover:bg-emerald-500 transition">
                    Verificar Respostas
                </button>
                {feedback && (
                    <p className={`text-sm ${feedback.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{feedback.msg}</p>
                )}
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
