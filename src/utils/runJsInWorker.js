// src/utils/runJsInWorker.js
export function runJsInWorker({ code, functionName, tests, hiddenTests, timeoutMs = 1500 }) {
  return new Promise((resolve) => {
    // ⚠️ O caminho tem que bater com o arquivo acima
    const worker = new Worker(new URL("./codeRunnerWorker.js", import.meta.url), { type: "module" });

    const kill = () => { try { worker.terminate(); } catch {} };

    // watchdog: evita travar para sempre
    const watchdog = setTimeout(() => {
      kill();
      resolve({ ok: false, buildError: "Tempo excedido (watchdog)", results: [] });
    }, Math.max(timeoutMs + 800, 4500));

    worker.onmessage = (e) => {
      clearTimeout(watchdog);
      const data = e.data;
      kill();
      resolve(data);
    };

    worker.onerror = (err) => {
      clearTimeout(watchdog);
      kill();
      resolve({ ok: false, buildError: String(err.message || err), results: [] });
    };

    worker.postMessage({ code, functionName, tests, hiddenTests, timeoutMs });
  });
}
