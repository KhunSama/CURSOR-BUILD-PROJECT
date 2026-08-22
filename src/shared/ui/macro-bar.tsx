export function MacroBar({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-gold">
          {Math.round(value)} / {max}
          {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stroke">
        <div
          className="h-full rounded-full bg-mint"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
