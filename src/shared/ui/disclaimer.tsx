export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`text-amber-200/80 ${compact ? "text-xs" : "text-sm"}`}>
      Estimates only — not medical advice. Review AI results before they count.
    </p>
  );
}
