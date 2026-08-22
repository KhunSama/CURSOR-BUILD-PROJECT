"use client";

import { useActionState } from "react";
import type { AuthState } from "@/features/auth/actions";

export function AuthForm({
  action,
  submit,
  children,
}: {
  action: (state: AuthState, data: FormData) => Promise<AuthState>;
  submit: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {} as AuthState);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      {children}
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state.resetUrl ? (
        <p className="text-sm text-mint">
          Demo reset link:{" "}
          <a className="underline" href={state.resetUrl}>
            {state.resetUrl}
          </a>
        </p>
      ) : null}
      <button
        disabled={pending}
        className="rounded-lg bg-gold px-4 py-2 font-display text-background disabled:opacity-60"
        type="submit"
      >
        {pending ? "Working…" : submit}
      </button>
    </form>
  );
}

export function Field({
  name,
  label,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        className="rounded-md border border-stroke bg-panel px-3 py-2"
        name={name}
        type={type}
        required={required}
      />
    </label>
  );
}
