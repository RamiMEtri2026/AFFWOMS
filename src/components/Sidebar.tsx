import { User } from "../types";
import { Home, Users, Factory, Building2, Briefcase, Truck, Clock, FileText, Activity, Bell, Settings, FileSearch, BarChart3 } from "lucide-react";

interface SidebarProps {
  user: User;
  isOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: Home },
  { id: "users", label: "المستخدمين", icon: Users, roles: ["super_admin"] },
  { id: "factories", label: "المصانع", icon: Factory },
  { id: "departments", label: "الأقسام", icon: Building2 },
  { id: "workers", label: "العمال", icon: Briefcase },
  { id: "drivers", label: "السائقين والمركبات", icon: Truck },
  { id: "shift-templates", label: "قوالب الورديات", icon: Clock },
  { id: "overtime-requests", label: "طلبات السهرات", icon: FileText },
  { id: "active-shifts", label: "الورديات النشطة", icon: Activity },
  { id: "reports", label: "التقارير", icon: BarChart3 },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "settings", label: "الإعدادات", icon: Settings },
  { id: "audit-logs", label: "سجلات المراجعة", icon: FileSearch, roles: ["super_admin"] },
];

export default function Sidebar({ user, isOpen, currentPage, onNavigate }: SidebarProps) {
  const filteredItems = menuItems.filter(item => !item.roles || item.roles.includes(user.role));

  return (
    <aside className={`${isOpen ? "w-64" : "w-20"} bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-blue-800">
        <img src="https://af-f.com/aff-logo-colored.png" alt="AFF Logo" className="h-10 mx-auto" />
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === item.id ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-800">
        <p className="text-xs text-blue-300 text-center">
          {isOpen && "© 2026 AFF"}
        </p>
      </div>
    </aside>
  );
}