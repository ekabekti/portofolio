interface BadgeProps {
  label: string;
  variant?: "default" | "warn" | "lilac";
  className?: string;
}

export default function Badge({ label, variant = "default", className = "" }: BadgeProps) {
  const variantClass = variant === "warn" ? "badge--warn" : variant === "lilac" ? "badge--lilac" : "";
  return <span className={`badge ${variantClass} ${className}`}>{label}</span>;
}
