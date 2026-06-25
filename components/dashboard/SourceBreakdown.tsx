"use client";

interface SourceEntry {
  value: string;
  count: number;
}

interface Props {
  bySource: SourceEntry[];
  byMedium: SourceEntry[];
}

function BreakdownList({
  items,
  label,
}: {
  items: SourceEntry[];
  label: string;
}) {
  const total = items.reduce((s, i) => s + i.count, 0);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
        {label}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Aucune donnée</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <li key={item.value}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground font-medium">
                    {item.value}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    {item.count} · {pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-card-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SourceBreakdown({ bySource, byMedium }: Props) {
  const hasData = bySource.length > 0 || byMedium.length > 0;

  if (!hasData) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
        <span className="text-3xl block mb-3">🔍</span>
        <p className="text-sm text-foreground font-medium mb-1">
          Aucune source trackée
        </p>
        <p className="text-sm text-muted">
          Ajoutez{" "}
          <span className="font-mono text-xs bg-card-hover px-1.5 py-0.5 rounded">
            ?utm_source=...
          </span>{" "}
          à vos liens d&apos;acquisition pour voir l&apos;origine de vos utilisateurs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-8">
        <BreakdownList items={bySource} label="Source" />
        <BreakdownList items={byMedium} label="Medium" />
      </div>
    </div>
  );
}
