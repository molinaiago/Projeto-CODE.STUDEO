import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[35rem] w-[35rem] rounded-full bg-violet-600/20 blur-[110px]" />
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-14 pb-10">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Aprenda lógica e algoritmos de forma{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                simples e prática
              </span>
            </h1>
            <p className="mt-4 text-zinc-300 leading-relaxed">
              Trilhas de estudo (Básica, Intermediária e Avançada), exercícios autocorretivos
              e projetos integradores. Ideal para alunos e professores.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/trilhas"
                className="rounded-xl bg-white/10 hover:bg-white/15 text-white px-5 py-3 font-semibold border border-white/10 shadow"
              >
                Ver Trilhas
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                Exercícios com feedback
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400"></span>
                Projetos por trilha
              </div>
            </div>
          </div>

          {/* card destaque */}
          <div className="bg-zinc-900/50 backdrop-blur rounded-2xl border border-white/10 shadow-lg p-6">
            <div className="text-sm text-zinc-400">Destaque</div>
            <h3 className="mt-2 text-xl font-semibold">Trilha Básica</h3>
            <p className="mt-1 text-zinc-300">
              Fundamentos do pensamento computacional: algoritmo, lógica booleana, decisão e repetição.
            </p>
            <ul className="mt-4 grid gap-2 text-zinc-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ideias de algoritmo com exemplos do cotidiano
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Decisão (se/senão) em pseudocódigo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Laços por contagem e tabuada
              </li>
            </ul>
            <Link
              to="/trilhas"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 hover:bg-white/10 transition"
            >
              Explorar trilhas
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Exercícios autocorretivos",
              desc: "Feedback imediato em respostas textuais e pseudocódigo.",
            },
            {
              title: "Projetos integradores",
              desc: "Ao final de cada trilha para consolidar o aprendizado.",
            },
            {
              title: "Painel do professor",
              desc: "Atribuição de atividades e visão de progresso (em breve).",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 shadow-md"
            >
              <h4 className="font-semibold">{c.title}</h4>
              <p className="mt-1 text-sm text-zinc-300">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
