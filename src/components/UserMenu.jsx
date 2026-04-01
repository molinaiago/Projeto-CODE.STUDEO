import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user) return null;

  const userName = user.displayName || user.email.split('@')[0];

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>
        <span className="text-sm font-semibold">{userName}</span>
        <svg className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-zinc-900 border border-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-zinc-800 mb-1">
              <p className="text-xs text-zinc-400">Logado como</p>
              <p className="truncate text-sm font-medium text-zinc-200">{user.email}</p>
            </div>
            
            {userData?.role === 'teacher' ? (
              <>
                <Link to="/professor/turmas" className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                  Painel do Professor
                </Link>
                <Link to="/perfil" className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                  Meu Perfil
                </Link>
              </>
            ) : (
              <>
                <Link to="/aluno/turmas" className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                  Turmas
                </Link>
                <Link to="/perfil" className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                  Meu Perfil
                </Link>
                <Link to="/progresso" className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                  Meu Progresso
                </Link>
              </>
            )}

            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 mt-1 border-t border-zinc-800 text-sm text-rose-400 hover:bg-zinc-800 hover:text-rose-300">
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}