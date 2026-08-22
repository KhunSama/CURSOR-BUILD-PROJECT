import Link from "next/link";
import { registerAction } from "@/features/auth/actions";
import { AuthForm, Field } from "@/shared/ui/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="font-display text-3xl text-gold">Create account</h1>
      <AuthForm action={registerAction} submit="Join the quest">
        <Field name="name" label="Display name" />
        <Field name="email" label="Email" type="email" />
        <Field name="password" label="Password (min 8)" type="password" />
      </AuthForm>
      <p className="text-sm">
        Already in?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
