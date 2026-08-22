import { requireOnboarded } from "@/server/auth/guards";
import { AppNav } from "@/shared/ui/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireOnboarded();
  return (
    <div className="flex min-h-full flex-col">
      <AppNav name={session.name} />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
