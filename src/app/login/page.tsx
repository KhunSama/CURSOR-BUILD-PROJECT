import Link from "next/link";
import { loginAction } from "@/features/auth/actions";
import { AuthForm, Field } from "@/shared/ui/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="font-display text-3xl text-gold">Log in</h1>
      <AuthForm action={loginAction} submit="Enter">
        <Field name="email" label="Email" type="email" />
        <Field name="password" label="Password" type="password" />
      </AuthForm>
      <p className="text-sm text-foreground/70">
        <Link href="/forgot-password" className="underline">
          Forgot password
        </Link>
        {" · "}
        <Link href="/register" className="underline">
          Create account
        </Link>
      </p>
    </main>
  );
}
