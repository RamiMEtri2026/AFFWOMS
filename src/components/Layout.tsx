import { useState } from "react";
import { User } from "../types";
import { Menu, X, Bell, LogOut, ChevronDown, LayoutDashboard, Users, Factory, Building2, UserCog, Truck, Clock, FileText, BarChart3, Settings, FileSearch, ClipboardList } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

interface LayoutProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: User["role"][];
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, roles: ["super_admin", "manager", "supervisor", "viewer"] },
  { id: "users", label: "المستخدمين", icon: Users, roles: ["super_admin"] },
  { id: "factories", label: "المصانع", icon: Factory, roles: ["super_admin"] },
  { id: "departments", label: "الأقسام", icon: Building2, roles: ["super_admin", "manager"] },
  { id: "workers", label: "العمال", icon: UserCog, roles: ["super_admin", "manager"] },
  { id: "drivers", label: "السائقين والمركبات", icon: Truck, roles: ["super_admin", "manager"] },
  { id: "shifts", label: "قوالب الورديات", icon: Clock, roles: ["super_admin", "manager"] },
  { id: "requests", label: "طلبات السهرات", icon: FileText, roles: ["super_admin", "manager", "supervisor"] },
  { id: "active-shifts", label: "الورديات النشطة", icon: ClipboardList, roles: ["super_admin", "manager", "supervisor"] },
  { id: "reports", label: "التقارير", icon: BarChart3, roles: ["super_admin", "manager"] },
  { id: "notifications", label: "الإشعارات", icon: Bell, roles: ["super_admin", "manager", "supervisor"] },
  { id: "settings", label: "الإعدادات", icon: Settings, roles: ["super_admin"] },
  { id: "audit-logs", label: "سجلات المراجعة", icon: FileSearch, roles: ["super_admin"] },
];

export default function Layout({ user, currentPage, onNavigate, onLogout, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  if (!user) return null;

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role));
  const userInitial = user.name ? user.name.charAt(0) : "؟";

  const getRoleLabel = (role: User["role"]): string => {
    switch (role) {
      case "super_admin": return "مدير عام";
      case "manager": return "مدير مصنع";
      case "supervisor": return "مشرف";
      case "viewer": return "عرض فقط";
      default: return "مستخدم";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <img src="https://af-f.com/aff-logo-colored.png" alt="AFF Logo" className="h-10" />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("notifications")} className="relative p-2 hover:bg-slate-100 rounded-lg">
              <Bell className="w-6 h-6 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{userInitial}</span>
                </div>
                <div className="hidden md:block text-right">
                  <span className="font-medium text-slate-800 block">{user.name || "مستخدم"}</span>
                  <span className="text-xs text-slate-500">{user.jobTitle || getRoleLabel(user.role)}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{user.name || "مستخدم"}</p>
                    <p className="text-sm text-slate-600">{user.jobTitle || "غير محدد"}</p>
                    <p className="text-xs text-slate-400">{user.email || ""}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-slate-50">
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 right-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="lg:mr-64 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="lg:mr-64 bg-white border-t border-slate-200 py-4">
        <div className="text-center text-sm text-slate-500">© 2026 Aromatic Flavours & Fragrances. All Rights Reserved.</div>
      </footer>
    </div>
  );
}