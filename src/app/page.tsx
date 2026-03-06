import { CheckCircle2, Cloud, Github, SquareTerminal, UserRound } from "lucide-react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const checks = [
  {
    label: "Supabase URL",
    ready: Boolean(env.NEXT_PUBLIC_SUPABASE_URL),
    value: env.NEXT_PUBLIC_SUPABASE_URL || "Fehlt noch",
  },
  {
    label: "Supabase Anon Key",
    ready: Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    value: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Gesetzt" : "Fehlt noch",
  },
  {
    label: "Vercel Deployment",
    ready: true,
    value: "Projekt ist auf Vercel live",
  },
  {
    label: "GitHub Repository",
    ready: true,
    value: "Code liegt im Repo codex_ps",
  },
];

const nextSteps = [
  "Magic Link anfordern und Login testen",
  "Danach geschuetzte Routen oder Rollenmodell aufbauen",
  "Optional: Tabellen und Policies ueber Supabase erweitern",
  "Optional: Server Actions fuer Daten schreiben einsetzen",
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f4ea,_#ffffff_55%)] px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-zinc-200/80 bg-white/90 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.35)]">
            <CardHeader className="gap-4">
              <div className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                <span className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1">
                  Next.js 16
                </span>
                <span className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1">
                  shadcn/ui
                </span>
                <span className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1">
                  Supabase Auth
                </span>
              </div>
              <CardTitle className="max-w-2xl text-4xl leading-tight">
                Starter mit echter Supabase-Session statt nur Setup-Checkliste
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-zinc-600">
                Die App ist deployed, mit Supabase verbunden und bereit fuer Login per Magic Link.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <a href="https://supabase-shadcn-vercel-app.vercel.app" rel="noreferrer" target="_blank">
                  <Cloud className="mr-2 size-4" />
                  Live App oeffnen
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="https://github.com/marcopaustian/codex_ps" rel="noreferrer" target="_blank">
                  <Github className="mr-2 size-4" />
                  GitHub Repo
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 bg-zinc-950 text-zinc-50 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <SquareTerminal className="size-5" />
                Naechste Schritte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                {nextSteps.map((step) => (
                  <div
                    key={step}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {checks.map((check) => (
              <Card key={check.label} className="border-zinc-200/80 bg-white/90">
                <CardHeader className="pb-3">
                  <CardDescription>{check.label}</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2
                      className={
                        check.ready ? "size-5 text-emerald-600" : "size-5 text-amber-500"
                      }
                    />
                    {check.ready ? "Bereit" : "Offen"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600">
                  {check.value}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6">
            <Card className="border-zinc-200/80 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="size-5" />
                  Aktuelle Session
                </CardTitle>
                <CardDescription>
                  Serverseitig aus Supabase gelesen. Damit ist die Auth-Kette von Cookie bis Server-Client aktiv.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm text-zinc-600">
                {user ? (
                  <>
                    <div>
                      <p className="font-medium text-zinc-950">Angemeldet als</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-950">User ID</p>
                      <p className="break-all">{user.id}</p>
                    </div>
                    <SignOutButton />
                  </>
                ) : (
                  <p>Derzeit ist keine Session aktiv. Nutze unten den Magic-Link-Login.</p>
                )}
              </CardContent>
            </Card>

            <AuthPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
