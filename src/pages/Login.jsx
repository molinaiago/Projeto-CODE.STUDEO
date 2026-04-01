import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [isProfessor, setIsProfessor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup, loginComGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        const role = isProfessor ? 'teacher' : 'student';
        await signup(nome, email, password, role);
      }
      navigate("/");
    } catch (err) {
      if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está em uso. Tente fazer login ou redefinir sua senha.");
      } else {
        setError("Falha na autenticação. Verifique suas credenciais.");
      }
      console.error("Erro de autenticação:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginComGoogle();
      navigate("/");
    } catch (err) {
      setError("Falha ao entrar com o Google. Tente novamente.");
      console.error("Erro no login com Google:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[5%] left-[30%] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[90px]" />
        <div className="absolute bottom-[0%] right-[10%] h-80 w-80 rounded-full bg-violet-600/20 blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
              <p className="mt-1 text-sm text-zinc-400">
                {isLoginMode ? "Acesse sua conta para continuar" : "Comece sua jornada no CODE.STUDEO"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {!isLoginMode && (
                <div className="grid gap-2">
                  <label htmlFor="nome" className="text-sm text-zinc-300">Nome</label>
                  <input
                    id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="Seu nome completo"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm text-zinc-300">E-mail</label>
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="voce@exemplo.com"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm text-zinc-300">Senha</label>
                <input
                  id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Pelo menos 6 caracteres"
                />
              </div>

              {!isLoginMode && (
                <div className="flex items-center gap-2">
                  <input
                    id="isProfessor"
                    type="checkbox"
                    checked={isProfessor}
                    onChange={(e) => setIsProfessor(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isProfessor" className="text-sm text-zinc-300">Quero me cadastrar como professor</label>
                </div>
              )}
              
              {error && <p className="text-center text-sm text-rose-400">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg active:scale-[0.99] transition disabled:opacity-50"
              >
                {loading ? "Aguarde..." : (isLoginMode ? "Entrar" : "Criar conta")}
              </button>
              
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-zinc-900/60 px-3 text-xs text-zinc-400">ou</span></div></div>

              <button
                type="button" onClick={handleGoogleLogin} disabled={loading}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 active:scale-[0.99] transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.1-1.2 3.3-5.2 3.3-3.1 0-5.7-2.6-5.7-5.8s2.6-5.8 5.7-5.8c1.8 0 3 0.7 3.7 1.3l2.5-2.4C16.7 3 14.6 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.7 12 20.7c6.9 0 9.1-4.8 9.1-7.3 0-.5 0-.8-.1-1.2H12z"/></svg>
                Entrar com Google
              </button>

              <div className="text-center text-sm text-zinc-400">
                {isLoginMode ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setError(""); }} className="font-semibold text-indigo-400 hover:text-indigo-300">
                  {isLoginMode ? "Cadastre-se" : "Faça login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

