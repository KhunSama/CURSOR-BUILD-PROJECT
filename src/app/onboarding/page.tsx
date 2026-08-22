import { OnboardingForm } from "./onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="font-display text-3xl text-gold">Create your character sheet</h1>
      <p className="text-sm text-foreground/75">
        We use this only to suggest a calorie and macro range. You can edit the
        numbers later. Targets stay in a moderate band — this app will not push
        crash diets.
      </p>
      <OnboardingForm />
    </main>
  );
}
