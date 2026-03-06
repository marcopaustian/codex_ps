import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Database, ShieldCheck } from "lucide-react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/dashboard";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("id, email, display_name, role").eq("id", user.id).single();
    profile = (data ?? null) as Profile | null;
  }

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-amber-200/60 bg-white/88 shadow-[0_25px_80px_-35px_rgba(120,70,10,0.35)] backdrop-blur">
            <CardHeader className="gap-5">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-amber-800/80">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1">Baytomat Codex</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1">Supabase Ready</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1">Team Workflow</span>
              </div>
              <CardTitle className="max-w-3xl text-5xl leading-[1.05] tracking-tight">
                Baytomat Codex ist bereit fuer Projekte, Aufgaben, Teamsteuerung und operative Zusammenarbeit.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-zinc-600">
                Die Plattform kombiniert Rollenmodell, Projektboard, Kommentare, Attachments, Activity-Logs und ein geschuetztes Dashboard auf einer produktionsreifen Supabase-Basis.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {user ? (
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="/dashboard"><ArrowRight className="mr-2 size-4" />Zum Baytomat-Codex-Dashboard</Link>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <a href="https://supabase-shadcn-vercel-app.vercel.app" rel="noreferrer" target="_blank">Live Vorschau</a>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="border-zinc-900/90 bg-zinc-950 text-zinc-50 shadow-[0_25px_80px_-35px_rgba(24,24,27,0.7)]">
              <CardHeader>
                <CardTitle>Bereit fuer den Einsatz</CardTitle>
                <CardDescription className="text-zinc-300">
                  Baytomat Codex ist auf Teamarbeit, Rechte, Nachvollziehbarkeit und operative Geschwindigkeit ausgelegt.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Geschuetztes Dashboard mit Rollen und Admin-Ansicht</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Projekte, Tasks, Kommentare, Attachments und Aktivitaet</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Supabase-Migrationen, GitHub und Vercel sind produktiv verbunden</div>
              </CardContent>
            </Card>

            <Card className="border-amber-200/60 bg-white/88">
              <CardHeader>
                <CardTitle>Session</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-zinc-600">
                {user && profile ? (
                  <>
                    <div><span className="font-medium text-zinc-950">Benutzer:</span> {profile.display_name}</div>
                    <div><span className="font-medium text-zinc-950">E-Mail:</span> {profile.email}</div>
                    <div><span className="font-medium text-zinc-950">Rolle:</span> {profile.role}</div>
                    <SignOutButton />
                  </>
                ) : (
                  <p>Kein aktiver Login. Melde dich per Magic Link an, um Baytomat Codex zu betreten.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-amber-200/60 bg-white/88"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><BriefcaseBusiness className="size-5" /> Operations</CardTitle></CardHeader><CardContent className="text-sm text-zinc-600">Projekte, Aufgaben, Verantwortlichkeiten und Team-Mitglieder liegen in einem gemeinsamen Arbeitsraum.</CardContent></Card>
          <Card className="border-amber-200/60 bg-white/88"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="size-5" /> Governance</CardTitle></CardHeader><CardContent className="text-sm text-zinc-600">Admins, Owner und Mitglieder arbeiten mit klaren Rollen und RLS-geschuetzten Datenpfaden.</CardContent></Card>
          <Card className="border-amber-200/60 bg-white/88"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Database className="size-5" /> Plattform</CardTitle></CardHeader><CardContent className="text-sm text-zinc-600">Supabase, GitHub und Vercel bilden den technischen Unterbau fuer Baytomat Codex.</CardContent></Card>
        </section>

        {!user ? <AuthPanel /> : null}
      </div>
    </main>
  );
}
