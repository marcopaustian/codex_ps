import { addTaskAttachment } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaskAttachment } from "@/lib/types/dashboard";

type TaskAttachmentsProps = {
  projectId: string;
  taskId: string;
  items: TaskAttachment[];
};

export function TaskAttachments({ projectId, taskId, items }: TaskAttachmentsProps) {
  return (
    <Card className="border-zinc-200/80 bg-zinc-50/80">
      <CardHeader>
        <CardTitle className="text-base">Attachments</CardTitle>
        <CardDescription>Datei-Links oder Upload-Ziele am Task hinterlegen.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={addTaskAttachment} className="grid gap-3">
          <input name="project_id" type="hidden" value={projectId} />
          <input name="task_id" type="hidden" value={taskId} />
          <input className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" name="file_name" placeholder="Dateiname" required />
          <input className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" name="file_url" placeholder="https://..." required type="url" />
          <input className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" min="0" name="file_size_bytes" placeholder="Groesse in Bytes" type="number" />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Speichere..." variant="outline">Attachment hinzufuegen</SubmitButton>
          </div>
        </form>
        <div className="grid gap-2">
          {items.length === 0 ? (
            <p className="text-sm text-zinc-600">Noch keine Attachments.</p>
          ) : (
            items.map((item) => (
              <a key={item.id} className="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 underline-offset-4 hover:underline" href={item.file_url} rel="noreferrer" target="_blank">
                {item.file_name} {item.file_size_bytes > 0 ? `(${item.file_size_bytes} B)` : ""}
              </a>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
