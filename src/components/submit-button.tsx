"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  pendingLabel: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
};

export function SubmitButton({
  pendingLabel,
  children,
  variant = "default",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} disabled={pending} type="submit" variant={variant}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
