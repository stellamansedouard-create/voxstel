interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export default function Spinner({ size = "md", label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-border border-t-accent animate-spin`}
      />
      {label && <p className="text-sm text-muted animate-pulse">{label}</p>}
    </div>
  );
}
