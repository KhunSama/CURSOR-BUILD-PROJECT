import { forgotPasswordAction } from "@/features/auth/actions";
import { AuthForm, Field } from "@/shared/ui/auth-form";

export default function ForgotPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="font-display text-3xl text-gold">Reset password</h1>
      <p className="text-sm text-foreground/70">
        This demo has no email server. If the account exists, a one-hour reset
        link is shown on the next screen.
      </p>
      <AuthForm action={forgotPasswordAction} submit="Generate reset link">
        <Field name="email" label="Email" type="email" />
      </AuthForm>
    </main>
  );
}
