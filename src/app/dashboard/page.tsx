import { redirect } from "next/navigation";
import { LayoutDashboard, ShieldCheck, SquareKanban } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { AdminUsersCard } from "@/components/dashboard/admin-users-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { ProjectBoard } from "@/components/dashboard/project-board";
import { ProjectComposer } from "@/components/dashboard/project-composer";
import { TaskComposer } from "@/components/dashboard/task-composer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Project, Task } from "@/lib/types/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: profile }, { data: projects }, { data: tasks }, { data: profiles }] = await Promise.all([
    supabase.from("profiles").select("id, email, display_name, role").eq("id", user.id).single(),
    supabase.from("projects").select("id, owner_id, name, description, stage, inserted_at, updated_at").order("inserted_at", { ascending: false }),
    supabase.from("tasks").select("id, project_id, owner_id, title, details, status, priority, due_date, inserted_at, updated_at").order("inserted_at", { ascending: false }),
    supabase.from("profiles").select("id, email, display_name, role").order("inserted_at", { ascending: true }),
  ]);

  const typedProfile = profile as Profile;
  const typedProjects = (projects ?? []) as Project[];
  const typedTasks = (tasks ?? []) as Task[];
  const typedProfiles = (profiles ?? []) as Profile[];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#f6efe3_100%)] px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-zinc-200/80 bg-white/90 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.35)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl"><LayoutDashboard className="size-7" />Dashboard</CardTitle>
              <CardDescription>Geschuetzte Arbeitsflaeche fuer Projekte, Tasks, Profilverwaltung und Admin-Funktionen.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm text-zinc-500">Rolle</p><p className="text-2xl font-semibold capitalize">{typedProfile.role}</p></div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm text-zinc-500">Projekte</p><p className="text-2xl font-semibold">{typedProjects.length}</p></div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm text-zinc-500">Tasks</p><p className="text-2xl font-semibold">{typedTasks.length}</p></div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 bg-zinc-950 text-zinc-50 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="size-5" />Rollen und Policies</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Erster Nutzer wird automatisch `admin`.</div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Admins koennen Rollen anderer Nutzer im Dashboard aendern.</div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Kommentare, Projekte und Tasks sind ueber RLS abgesichert.</div>
              <SignOutButton />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-6">
            <ProfileCard profile={typedProfile} />
            <ProjectComposer />
            <TaskComposer projects={typedProjects} />
            {typedProfile.role === "admin" ? <AdminUsersCard currentUserId={typedProfile.id} profiles={typedProfiles} /> : null}
          </div>

          <Card className="border-zinc-200/80 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl"><SquareKanban className="size-6" />Projektboard</CardTitle>
              <CardDescription>Serverseitig geladen aus Supabase. Detailseiten enthalten Task-Kommentare.</CardDescription>
            </CardHeader>
            <CardContent><ProjectBoard projects={typedProjects} tasks={typedTasks} /></CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
