import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu.jsx";

function Logo() {

  return (

    <span className="text-xl font-bold text-white">

      CODE.<span className="text-indigo-400">STUDEO</span>

    </span>

  );

}

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const linkBase = "flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors";
  const linkActive = "text-white border-b-2 border-indigo-500";
  const linkIdle = "text-zinc-300 hover:text-white";

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-zinc-950 border-b border-zinc-800">
        <nav className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className={`${linkBase} ${pathname === "/" ? linkActive : linkIdle}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 10.707V17.5a1.5 1.5 0 01-1.5 1.5h-3.25a.75.75 0 01-.75-.75V13.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 17.5V10.707a1 1 0 01.293-.707l7-7z" clipRule="evenodd" /></svg>
                Início
              </Link>
              <Link to="/trilhas" className={`${linkBase} ${pathname.startsWith("/trilhas") ? linkActive : linkIdle}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 2a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V3a1 1 0 00-1-1H7zM4 6a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 9a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 12a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 15a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" /></svg>
                Trilhas
              </Link>
              <Link to="/sobre" className={`${linkBase} ${pathname.startsWith("/sobre") ? linkActive : linkIdle}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a1 1 0 100-2h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
                Sobre
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <UserMenu />
              ) : (
                <Link to="/login" className="rounded-lg bg-emerald-400 px-5 py-2 text-sm font-bold text-black hover:bg-emerald-300 transition">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}