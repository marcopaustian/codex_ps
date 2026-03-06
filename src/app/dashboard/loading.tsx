export default function DashboardLoading() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="h-20 animate-pulse rounded-3xl bg-white/80" />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="h-[34rem] animate-pulse rounded-3xl bg-white/80" />
          <div className="h-[34rem] animate-pulse rounded-3xl bg-white/80" />
        </div>
      </div>
    </main>
  );
}
