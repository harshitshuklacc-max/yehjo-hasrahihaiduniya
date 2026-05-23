export function StatCards({ stats }: { stats: { label: string; value: string | number; sub?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <p className="text-2xl font-bold gradient-text">{s.value}</p>
          <p className="text-sm font-medium mt-1">{s.label}</p>
          {s.sub && <p className="text-xs text-ssa-muted">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
}

export function SimpleBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-sm mb-1">
            <span>{d.label}</span>
            <span className="text-ssa-muted">{d.value}</span>
          </div>
          <div className="h-2 rounded-full bg-ssa-card overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ssa-primary to-ssa-secondary transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
