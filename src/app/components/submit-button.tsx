"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  showArrow?: boolean;
};

export function SubmitButton({
  idleLabel,
  pendingLabel,
  showArrow = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : idleLabel}
      {!pending && showArrow && <span aria-hidden="true">→</span>}
    </button>
  );
}
