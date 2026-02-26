"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";

export default function SubmitButton({ text, disabled }: { text: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button type="submit" disabled={isPending || disabled}>
      {text}
    </Button>
  );
}
