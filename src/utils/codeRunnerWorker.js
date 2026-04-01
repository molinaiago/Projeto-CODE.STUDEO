// src/utils/codeRunnerWorker.js
// Roda DENTRO do Web Worker (ambiente isolado)

const SAFE_GLOBALS = {
  Math, Number, String, Boolean, Array, Object, JSON, Date, RegExp, BigInt,
  // sem fetch/document/window...
};

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    const ak = Object.keys(a), bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  // trata NaN
  return Number.isNaN(a) && Number.isNaN(b);
}

function sanitizeJs(src) {
  return String(src ?? "")
    .replace(/\uFEFF/g, "")               // BOM
    .replace(/\r\n?/g, "\n")              // CRLF -> LF
    .replace(/\u00A0/g, " ")              // NBSP
    .replace(/[\u200B-\u200D\u2060]/g, "")// zero-width
    .replace(/\u2028|\u2029/g, "\n")      // LS/PS -> \n
    .replace(/```[a-z]*\s*/gi, "")        // cercas Markdown abertas
    .replace(/```/g, "");                 // cercas Markdown fechadas
}

self.onmessage = async (e) => {
  const { code, functionName, tests = [], hiddenTests = [], timeoutMs = 1500 } = e.data;

  const keys = Object.keys(SAFE_GLOBALS);
  const vals = Object.values(SAFE_GLOBALS);

  let userFn;
  let buildError = null;
  let factorySrc = "";

  try {
    const userCode = sanitizeJs(code);

    // valida nome de função (identificador JS simples)
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(functionName)) {
      throw new Error("Nome de função inválido: " + functionName);
    }

    // monta a factory SEM template literal (evita conflitos de crases do usuário)
    factorySrc = '"use strict";\n';
    factorySrc += userCode + "\n";
    factorySrc += "if (typeof " + functionName + " !== 'function') {\n";
    factorySrc += "  throw new Error(\"Funcao '" + functionName + "' nao encontrada.\");\n";
    factorySrc += "}\n";
    factorySrc += "return { fn: " + functionName + " };";

    const factory = new Function(...keys, factorySrc);
    const { fn } = factory(...vals);
    userFn = fn;
  } catch (err) {
    buildError = String(err && err.message ? err.message : err);
  }

  if (buildError) {
    // devolve amostra do código gerado pra depuração (primeiras linhas)
    const preview = factorySrc
      ? factorySrc.split("\n").slice(0, 12).join("\n")
      : "(sem fonte gerada)";
    self.postMessage({ ok: false, buildError, results: [], _factoryPreview: preview });
    return;
  }

  const runOne = (args) =>
    new Promise((resolve) => {
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; resolve({ timeout: true }); } }, timeoutMs);

      try {
        const out = userFn(...(args || []));
        clearTimeout(t);
        if (!done) { done = true; resolve({ value: out }); }
      } catch (err) {
        clearTimeout(t);
        if (!done) { done = true; resolve({ error: String(err && err.message ? err.message : err) }); }
      }
    });

  const all = [
    ...tests.map(t => ({ ...t, _type: "public" })),
    ...hiddenTests.map(t => ({ ...t, _type: "hidden" })),
  ];

  const results = [];
  for (const t of all) {
    const r = await runOne(t.args);
    if (r.timeout) { results.push({ type: t._type, args: t.args, expect: t.expect, pass: false, reason: "Tempo excedido" }); continue; }
    if (r.error)   { results.push({ type: t._type, args: t.args, expect: t.expect, pass: false, reason: `Erro: ${r.error}` }); continue; }
    const pass = deepEqual(r.value, t.expect);
    results.push({ type: t._type, args: t.args, expect: t.expect, got: r.value, pass });
  }

  const ok = results.every(r => r.pass);
  self.postMessage({ ok, buildError: null, results });
};
