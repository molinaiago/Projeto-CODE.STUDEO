import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import PageLayout from "../../components/PageLayout";

export default function Turmas() {
  const { user, invokeFunction } = useAuth(); 
  const [turmas, setTurmas] = useState([]);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    const turmasRef = collection(db, "turmas");
    const q = query(turmasRef, where("alunosUids", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const turmasData = [];
      querySnapshot.forEach((doc) => {
        turmasData.push({ id: doc.id, ...doc.data() });
      });
      setTurmas(turmasData);
      setLoadingTurmas(false);
    }, (err) => {
      console.error("Erro ao buscar turmas do aluno:", err);
      setError("Não foi possível carregar suas turmas.");
      setLoadingTurmas(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEntrarTurma = async (e) => {
    e.preventDefault();
    if (!codigo.trim() || codigo.trim().length !== 6) {
      setJoinError("Por favor, insira um código de turma válido com 6 caracteres.");
      return;
    }
    setJoinError("");
    setJoinSuccess("");
    setJoinLoading(true);

    try {
      const result = await invokeFunction('gerenciarTurma', {
        action: 'entrarNaTurma',
        data: { codigoDaTurma: codigo.toUpperCase() }
      });

      if (result.success) {
        setJoinSuccess(result.message);
        setCodigo("");
      } else {
        setJoinError(result.message || "Ocorreu um erro desconhecido.");
      }
    } catch (err) {
      console.error("Erro ao chamar a Cloud Function:", err);
      setJoinError(err.message || "Erro de comunicação com o servidor.");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Turmas</h1>

        <div className="p-6 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Entrar em uma Nova Turma</h2>
          <p className="text-zinc-300 mb-4 text-sm">
            Peça ao seu professor o código de 6 caracteres e insira-o abaixo para se matricular.
          </p>
          <form onSubmit={handleEntrarTurma} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="CÓDIGO"
              maxLength={6}
              className="flex-grow w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm uppercase tracking-widest text-center font-mono focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              disabled={joinLoading}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {joinLoading ? "Verificando..." : "Entrar na Turma"}
            </button>
          </form>
          {joinError && <p className="text-rose-400 text-sm mt-3">{joinError}</p>}
          {joinSuccess && <p className="text-emerald-400 text-sm mt-3">{joinSuccess}</p>}
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Suas Turmas Matriculadas</h2>
            {loadingTurmas && <p className="text-zinc-400">Carregando...</p>}
            {!loadingTurmas && error && <p className="text-rose-400">{error}</p>}
            {!loadingTurmas && turmas.length === 0 && (
                <div className="text-center py-10 px-6 rounded-xl border border-dashed border-zinc-700">
                    <p className="text-zinc-400">Você ainda não está matriculado em nenhuma turma.</p>
                </div>
            )}
            {turmas.map((turma) => (
                <Link 
                key={turma.id} 
                to={`/professor/turma/${turma.id}`} 
                className="block p-4 rounded-xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-800/60 transition"
                >
                <div className="flex justify-between items-center">
                    <div>
                    <h3 className="font-bold text-lg">{turma.nomeDaTurma}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{turma.alunos.length} membro(s)</p>
                    </div>
                    <div className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                    Ver Turma
                    </div>
                </div>
                </Link>
            ))}
        </div>
      </section>
    </PageLayout>
  );
}