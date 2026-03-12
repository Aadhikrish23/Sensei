import { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div
      className="
      bg-samurai-card dark:bg-ninja-card
      border border-samurai-border dark:border-ninja-border
      rounded-xl
      p-5
      flex items-center gap-4
      transition
      hover:shadow-md
      "
    >
      <div
        className="
        p-3 rounded-lg
        bg-samurai-primary/10
        dark:bg-ninja-primary/20
        text-samurai-primary
        dark:text-ninja-accent
        "
      >
        <Icon size={22} />
      </div>

      <div>
        <p className="text-sm text-samurai-muted dark:text-ninja-muted">
          {label}
        </p>

        <p className="text-xl font-bold text-samurai-text dark:text-ninja-text">
          {value}
        </p>
      </div>
    </div>
  );
}