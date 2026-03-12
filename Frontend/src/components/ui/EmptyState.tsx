import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
      <div className="p-4 rounded-full bg-samurai-border dark:bg-ninja-border">
        <Icon size={28} />
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="text-sm text-samurai-muted dark:text-ninja-muted max-w-sm">
        {description}
      </p>

      {action}
    </div>
  );
}