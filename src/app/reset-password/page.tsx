import { resetPasswordAction } from "@/features/auth/actions";
import { AuthForm, Field } from "@/shared/ui/auth-form";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="font-display text-3xl text-gold">New password</h1>
      <AuthForm action={resetPasswordAction} submit="Save password">
        <input type="hidden" name="token" value={token ?? ""} />
        <Field name="password" label="New password" type="password" />
      </AuthForm>
    </main>
  );
}
