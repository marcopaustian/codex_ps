import { redirect } from "next/navigation";
import { Activity, LayoutDashboard, ShieldCheck, Users } from "lucide-react";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AdminUsersCard } from "@/components/dashboard/admin-users-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { ProjectBoard } from "@/components/dashboard/project-board";
import { ProjectComposer } from "@/components/dashboard/project-composer";
import { TaskComposer } from "@/components/dashboard/task-composer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Project, ProjectActivity, ProjectMember, Task } from "@/lib/types/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: profile }, { data: projects }, { data: tasks }, { data: profiles }, { data: memberships }, { data: activity }] = await Promise.all([
    supabase.from("profiles").select("id, email, display_name, role").eq("id", user.id).single(),
    supabase.from("projects").select("id, owner_id, name, description, stage, inserted_at, updated_at").order("inserted_at", { ascending: false }),
    supabase.from("tasks").select("id, project_id, owner_id, title, details, status, priority, due_date, inserted_at, updated_at").order("inserted_at", { ascending: false }),
    supabase.from("profiles").select("id, email, display_name, role").order("inserted_at", { ascending: true }),
    supabase.from("project_members").select("project_id, user_id, role, inserted_at, profile:profiles!project_members_user_id_fkey(id, email, display_name, role)"),
    supabase.from("project_activity").select("id, project_id, actor_id, event_type, message, inserted_at, actor:profiles!project_activity_actor_id_fkey(id, email, display_name, role)").order("inserted_at", { ascending: false }).limit(8),
  ]);

  const typedProfile = profile as Profile;
  const typedProjects = (projects ?? []) as Project[];
  const typedTasks = (tasks ?? []) as Task[];
  const typedProfiles = (profiles ?? []) as Profile[];
  const typedMemberships = ((memberships ?? []) as unknown as (ProjectMember & { profile: Profile[] | null })[]).map((item) => ({ ...item, profile: item.profile?.[0] ?? null }));
  const typedActivity = ((activity ?? []) as unknown as (ProjectActivity & { actor: Profile[] | null })[]).map((item) => ({ ...item, actor: item.actor?.[0] ?? null }));

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-amber-200/60 bg-white/88 shadow-[0_25px_80px_-35px_rgba(120,70,10,0.35)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl"><LayoutDashboard className="size-7 text-amber-600" />Baytomat Flowboard Dashboard</CardTitle>
              <CardDescription>Steuerzentrale fuer Projekte, Team, Aktivitaet und einen klaren Planner-Workflow.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-sm text-zinc-500">Rolle</p><p className="text-2xl font-semibold capitalize">{typedProfile.role}</p></div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-sm text-zinc-500">Projekte</p><p className="text-2xl font-semibold">{typedProjects.length}</p></div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-sm text-zinc-500">Tasks</p><p className="text-2xl font-semibold">{typedTasks.length}</p></div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-sm text-zinc-500">Mitglieder</p><p className="text-2xl font-semibold">{typedMemberships.length}</p></div>
            </CardContent>
          </Card>

          <Card className="border-zinc-900/90 bg-zinc-950 text-zinc-50 shadow-[0_25px_80px_-35px_rgba(24,24,27,0.7)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="size-5" />Governance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Admins steuern Rollen, Projekt-Owner steuern ihr Team.</div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Aktivitaet, Kommentare und Attachments bleiben nachvollziehbar dokumentiert.</div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Supabase, GitHub und Vercel sind produktiv verbunden.</div>
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

          <div className="grid gap-6">
            <Card className="border-amber-200/60 bg-white/88">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Users className="size-6 text-amber-600" />Planner-Board</CardTitle>
                <CardDescription>Backlog, In Arbeit, Review und Erledigt bilden den Kernfluss pro Projekt.</CardDescription>
              </CardHeader>
              <CardContent><ProjectBoard projects={typedProjects} tasks={typedTasks} /></CardContent>
            </Card>

            <Card className="border-amber-200/60 bg-white/88">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Activity className="size-6 text-amber-600" />Letzte Aktivitaet</CardTitle>
                <CardDescription>Projektuebergreifender Ueberblick ueber die juengsten Aenderungen in Baytomat Flowboard.</CardDescription>
              </CardHeader>
              <CardContent><ActivityFeed items={typedActivity as ProjectActivity[]} /></CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
