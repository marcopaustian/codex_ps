export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="h-10 w-72 animate-pulse rounded-full bg-amber-100" />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-80 animate-pulse rounded-3xl bg-white/80" />
          <div className="h-80 animate-pulse rounded-3xl bg-zinc-200/70" />
        </div>
      </div>
    </main>
  );
}
