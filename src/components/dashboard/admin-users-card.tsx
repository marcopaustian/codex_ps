import { updateUserRole } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/lib/types/dashboard";

type AdminUsersCardProps = {
  currentUserId: string;
  profiles: Profile[];
};

export function AdminUsersCard({ currentUserId, profiles }: AdminUsersCardProps) {
  const manageableProfiles = profiles.filter((profile) => profile.id !== currentUserId);

  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Admin: Rollen verwalten</CardTitle>
        <CardDescription>Admins koennen hier andere Nutzer zwischen `member` und `admin` umstellen.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {manageableProfiles.length === 0 ? (
          <p className="text-sm text-zinc-600">Noch keine weiteren Nutzer vorhanden.</p>
        ) : (
          manageableProfiles.map((profile) => (
            <form key={profile.id} action={updateUserRole} className="grid gap-3 rounded-2xl border border-zinc-200 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
              <input name="target_id" type="hidden" value={profile.id} />
              <div>
                <p className="font-medium text-zinc-950">{profile.display_name}</p>
                <p className="text-sm text-zinc-600">{profile.email}</p>
              </div>
              <select className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" defaultValue={profile.role} name="role">
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
              <SubmitButton pendingLabel="Speichere..." variant="outline">Rolle setzen</SubmitButton>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  );
}
