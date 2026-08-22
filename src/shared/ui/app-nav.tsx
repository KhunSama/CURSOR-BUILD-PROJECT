import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/meals", label: "Meals" },
  { href: "/meals/new", label: "Log" },
  { href: "/coach", label: "Coach" },
  { href: "/quests", label: "Quests" },
  { href: "/achievements", label: "Badges" },
  { href: "/progress", label: "Progress" },
  { href: "/profile", label: "Profile" },
];

export function AppNav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-stroke/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/dashboard" className="font-display text-lg text-gold">
          Calorie Quest
        </Link>
        <nav className="flex flex-1 flex-wrap gap-3 text-sm">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-foreground/80 hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="text-sm text-foreground/70 hover:text-gold" type="submit">
            Log out {name}
          </button>
        </form>
      </div>
    </header>
  );
}
