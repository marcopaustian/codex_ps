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
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  inserted_at: string;
  updated_at: string;
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
