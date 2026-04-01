import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Sobre from "./pages/Sobre.jsx";
import Trilhas from "./pages/Trilhas";
import TrilhaDetalhe from "./pages/TrilhaDetalhe";
import Exercicio from "./pages/Exercicio.jsx";
import Perfil from "./pages/Perfil.jsx";
import Progresso from "./pages/Progresso.jsx";
import Leitura from "./pages/Leitura.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MinhasTurmas from "./pages/professor/MinhasTurmas.jsx";
import TurmaDetalhe from "./pages/professor/TurmaDetalhe.jsx";
import Turmas from "./pages/aluno/Turmas.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/trilhas" element={<Trilhas />} />

        {/* --- ROTAS PROTEGIDAS --- */}
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/progresso" element={<ProtectedRoute><Progresso /></ProtectedRoute>} />
        <Route path="/trilha/:slug" element={<ProtectedRoute><TrilhaDetalhe /></ProtectedRoute>} />
        <Route path="/trilha/:slug/exercicio/:id" element={<ProtectedRoute><Exercicio /></ProtectedRoute>} />
        <Route path="/trilha/:slug/exercicio/:id/leitura" element={<ProtectedRoute><Leitura /></ProtectedRoute>} />

        {/* Rotas do Professor */}
        <Route path="/professor/turmas" element={<ProtectedRoute role="teacher"><MinhasTurmas /></ProtectedRoute>} />
        <Route path="/professor/turma/:turmaId" element={<ProtectedRoute><TurmaDetalhe /></ProtectedRoute>} />
        
        {/* Rota Unificada do Aluno */}
        <Route path="/aluno/turmas" element={<ProtectedRoute role="student"><Turmas /></ProtectedRoute>} />

        {/* Rota 404 */}
        <Route path="*" element={<div className="p-6 text-white">404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}