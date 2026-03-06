import Link from "next/link";
import { ArrowRight, Database, ShieldCheck, LayoutGrid } from "lucide-react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/dashboard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, display_name, role")
      .eq("id", user.id)
      .single();

    profile = (data ?? null) as Profile | null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4efe6_0%,#fffdf8_40%,#ffffff_100%)] px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-zinc-200/80 bg-white/90 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.35)]">
            <CardHeader className="gap-5">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-600">
                <span className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1">Dashboard</span>
                <span className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1">Rollenmodell</span>
                <span className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1">Projects + Tasks</span>
              </div>
              <CardTitle className="max-w-3xl text-4xl leading-tight">
                Supabase-Starter mit geschuetztem Dashboard, Profilrollen und einem echten Projekt-Datenmodell
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-zinc-600">
                Die App hat jetzt Auth, `profiles`, `projects`, `tasks`, Row Level Security und eine separate Dashboard-Route fuer die eigentliche Arbeit.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {user ? (
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/dashboard">
                    <ArrowRight className="mr-2 size-4" />
                    Zum Dashboard
                  </Link>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="https://supabase-shadcn-vercel-app.vercel.app" rel="noreferrer" target="_blank">
                  Live App
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="border-zinc-200/80 bg-zinc-950 text-zinc-50 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.55)]">
              <CardHeader>
                <CardTitle>Systemstatus</CardTitle>
                <CardDescription className="text-zinc-300">
                  Auth, Rollen und Datenmodell sind jetzt serverseitig angebunden.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">`profiles` mit Rollen `member` und `admin`</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">`projects` und `tasks` mit RLS</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Geschuetzte Route unter `/dashboard`</div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/80 bg-white/90">
              <CardHeader>
                <CardTitle>Aktueller Nutzer</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-zinc-600">
                {user && profile ? (
                  <>
                    <div><span className="font-medium text-zinc-950">E-Mail:</span> {profile.email}</div>
                    <div><span className="font-medium text-zinc-950">Name:</span> {profile.display_name}</div>
                    <div><span className="font-medium text-zinc-950">Rolle:</span> {profile.role}</div>
                    <SignOutButton />
                  </>
                ) : (
                  <p>Nicht angemeldet. Nutze den Magic-Link-Login.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-200/80 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><LayoutGrid className="size-5" /> Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              Separate Arbeitsansicht fuer Projekte, Tasks und Profilpflege.
            </CardContent>
          </Card>
          <Card className="border-zinc-200/80 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="size-5" /> Rollen</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              Der erste User wird Admin, weitere User starten als Member. Policies beachten den Rollentyp.
            </CardContent>
          </Card>
          <Card className="border-zinc-200/80 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Database className="size-5" /> Datenmodell</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              `projects` gruppieren Arbeit, `tasks` bilden das operative CRUD im Dashboard.
            </CardContent>
          </Card>
        </section>

        {!user ? <AuthPanel /> : null}
      </div>
    </main>
  );
}

