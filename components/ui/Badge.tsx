interface BadgeProps {
  label: string;
  variant?: "accent" | "muted" | "success" | "warning";
}

const variants = {
  accent: "bg-accent/10 text-accent border-accent/20",
  muted: "bg-muted/10 text-muted border-muted/20",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Badge({ label, variant = "accent" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
