// src/pages/professor/MinhasTurmas.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Garanta que o Link está importado
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import PageLayout from "../../components/PageLayout";

// Função para gerar um código de turma aleatório
const gerarCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function MinhasTurmas() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [nomeNovaTurma, setNomeNovaTurma] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Efeito para buscar as turmas do professor em tempo real
  useEffect(() => {
    if (!user) return;

    const turmasRef = collection(db, "turmas");
    const q = query(turmasRef, where("professorId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const turmasData = [];
      querySnapshot.forEach((doc) => {
        turmasData.push({ id: doc.id, ...doc.data() });
      });
      setTurmas(turmasData);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar turmas:", err);
      setError("Não foi possível carregar suas turmas.");
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [user]);

  const handleCriarTurma = async (e) => {
    e.preventDefault();
    if (nomeNovaTurma.trim().length < 3) {
      setError("O nome da turma deve ter pelo menos 3 caracteres.");
      return;
    }
    setError("");

    try {
      await addDoc(collection(db, "turmas"), {
        nomeDaTurma: nomeNovaTurma,
        professorId: user.uid,
        codigoDaTurma: gerarCodigo(),
        alunos: [],
        alunosUids: [], // Importante para as regras de segurança
        createdAt: serverTimestamp(),
      });
      setNomeNovaTurma(""); 
    } catch (err) {
      console.error("Erro ao criar turma:", err);
      setError("Ocorreu um erro ao criar a turma. Tente novamente.");
    }
  };

  return (
    <PageLayout>
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Painel do Professor - Minhas Turmas</h1>
        
        {/* Formulário para criar nova turma */}
        <div className="p-6 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Criar Nova Turma</h2>
          <form onSubmit={handleCriarTurma} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={nomeNovaTurma}
              onChange={(e) => setNomeNovaTurma(e.target.value)}
              placeholder="Ex: 3º Ano B - Pensamento Computacional"
              className="flex-grow w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm"
            />
            <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-500 transition">
              Criar Turma
            </button>
          </form>
          {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Lista de turmas existentes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Suas Turmas</h2>
          {loading && <p>Carregando turmas...</p>}
          {!loading && turmas.length === 0 && <p className="text-zinc-400">Você ainda não criou nenhuma turma.</p>}
          
          {turmas.map((turma) => (
            // A MUDANÇA ESTÁ AQUI: A div agora é um Link clicável
            <Link
              key={turma.id}
              to={`/professor/turma/${turma.id}`}
              className="block p-4 rounded-xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-800/60 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{turma.nomeDaTurma}</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Código de Convite: <code className="bg-zinc-800 text-indigo-300 p-1 rounded">{turma.codigoDaTurma}</code>
                  </p>
                </div>
                <div className="text-sm text-zinc-300">
                  {turma.alunos.length} aluno(s)
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}