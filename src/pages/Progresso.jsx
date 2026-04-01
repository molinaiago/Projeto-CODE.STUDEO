import PageLayout from "../components/PageLayout"; 

export default function Progresso() {
  return (

    <PageLayout>
       <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Meu Progresso</h1>
        <div className="p-6 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
          <p className="text-zinc-400">Em breve, aqui você verá um resumo de todas as trilhas e atividades que completou, com gráficos e estatísticas de desempenho.</p>
        </div>
      </section>
    </PageLayout>
  );
}