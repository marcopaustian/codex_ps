import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MessageSquare, Paperclip, Users } from "lucide-react";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { TaskAttachments } from "@/components/attachments/task-attachments";
import { TaskComments } from "@/components/comments/task-comments";
import { ProjectMembersCard } from "@/components/dashboard/project-members-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectActivity, ProjectMember, Task, TaskAttachment, TaskComment } from "@/lib/types/dashboard";

type RawComment = Omit<TaskComment, "author"> & { author: TaskComment["author"][] | null };
type RawMember = Omit<ProjectMember, "profile"> & { profile: ProjectMember["profile"][] | null };
type RawActivity = Omit<ProjectActivity, "actor"> & { actor: ProjectActivity["actor"][] | null };

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: project }, { data: tasks }, { data: members }, { data: activity }, { data: attachments }] = await Promise.all([
    supabase.from("projects").select("id, owner_id, name, description, stage, inserted_at, updated_at").eq("id", id).single(),
    supabase.from("tasks").select("id, project_id, owner_id, title, details, status, priority, due_date, inserted_at, updated_at").eq("project_id", id).order("inserted_at", { ascending: false }),
    supabase.from("project_members").select("project_id, user_id, role, inserted_at, profile:profiles!project_members_user_id_fkey(id, email, display_name, role)").eq("project_id", id),
    supabase.from("project_activity").select("id, project_id, actor_id, event_type, message, inserted_at, actor:profiles!project_activity_actor_id_fkey(id, email, display_name, role)").eq("project_id", id).order("inserted_at", { ascending: false }).limit(20),
    supabase.from("task_attachments").select("id, task_id, uploader_id, file_name, file_url, file_size_bytes, inserted_at").order("inserted_at", { ascending: false }),
  ]);

  if (!project) notFound();

  const typedProject = project as Project;
  const typedTasks = (tasks ?? []) as Task[];
  const typedMembers = ((members ?? []) as RawMember[]).map((item) => ({ ...item, profile: item.profile?.[0] ?? null }));
  const typedActivity = ((activity ?? []) as RawActivity[]).map((item) => ({ ...item, actor: item.actor?.[0] ?? null }));
  const typedAttachments = (attachments ?? []).filter((item) => typedTasks.some((task) => task.id === item.task_id)) as TaskAttachment[];

  const taskIds = typedTasks.map((task) => task.id);
  const commentsByTask = new Map<string, TaskComment[]>();
  const attachmentsByTask = new Map<string, TaskAttachment[]>();

  if (taskIds.length > 0) {
    const { data: comments } = await supabase
      .from("task_comments")
      .select("id, task_id, author_id, body, inserted_at, updated_at, author:profiles!task_comments_author_id_fkey(id, display_name, email, role)")
      .in("task_id", taskIds)
      .order("inserted_at", { ascending: true });

    for (const comment of ((comments ?? []) as RawComment[])) {
      const normalized: TaskComment = { ...comment, author: comment.author?.[0] ?? null };
      const list = commentsByTask.get(comment.task_id) ?? [];
      list.push(normalized);
      commentsByTask.set(comment.task_id, list);
    }
  }

  for (const attachment of typedAttachments) {
    const list = attachmentsByTask.get(attachment.task_id) ?? [];
    list.push(attachment);
    attachmentsByTask.set(attachment.task_id, list);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#f6efe3_100%)] px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div>
          <Link className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline" href="/dashboard">
            <ArrowLeft className="mr-1 inline size-4" />Zurueck zum Dashboard
          </Link>
          <h1 className="mt-3 text-4xl font-semibold">{typedProject.name}</h1>
          <p className="mt-2 text-zinc-600">{typedProject.description || "Keine Beschreibung"} | Stage: {typedProject.stage}</p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-6">
            <ProjectMembersCard members={typedMembers as ProjectMember[]} projectId={typedProject.id} />
            <Card className="border-zinc-200/80 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="size-5" />Projektübersicht</CardTitle>
                <CardDescription>Owner, Mitglieder und Umfang des Projekts.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-zinc-700">
                <p><span className="font-medium text-zinc-950">Owner:</span> {typedProject.owner_id}</p>
                <p><span className="font-medium text-zinc-950">Mitglieder:</span> {typedMembers.length}</p>
                <p><span className="font-medium text-zinc-950">Tasks:</span> {typedTasks.length}</p>
              </CardContent>
            </Card>
            <ActivityFeed items={typedActivity as ProjectActivity[]} />
          </div>

          <div className="grid gap-6">
            {typedTasks.length === 0 ? (
              <Card className="border-dashed border-zinc-300 bg-white/80"><CardHeader><CardTitle>Noch keine Tasks</CardTitle><CardDescription>Lege im Dashboard zuerst Tasks fuer dieses Projekt an.</CardDescription></CardHeader></Card>
            ) : (
              typedTasks.map((task) => (
                <Card key={task.id} className="border-zinc-200/80 bg-white/90">
                  <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>Status: {task.status} | Prioritaet: {task.priority}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">{task.details || "Keine Details"}</div>
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-950"><Paperclip className="size-4" />Attachments</p>
                      <TaskAttachments items={attachmentsByTask.get(task.id) ?? []} projectId={typedProject.id} taskId={task.id} />
                    </div>
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-950"><MessageSquare className="size-4" />Kommentare</p>
                      <TaskComments comments={commentsByTask.get(task.id) ?? []} projectId={typedProject.id} taskId={task.id} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
