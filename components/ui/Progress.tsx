interface ProgressProps {
  current: number;
  total: number;
  labels?: string[];
}

export default function Progress({ current, total, labels }: ProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-muted font-medium">
          Étape {current} sur {total}
        </span>
        <span className="text-xs text-accent font-semibold">{percentage}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {labels && (
        <div className="flex justify-between mt-2">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`text-xs ${i < current ? "text-accent" : "text-muted"}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
