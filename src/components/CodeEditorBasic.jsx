export default function CodeEditorBasic({ value, onChange, height = 220 }) {
  return (
    <textarea
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ height }}
      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm font-mono leading-6 outline-none focus:ring-2 focus:ring-indigo-500/60"
      placeholder="// Escreva seu código aqui"
    />
  );
}
