import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectActivity } from "@/lib/types/dashboard";

type ActivityFeedProps = {
  items: ProjectActivity[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Aktivitaet</CardTitle>
        <CardDescription>Laufende Historie der wichtigsten Projektereignisse.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-600">Noch keine Aktivitaet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-zinc-950">{item.actor?.display_name || item.actor?.email || item.actor_id}</span>
                <span className="text-xs text-zinc-500">{formatDate(item.inserted_at)}</span>
              </div>
              <p className="mt-2 text-zinc-700">{item.message}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{item.event_type}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
