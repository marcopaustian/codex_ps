import { createTask } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Project } from "@/lib/types/dashboard";

type TaskComposerProps = {
  projects: Project[];
};

export function TaskComposer({ projects }: TaskComposerProps) {
  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Task anlegen</CardTitle>
        <CardDescription>Tasks werden einem Projekt zugeordnet und direkt in den Flowboard-Prozess einsortiert.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createTask} className="flex flex-col gap-3">
          <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" name="project_id" required>
            <option value="">Projekt waehlen</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <Input maxLength={160} name="title" placeholder="Task-Titel" required />
          <textarea className="min-h-24 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400" name="details" placeholder="Details" />
          <div className="grid gap-3 md:grid-cols-3">
            <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue="backlog" name="status">
              <option value="backlog">Backlog</option>
              <option value="in_progress">In Arbeit</option>
              <option value="review">Review</option>
              <option value="done">Erledigt</option>
            </select>
            <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue="medium" name="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Input name="due_date" type="date" />
          </div>
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Speichere...">Task anlegen</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
