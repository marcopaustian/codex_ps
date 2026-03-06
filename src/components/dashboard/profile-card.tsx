import { updateProfile } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/lib/types/dashboard";

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="border-zinc-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Eigener Anzeigename und Rolle aus `public.profiles`.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-zinc-600">
        <div>
          <p className="font-medium text-zinc-950">E-Mail</p>
          <p>{profile.email}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-950">Rolle</p>
          <p>{profile.role}</p>
        </div>
        <form action={updateProfile} className="flex flex-col gap-3">
          <Input defaultValue={profile.display_name} name="display_name" required />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Speichere..." variant="outline">
              Profil speichern
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
