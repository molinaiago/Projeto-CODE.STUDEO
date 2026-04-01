export default function PageLayout({ children }) {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[35rem] w-[35rem] rounded-full bg-violet-600/20 blur-[110px]" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}