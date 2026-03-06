import { signOut } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        Abmelden
      </Button>
    </form>
  );
}
