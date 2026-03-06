import { addProjectMember } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectMember } from "@/lib/types/dashboard";

type ProjectMembersCardProps = {
  projectId: string;
  members: ProjectMember[];
};

export function ProjectMembersCard({ projectId, members }: ProjectMembersCardProps) {
  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>Weitere Nutzer per E-Mail in das Projekt aufnehmen.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={addProjectMember} className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <input name="project_id" type="hidden" value={projectId} />
          <label className="grid gap-2 text-sm text-zinc-700">
            <span>E-Mail</span>
            <input className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" name="email" placeholder="mitglied@example.com" required type="email" />
          </label>
          <label className="grid gap-2 text-sm text-zinc-700">
            <span>Rolle</span>
            <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue="member" name="role">
              <option value="member">member</option>
              <option value="manager">manager</option>
            </select>
          </label>
          <SubmitButton pendingLabel="Speichere..." variant="outline">Mitglied hinzufuegen</SubmitButton>
        </form>
        <div className="grid gap-2">
          {members.length === 0 ? (
            <p className="text-sm text-zinc-600">Noch keine zusaetzlichen Mitglieder.</p>
          ) : (
            members.map((member) => (
              <div key={member.user_id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <p className="font-medium text-zinc-950">{member.profile?.display_name || member.profile?.email || member.user_id}</p>
                <p className="text-zinc-600">{member.profile?.email} | {member.role}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
