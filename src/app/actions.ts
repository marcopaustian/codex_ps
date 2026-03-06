"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet.");
  return { supabase, user };
}

async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Admin-Rechte erforderlich.");
  return { supabase, user };
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

async function logProjectActivity(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string, actorId: string, eventType: string, message: string) {
  await supabase.from("project_activity").insert({ project_id: projectId, actor_id: actorId, event_type: eventType, message });
}

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = normalizeText(formData.get("name"));
  const description = normalizeText(formData.get("description"));
  const stage = normalizeText(formData.get("stage")) || "idea";
  if (!name) throw new Error("Projektname fehlt.");

  const { data, error } = await supabase.from("projects").insert({ owner_id: user.id, name, description, stage }).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Projekt konnte nicht erstellt werden.");

  await logProjectActivity(supabase, data.id, user.id, "project_created", `Projekt \"${name}\" wurde erstellt.`);
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function addProjectMember(formData: FormData) {
  const { supabase, user } = await requireUser();
  const projectId = normalizeText(formData.get("project_id"));
  const email = normalizeText(formData.get("email")).toLowerCase();
  const role = normalizeText(formData.get("role")) || "member";
  if (!projectId || !email) throw new Error("Projekt oder E-Mail fehlt.");

  const [{ data: project }, { data: targetProfile }] = await Promise.all([
    supabase.from("projects").select("id, owner_id, name").eq("id", projectId).single(),
    supabase.from("profiles").select("id, email, display_name").eq("email", email).single(),
  ]);

  if (!project) throw new Error("Projekt nicht gefunden.");
  if (project.owner_id !== user.id) throw new Error("Nur Projekt-Owner duerfen Mitglieder hinzufuegen.");
  if (!targetProfile) throw new Error("Kein Nutzer mit dieser E-Mail gefunden.");

  const { error } = await supabase.from("project_members").upsert({ project_id: projectId, user_id: targetProfile.id, role });
  if (error) throw new Error(error.message);

  await logProjectActivity(supabase, projectId, user.id, "member_added", `${targetProfile.email} wurde als ${role} hinzugefuegt.`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function createTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const projectId = normalizeText(formData.get("project_id"));
  const title = normalizeText(formData.get("title"));
  const details = normalizeText(formData.get("details"));
  const priority = normalizeText(formData.get("priority")) || "medium";
  const dueDate = normalizeText(formData.get("due_date")) || null;
  if (!projectId || !title) throw new Error("Projekt oder Titel fehlt.");

  const { data: project, error: projectError } = await supabase.from("projects").select("id").eq("id", projectId).single();
  if (projectError || !project) throw new Error("Projekt nicht gefunden.");

  const { error } = await supabase.from("tasks").insert({ project_id: projectId, owner_id: user.id, title, details, priority, due_date: dueDate });
  if (error) throw new Error(error.message);

  await logProjectActivity(supabase, projectId, user.id, "task_created", `Task \"${title}\" wurde angelegt.`);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function updateTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = normalizeText(formData.get("id"));
  const title = normalizeText(formData.get("title"));
  const details = normalizeText(formData.get("details"));
  const status = normalizeText(formData.get("status")) || "todo";
  const priority = normalizeText(formData.get("priority")) || "medium";
  const dueDate = normalizeText(formData.get("due_date")) || null;
  const projectId = normalizeText(formData.get("project_id"));
  if (!id || !title) throw new Error("Task-Daten unvollstaendig.");

  const { error } = await supabase.from("tasks").update({ title, details, status, priority, due_date: dueDate }).eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error(error.message);

  if (projectId) {
    await logProjectActivity(supabase, projectId, user.id, "task_updated", `Task \"${title}\" wurde aktualisiert.`);
  }
  revalidatePath("/");
  revalidatePath("/dashboard");
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function deleteTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = normalizeText(formData.get("id"));
  const projectId = normalizeText(formData.get("project_id"));
  const title = normalizeText(formData.get("title"));
  if (!id) throw new Error("Task-ID fehlt.");

  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error(error.message);

  if (projectId) {
    await logProjectActivity(supabase, projectId, user.id, "task_deleted", `Task \"${title || id}\" wurde geloescht.`);
  }
  revalidatePath("/");
  revalidatePath("/dashboard");
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function addTaskAttachment(formData: FormData) {
  const { supabase, user } = await requireUser();
  const projectId = normalizeText(formData.get("project_id"));
  const taskId = normalizeText(formData.get("task_id"));
  const fileName = normalizeText(formData.get("file_name"));
  const fileUrl = normalizeText(formData.get("file_url"));
  const fileSizeBytes = Number(normalizeText(formData.get("file_size_bytes")) || "0");
  if (!projectId || !taskId || !fileName || !fileUrl) throw new Error("Attachment-Daten unvollstaendig.");

  const { error } = await supabase.from("task_attachments").insert({
    task_id: taskId,
    uploader_id: user.id,
    file_name: fileName,
    file_url: fileUrl,
    file_size_bytes: Number.isFinite(fileSizeBytes) ? fileSizeBytes : 0,
  });
  if (error) throw new Error(error.message);

  await logProjectActivity(supabase, projectId, user.id, "attachment_added", `Attachment \"${fileName}\" wurde hinzugefuegt.`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const displayName = normalizeText(formData.get("display_name"));
  if (!displayName) throw new Error("Anzeigename fehlt.");
  const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function updateUserRole(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const targetId = normalizeText(formData.get("target_id"));
  const role = normalizeText(formData.get("role"));
  if (!targetId || !role) throw new Error("Rollen-Daten fehlen.");
  if (targetId === user.id) throw new Error("Eigene Rolle hier nicht aendern.");
  const { error } = await supabase.from("profiles").update({ role }).eq("id", targetId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function addTaskComment(formData: FormData) {
  const { supabase, user } = await requireUser();
  const taskId = normalizeText(formData.get("task_id"));
  const body = normalizeText(formData.get("body"));
  const projectId = normalizeText(formData.get("project_id"));
  if (!taskId || !body) throw new Error("Kommentar unvollstaendig.");
  const { error } = await supabase.from("task_comments").insert({ task_id: taskId, author_id: user.id, body });
  if (error) throw new Error(error.message);
  if (projectId) await logProjectActivity(supabase, projectId, user.id, "comment_added", "Ein neuer Kommentar wurde hinzugefuegt.");
  revalidatePath("/dashboard");
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/");
}
