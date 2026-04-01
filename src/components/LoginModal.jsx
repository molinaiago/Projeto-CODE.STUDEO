import { Link } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
          Continue sua Jornada
        </h2>
        <p className="mt-2 text-zinc-300">
          Para acessar as trilhas de estudo e salvar seu progresso, você precisa fazer login ou criar uma conta.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link 
            to="/login" 
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition"
          >
            Entrar ou Criar Conta
          </Link>
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-zinc-700 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-600 transition"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
