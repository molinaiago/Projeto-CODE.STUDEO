import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import AppRouter from "./AppRouter.jsx";
import { ProgressProvider } from "./context/ProgressContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ToastProvider } from "./context/ToastContext.jsx"; 

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

//npm run build

//# Mova a pasta functions temporariamente
//mv functions functions-backup

//# Faça o deploy
//npx wrangler pages deploy dist --project-name=code-studeo-tcc

//# Restaure a pasta
//mv functions-backup functions