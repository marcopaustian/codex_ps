"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nicht angemeldet.");
  }

  return { supabase, user };
}

async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Admin-Rechte erforderlich.");
  }

  return { supabase, user };
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = normalizeText(formData.get("name"));
  const description = normalizeText(formData.get("description"));
  const stage = normalizeText(formData.get("stage")) || "idea";

  if (!name) throw new Error("Projektname fehlt.");

  const { error } = await supabase.from("projects").insert({ owner_id: user.id, name, description, stage });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard");
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

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    owner_id: user.id,
    title,
    details,
    priority,
    due_date: dueDate,
  });
  if (error) throw new Error(error.message);

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

  const { error } = await supabase
    .from("tasks")
    .update({ title, details, status, priority, due_date: dueDate })
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard");
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function deleteTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = normalizeText(formData.get("id"));
  const projectId = normalizeText(formData.get("project_id"));

  if (!id) throw new Error("Task-ID fehlt.");

  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard");
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
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

  const { error } = await supabase.from("task_comments").insert({
    task_id: taskId,
    author_id: user.id,
    body,
  });
  if (error) throw new Error(error.message);

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
