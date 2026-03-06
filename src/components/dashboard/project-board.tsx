import Link from "next/link";

import { deleteTask, updateTask } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Project, Task } from "@/lib/types/dashboard";

type ProjectBoardProps = {
  projects: Project[];
  tasks: Task[];
};

function formatDate(value: string | null) {
  if (!value) return "Kein Termin";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(value));
}

export function ProjectBoard({ projects, tasks }: ProjectBoardProps) {
  if (projects.length === 0) {
    return (
      <Card className="border-dashed border-zinc-300 bg-white/80">
        <CardHeader>
          <CardTitle>Noch keine Projekte</CardTitle>
          <CardDescription>Lege dein erstes Projekt an und haenge danach Tasks darunter.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {projects.map((project) => {
        const projectTasks = tasks.filter((task) => task.project_id === project.id);

        return (
          <Card key={project.id} className="border-zinc-200/80 bg-white/90">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    Stage: {project.stage} | {project.description || "Keine Beschreibung"}
                  </CardDescription>
                </div>
                <Link className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline" href={`/dashboard/projects/${project.id}`}>
                  Details
                </Link>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {projectTasks.length === 0 ? (
                <p className="text-sm text-zinc-600">Fuer dieses Projekt gibt es noch keine Tasks.</p>
              ) : (
                projectTasks.map((task) => (
                  <form key={task.id} action={updateTask} className="grid gap-3 rounded-2xl border border-zinc-200 p-4">
                    <input name="id" type="hidden" value={task.id} />
                    <input name="project_id" type="hidden" value={project.id} />
                    <Input defaultValue={task.title} name="title" required />
                    <textarea className="min-h-24 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400" defaultValue={task.details} name="details" />
                    <div className="grid gap-3 md:grid-cols-3">
                      <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue={task.status} name="status">
                        <option value="todo">Todo</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                      <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue={task.priority} name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <Input defaultValue={task.due_date ?? ""} name="due_date" type="date" />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs text-zinc-500">
                      <span>Faellig: {formatDate(task.due_date)}</span>
                      <SubmitButton pendingLabel="Speichere..." variant="outline">Speichern</SubmitButton>
                    </div>
                  </form>
                ))
              )}
              <div className="flex flex-wrap gap-2">
                {projectTasks.map((task) => (
                  <form key={`${task.id}-delete`} action={deleteTask}>
                    <input name="id" type="hidden" value={task.id} />
                    <input name="project_id" type="hidden" value={project.id} />
                    <input name="title" type="hidden" value={task.title} />
                    <SubmitButton pendingLabel="Loesche..." variant="outline">{task.title} loeschen</SubmitButton>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
