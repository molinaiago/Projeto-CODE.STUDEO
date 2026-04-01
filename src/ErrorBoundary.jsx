import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary capturou:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
          <h1 className="text-2xl font-bold">Ocorreu um erro na UI</h1>
          <p className="mt-2 text-zinc-300">Veja detalhes abaixo e o console (F12):</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-zinc-900/50 p-4 text-sm">
            {String(this.state.error)}
          </pre>
        </main>
      );
    }
    return this.props.children;
  }
}
