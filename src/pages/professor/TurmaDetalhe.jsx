import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToasts } from "../../context/ToastContext";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import PageLayout from "../../components/PageLayout";

export default function TurmaDetalhe() {
  const { turmaId } = useParams();
  const { user, getAuthToken } = useAuth();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToasts();

  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  useEffect(() => {
    if (!turmaId) return;
    const turmaRef = doc(db, "turmas", turmaId);
    const unsubscribe = onSnapshot(turmaRef, (doc) => {
      if (doc.exists()) {
        const turmaData = { id: doc.id, ...doc.data() };
        setTurma(turmaData);
        setNovoNome(turmaData.nomeDaTurma); 
      } else {
        setError("Turma não encontrada.");
      }
      setLoading(false);
    }, (err) => {
        console.error("Erro no listener do Firestore:", err);
        setError("Falha ao carregar dados da turma.");
        setLoading(false);
    });
    return () => unsubscribe();
  }, [turmaId]);

  const callFunction = async (functionName, data) => {
    const token = await getAuthToken();
    if (!token) throw new Error("Token de autenticação não encontrado.");

    const url = `https://us-central1-code-studeo.cloudfunctions.net/${functionName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ data })
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Erro no servidor.");
    return result.data;
  };

  const removerAluno = async (aluno) => {
    if (!window.confirm(`Tem certeza que deseja remover ${aluno.nome}?`)) return;
    try {
      await callFunction('removerAluno', { turmaId: turma.id, alunoUid: aluno.uid, alunoEmail: aluno.email, alunoNome: aluno.nome });
      showSuccessToast(`Aluno "${aluno.nome}" removido com sucesso.`);
    } catch (err) {
      console.error("Erro ao remover aluno:", err);
      showErrorToast(`Falha ao remover aluno: ${err.message}`);
    }
  };

  const deletarTurma = async () => {
    if (!window.confirm("DELETAR TURMA? Esta ação é PERMANENTE.")) return;
    try {
      await callFunction('deletarTurma', { turmaId: turma.id });
      showSuccessToast("Turma deletada com sucesso.");
      navigate("/professor/turmas");
    } catch (err) {
      console.error("Erro ao deletar turma:", err);
      showErrorToast(`Falha ao deletar turma: ${err.message}`);
    }
  };

  const handleEditarNome = async () => {
    if (novoNome.trim().length < 3) {
      showErrorToast("O nome da turma deve ter pelo menos 3 caracteres.");
      return;
    }
    try {
      await callFunction('editarNomeTurma', { turmaId: turma.id, novoNome: novoNome.trim() });
      showSuccessToast("Nome da turma atualizado com sucesso!");
      setIsEditing(false); 
    } catch (err) {
      console.error("Erro ao editar nome da turma:", err);
      showErrorToast(`Falha ao editar o nome da turma: ${err.message}`);
    }
  };

  const handleSairDaTurma = async () => {
    if (!window.confirm("Tem certeza que deseja sair desta turma?")) return;
    try {
        await callFunction('sairDaTurma', { turmaId: turma.id });
        showSuccessToast("Você saiu da turma com sucesso.");
        navigate("/aluno/turmas");
    } catch (err) {
        console.error("Erro ao sair da turma:", err);
        showErrorToast(`Não foi possível sair da turma: ${err.message}`);
    }
  };

  if (loading) return <PageLayout><p className="text-center p-10">Carregando...</p></PageLayout>;
  if (error || !turma) return <PageLayout><p className="text-center p-10 text-rose-400">{error || "Turma não encontrada."}</p></PageLayout>;
  
  const isProfessorDaTurma = user && user.uid === turma.professorId;
  const isAlunoDaTurma = user && turma.alunosUids?.includes(user.uid);

  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-6">
            <Link to={isProfessorDaTurma ? "/professor/turmas" : "/aluno/turmas"} className="text-sm text-indigo-400 hover:underline">
                ← Voltar para Minhas Turmas
            </Link>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          {isEditing ? (
            <input
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="w-full text-3xl font-bold bg-zinc-800/50 border border-indigo-500 rounded-lg px-3 py-1 text-zinc-100 focus:outline-none"
            />
          ) : (
            <h1 className="text-3xl font-bold">{turma.nomeDaTurma}</h1>
          )}

          {isProfessorDaTurma && (
            isEditing ? (
              <div className="flex gap-2">
                <button onClick={handleEditarNome} className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-semibold hover:bg-emerald-500 transition">Salvar</button>
                <button onClick={() => { setIsEditing(false); setNovoNome(turma.nomeDaTurma); }} className="rounded-lg bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600 transition">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} title="Editar nome da turma" className="text-zinc-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
              </button>
            )
          )}
        </div>
        
        <p className="text-sm text-zinc-400">Código da Turma: <code className="bg-zinc-800 text-indigo-300 p-1 rounded-md">{turma.codigoDaTurma}</code></p>
        
        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-zinc-900/50">
          <h2 className="text-xl font-semibold mb-4">Membros da Turma ({turma.alunos?.length || 0})</h2>
          <div className="space-y-3">
            {(turma.alunos && turma.alunos.length > 0) ? (
              turma.alunos.map(aluno => (
                <div key={aluno.uid} className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="text-xs text-zinc-400">{aluno.email}</p>
                  </div>
                  {isProfessorDaTurma && (
                    <button onClick={() => removerAluno(aluno)} className="text-xs bg-rose-600/50 text-rose-200 hover:bg-rose-600/80 px-2 py-1 rounded-md transition">
                      Remover
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm">Nenhum aluno entrou nesta turma ainda. Compartilhe o código de convite!</p>
            )}
          </div>
        </div>

        {isProfessorDaTurma && (
          <div className="mt-8 p-6 rounded-xl border border-rose-500/30 bg-rose-500/10">
            <h2 className="text-xl font-semibold text-rose-300 mb-4">Área de Risco (Professor)</h2>
            <p className="text-sm text-rose-200/80 mb-4">A exclusão de uma turma é uma ação permanente e removerá todos os dados associados a ela.</p>
            <button onClick={deletarTurma} className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-700 transition">
              Excluir Turma Permanentemente
            </button>
          </div>
        )}

        {isAlunoDaTurma && !isProfessorDaTurma && (
             <div className="mt-8 p-6 rounded-xl border border-rose-500/30 bg-rose-500/10">
                <h2 className="text-xl font-semibold text-rose-300 mb-4">Opções da Turma</h2>
                <button onClick={handleSairDaTurma} className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-700">
                    Sair da Turma
                </button>
             </div>
        )}
      </section>
    </PageLayout>
  );
}