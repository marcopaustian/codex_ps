import { createProject } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProjectComposer() {
  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Projekt anlegen</CardTitle>
        <CardDescription>Ein Projekt kapselt einen Arbeitsbereich mit eigenen Tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createProject} className="flex flex-col gap-3">
          <Input maxLength={120} name="name" placeholder="Projektname" required />
          <textarea
            className="min-h-24 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            name="description"
            placeholder="Kurzbeschreibung"
          />
          <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue="idea" name="stage">
            <option value="idea">Idea</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="done">Done</option>
          </select>
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Speichere...">Projekt anlegen</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
