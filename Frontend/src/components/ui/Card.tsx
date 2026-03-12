import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div
      className="
      p-6
      rounded-xl
      border
      border-samurai-border dark:border-ninja-border
      bg-samurai-card dark:bg-[#14141b]
      shadow-sm
      hover:shadow-lg
      transition-all
      duration-200
      "
    >
      {children}
    </div>
  );
}