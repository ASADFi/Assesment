import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-700",
  Accessories: "bg-purple-100 text-purple-700",
  Furniture: "bg-amber-100 text-amber-700",
  Footwear: "bg-green-100 text-green-700",
  Lifestyle: "bg-pink-100 text-pink-700",
  Sports: "bg-orange-100 text-orange-700",
};

interface BadgeProps {
  label: string;
  className?: string;
}

export const Badge = ({ label, className }: BadgeProps) => {
  const color = categoryColors[label] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium",
        color,
        className
      )}
    >
      {label}
    </span>
  );
};
