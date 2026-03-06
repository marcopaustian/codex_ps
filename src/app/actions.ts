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

export async function createNote(formData: FormData) {
  const { supabase, user } = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title) {
    throw new Error("Titel fehlt.");
  }

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title,
    content,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function updateNote(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!id || !title) {
    throw new Error("Unvollstaendige Notizdaten.");
  }

  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteNote(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Notiz-ID fehlt.");
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
