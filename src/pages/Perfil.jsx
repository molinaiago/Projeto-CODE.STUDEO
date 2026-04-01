import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="mt-2 text-sm text-zinc-300">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-600 transition">
            Cancelar
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition">
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}


export default function Perfil() {
  const { user, isGoogleProvider, deleteAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteAccount();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir a conta:", error);
      alert("Ocorreu um erro ao tentar excluir sua conta.");
    }
  };

  return (
    <>
      <PageLayout>
        <section className="max-w-4xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
          <div className="p-6 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
            <div className="space-y-2">
              <p><strong className="text-zinc-400 w-28 inline-block">Nome:</strong> {user?.displayName || 'Não informado'}</p>
              <p><strong className="text-zinc-400 w-28 inline-block">E-mail:</strong> {user?.email}</p>
              <p><strong className="text-zinc-400 w-28 inline-block">Provedor:</strong> {isGoogleProvider ? 'Google' : 'E-mail e Senha'}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6 border-t border-white/10 pt-6">
              {!isGoogleProvider && (
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Alterar Senha
                </button>
              )}
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="rounded-lg bg-rose-800/70 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-800 transition"
              >
                Excluir Conta
              </button>
            </div>
            {isGoogleProvider && (
              <p className="text-xs text-zinc-500 mt-3">Sua conta foi criada via Google. A senha e outras informações são gerenciadas por lá.</p>
            )}
          </div>
        </section>
      </PageLayout>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão da Conta"
      >
        <p>Você tem certeza de que deseja excluir sua conta? Esta ação marcará sua conta como inativa.</p>
        <p className="mt-2">Seus dados de progresso serão mantidos caso decida reativar sua conta no futuro.</p>
      </ConfirmationModal>
    </>
  );
}