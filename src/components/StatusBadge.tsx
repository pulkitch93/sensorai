import { cn } from "@/lib/utils";
import { AssetStatus } from "@/types/asset";

interface StatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    healthy: "bg-success/20 text-success border-success/40",
    warning: "bg-warning/20 text-warning border-warning/40",
    critical: "bg-destructive/20 text-destructive border-destructive/40",
    offline: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    healthy: "Healthy",
    warning: "Warning",
    critical: "Critical",
    offline: "Offline",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
};
