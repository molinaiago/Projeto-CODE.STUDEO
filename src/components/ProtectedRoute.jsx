import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "./PageLayout";

export default function ProtectedRoute({ children, role }) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <PageLayout>
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-zinc-400">Verificando permissões...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && userData?.role !== role) {

    return <Navigate to="/" replace />;
  }

  return children;
}