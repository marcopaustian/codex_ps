import { addTaskComment } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaskComment } from "@/lib/types/dashboard";

type TaskCommentsProps = {
  projectId: string;
  taskId: string;
  comments: TaskComment[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function TaskComments({ projectId, taskId, comments }: TaskCommentsProps) {
  return (
    <Card className="border-zinc-200/80 bg-zinc-50/80">
      <CardHeader>
        <CardTitle className="text-base">Kommentare</CardTitle>
        <CardDescription>Projektbezogene Diskussion direkt am Task.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={addTaskComment} className="grid gap-3">
          <input name="project_id" type="hidden" value={projectId} />
          <input name="task_id" type="hidden" value={taskId} />
          <textarea className="min-h-20 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400" name="body" placeholder="Kommentar schreiben" required />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Speichere..." variant="outline">Kommentar senden</SubmitButton>
          </div>
        </form>
        <div className="grid gap-3">
          {comments.length === 0 ? (
            <p className="text-sm text-zinc-600">Noch keine Kommentare.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-zinc-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-zinc-950">{comment.author?.display_name || comment.author?.email || "Unbekannt"}</span>
                  <span className="text-xs text-zinc-500">{formatDate(comment.inserted_at)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-zinc-700">{comment.body}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
