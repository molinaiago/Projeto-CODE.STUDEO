// src/pages/Trilhas.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal.jsx";
import { useEffect, useState } from "react";
import trilhas from "../data/trilhas.json";

function CardIcon({ variant = "basica" }) {
  const common = "h-10 w-10 rounded-xl flex items-center justify-center shadow-md";
  if (variant === "intermediaria") {
    return (
      <div className={`${common} bg-gradient-to-br from-indigo-500 to-violet-600`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white"><path d="M12 3l8 5v8l-8 5-8-5V8l8-5Z" opacity=".28" fill="currentColor"/><path d="M7 10h10M7 14h6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
    );
  }
  if (variant === "avancada") {
    return (
      <div className={`${common} bg-gradient-to-br from-pink-500 to-rose-600`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white"><path d="M5 7h14v10H5z" opacity=".28" fill="currentColor"/><path d="M8 9h8M8 12h6M8 15h4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
    );
  }
  return ( // Padrão é a básica
    <div className={`${common} bg-gradient-to-br from-emerald-500 to-teal-600`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white"><path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" opacity=".3" fill="currentColor"/><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M8 12h5M8 15h8" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
    </div>
  );
}

function TrilhaCard({ item, variant, onClick }) {
  return (
    <a 
      href={`/trilha/${item.slug}`}
      onClick={onClick}
      className="group h-full rounded-2xl border border-white/10 bg-zinc-900/40 p-6 shadow-md hover:shadow-xl hover:border-white/15 transition flex flex-col cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <CardIcon variant={variant} />
        <div>
          <h3 className="text-lg font-semibold">{item.titulo}</h3>
          <p className="mt-1 text-sm text-zinc-300">{item.descricao}</p>
        </div>
      </div>
      <div className="mt-auto pt-5 flex items-center justify-between">
        <div className="text-xs text-zinc-400">
          Nível: <span className="capitalize">{variant}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm group-hover:bg-white/10 transition">
          Abrir trilha
          <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </a>
  );
}

export default function Trilhas() {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      setIsModalOpen(true);
    }
    if (user) {
      setIsModalOpen(false);
    }
  }, [user, loading]);

  const handleCardClick = (e, trilha) => {
    e.preventDefault();
    if (user) {
      navigate(`/trilha/${trilha.slug}`);
    } else {
      setIsModalOpen(true);
    }
  };
  
  const lista = [
    { key: "basica", data: trilhas.basica },
    { key: "intermediaria", data: trilhas.intermediaria },
    { key: "avancada", data: trilhas.avancada },
  ];

  const contentClass = isModalOpen ? "blur-sm pointer-events-none" : "";

  return (
    <>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <main className={`relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 text-zinc-100 transition-all duration-300 ${contentClass}`}>
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight">Trilhas de estudo</h1>
            <p className="mt-2 text-zinc-300">
              Escolha um nível para começar. Cada trilha traz conteúdos curtos, exemplos e exercícios com feedback.
            </p>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {lista.map(({ key, data }) => (
              data && <TrilhaCard 
                key={key} 
                item={data} 
                variant={key} 
                onClick={(e) => handleCardClick(e, data)}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}