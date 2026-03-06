import { createNote } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NoteComposer() {
  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Neue Notiz</CardTitle>
        <CardDescription>
          Erstellt serverseitig in Supabase und wird nach dem Submit direkt neu geladen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createNote} className="flex flex-col gap-3">
          <Input maxLength={120} name="title" placeholder="Titel" required />
          <textarea
            className="min-h-32 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
            name="content"
            placeholder="Notizinhalt"
          />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Speichere...">Notiz anlegen</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
