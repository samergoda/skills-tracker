"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";

export default function SubmitButton({ text, disabled }: { text: string; disabled: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  return (
    <Button type="submit" disabled={isPending || disabled}>
      {text}
    </Button>
  );
}
