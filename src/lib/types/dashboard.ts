export type Profile = {
  id: string;
  email: string;
  display_name: string;
  role: "member" | "admin";
};

export type Project = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  stage: "idea" | "active" | "paused" | "done";
  inserted_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  owner_id: string;
  title: string;
  details: string;
  status: "backlog" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  inserted_at: string;
  updated_at: string;
};

export type ProjectMember = {
  project_id: string;
  user_id: string;
  role: "member" | "manager";
  inserted_at: string;
  profile?: Pick<Profile, "id" | "display_name" | "email" | "role"> | null;
};

export type ProjectActivity = {
  id: string;
  project_id: string;
  actor_id: string;
  event_type: string;
  message: string;
  inserted_at: string;
  actor?: Pick<Profile, "id" | "display_name" | "email" | "role"> | null;
};

export type TaskAttachment = {
  id: string;
  task_id: string;
  uploader_id: string;
  file_name: string;
  file_url: string;
  file_size_bytes: number;
  inserted_at: string;
};

export type TaskComment = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  inserted_at: string;
  updated_at: string;
  author?: Pick<Profile, "id" | "display_name" | "email" | "role"> | null;
};
