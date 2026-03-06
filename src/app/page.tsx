import { CheckCircle2, Cloud, Github, SquareTerminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/lib/env";

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
    label: "Vercel Token",
    ready: Boolean(env.VERCEL_TOKEN),
    value: env.VERCEL_TOKEN ? "Gesetzt" : "Optional lokal, sinnvoll fuer CI",
  },
  {
    label: "GitHub Token",
    ready: Boolean(env.GITHUB_TOKEN),
    value: env.GITHUB_TOKEN ? "Gesetzt" : "Optional lokal, sinnvoll fuer Automatisierung",
  },
];

const nextSteps = [
  "GitHub anmelden: gh auth login",
  "Vercel anmelden: vercel login",
  "Supabase lokal nutzen: npx supabase login",
  "Env-Datei aus .env.example ableiten und Werte eintragen",
];

export default function Home() {
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
                  Supabase
                </span>
              </div>
              <CardTitle className="max-w-2xl text-4xl leading-tight">
                Entwicklungsumgebung fuer Supabase, shadcn/ui, Vercel, GitHub
                und VS Code
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-zinc-600">
                Das Projekt ist angelegt. Diese Startseite zeigt sofort, welche
                Zugangsdaten und Login-Schritte fuer Deployment und Backend noch
                fehlen.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <a
                  href="https://vercel.com/new"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Cloud className="mr-2 size-4" />
                  Vercel oeffnen
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a
                  href="https://github.com/new"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Github className="mr-2 size-4" />
                  GitHub Repo anlegen
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 bg-zinc-950 text-zinc-50 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <SquareTerminal className="size-5" />
                Naechste Befehle
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </section>
      </div>
    </main>
  );
}
