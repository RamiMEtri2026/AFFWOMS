import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "green" | "amber" | "purple" | "slate";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    value: "text-blue-900",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    value: "text-green-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    value: "text-purple-700",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "bg-slate-100 text-slate-600",
    value: "text-slate-800",
  },
};

export default function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-xl p-5 border border-slate-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${classes.value}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${classes.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}