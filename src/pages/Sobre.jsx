import { Link } from "react-router-dom";

export default function Sobre() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 h-[38rem] w-[38rem] rounded-full bg-indigo-600/20 blur-[110px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Sobre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">CODE.STUDEO</span>
          </h1>
          <p className="mt-3 text-zinc-300 max-w-3xl">
            Plataforma aberta para ensino de lógica e algoritmos com foco em pensamento computacional.
            Trilhas curtas, exercícios autocorretivos e um painel para professores acompanharem o progresso.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: "Missão",
              desc: "Tornar o aprendizado de lógica acessível, em português, com exemplos do cotidiano e prática guiada."
            },
            {
              title: "Para alunos",
              desc: "Conteúdo textual + Portugol, feedback imediato e projetos ao final de cada trilha."
            },
            {
              title: "Para professores",
              desc: "Cadastro de turmas, atribuição de atividades e visão de progresso (MVP em desenvolvimento)."
            }
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-zinc-300">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 mb-10">
          <h2 className="text-xl font-semibold">Tecnologias do projeto</h2>
          <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-zinc-300">
            <li className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">React + Vite</li>
            <li className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">Tailwind CSS</li>
            <li className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">React Router</li>
            <li className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">Firebase (Auth & Firestore)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/50 to-violet-900/50 p-6">
          <h2 className="text-xl font-semibold">Estrutura pedagógica</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <h3 className="font-semibold">Trilha Básica</h3>
              <p className="mt-1 text-sm text-zinc-300">
                Algoritmos, lógica booleana, variáveis, decisão e repetição por contagem.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <h3 className="font-semibold">Trilha Intermediária</h3>
              <p className="mt-1 text-sm text-zinc-300">
                Laços condicionais, vetores, matrizes, funções e teste de mesa.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <h3 className="font-semibold">Trilha Avançada</h3>
              <p className="mt-1 text-sm text-zinc-300">
                Noção de complexidade, estratégias, busca/ordenação, strings e TADs.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/trilhas"
              className="rounded-xl bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 text-sm font-semibold border border-white/10 transition"
            >
              Ver trilhas
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-500/90 hover:to-violet-600/90 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition"
            >
              Acessar
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-zinc-400">
          Projeto TCC — CODE.STUDEO. Design minimalista, foco em acessibilidade e conteúdo em português.
        </p>
      </section>
    </main>
  );
}
