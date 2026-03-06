import { deleteNote, updateNote } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Note = {
  id: string;
  title: string;
  content: string;
  inserted_at: string;
  updated_at: string;
};

type NotesListProps = {
  notes: Note[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <Card className="border-dashed border-zinc-300 bg-white/80">
        <CardHeader>
          <CardTitle>Noch keine Notizen</CardTitle>
          <CardDescription>
            Lege oben die erste Notiz an. Durch RLS siehst nur du deine eigenen Eintraege.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {notes.map((note) => (
        <Card key={note.id} className="border-zinc-200/80 bg-white/90">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{note.title}</CardTitle>
                <CardDescription>
                  Erstellt: {formatDate(note.inserted_at)} | Aktualisiert: {formatDate(note.updated_at)}
                </CardDescription>
              </div>
              <form action={deleteNote}>
                <input name="id" type="hidden" value={note.id} />
                <SubmitButton pendingLabel="Loesche..." variant="outline">
                  Loeschen
                </SubmitButton>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <form action={updateNote} className="flex flex-col gap-3">
              <input name="id" type="hidden" value={note.id} />
              <Input defaultValue={note.title} maxLength={120} name="title" required />
              <textarea
                className="min-h-32 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
                defaultValue={note.content}
                name="content"
                placeholder="Notizinhalt"
              />
              <div className="flex justify-end">
                <SubmitButton pendingLabel="Aktualisiere..." variant="outline">
                  Aenderungen speichern
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
