"use client";

import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setIsPending(false);
      return;
    }

    setMessage("Magic Link wurde versendet. Nach dem Klick landest du direkt im Dashboard.");
    setEmail("");
    setIsPending(false);
  }

  return (
    <Card className="border-amber-200/60 bg-white/92 shadow-[0_20px_50px_-35px_rgba(120,70,10,0.4)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-amber-600" />Baytomat Flowboard Login</CardTitle>
        <CardDescription>
          Melde dich per Magic Link an und springe direkt in dein Planner-Dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              autoComplete="email"
              className="pl-9"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@baytomat.de"
              required
              type="email"
              value={email}
            />
          </div>
          <Button className="rounded-full" disabled={isPending} type="submit">
            {isPending ? "Sende Link..." : "Mit Magic Link anmelden"}
          </Button>
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
