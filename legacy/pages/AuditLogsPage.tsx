import { useState, useMemo } from "react";
import { auditLogs, users, factories } from "../data/mockData";
import { AuditLog } from "../types";
import { FileSearch, Filter, User, Clock, Shield, Calendar } from "lucide-react";

export default function AuditLogsPage() {
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    entity: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filters.user && !log.userName.includes(filters.user)) return false;
      if (filters.action && log.action !== filters.action) return false;
      if (filters.entity && log.entity !== filters.entity) return false;
      return true;
    });
  }, [filters]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "bg-green-100 text-green-700";
      case "update": return "bg-blue-100 text-blue-700";
      case "delete": return "bg-red-100 text-red-700";
      case "approve": return "bg-emerald-100 text-emerald-700";
      case "reject": return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: "إنشاء",
      update: "تعديل",
      delete: "حذف",
      approve: "موافقة",
      reject: "رفض",
      login: "تسجيل دخول",
      logout: "تسجيل خروج",
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entity: string) => {
    const labels: Record<string, string> = {
      user: "مستخدم",
      factory: "مصنع",
      department: "قسم",
      worker: "عامل",
      driver: "سائق",
      shift_template: "قالب وردية",
      overtime_request: "طلب سهرات",
    };
    return labels[entity] || entity;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">سجلات المراجعة</h1>
          <p className="text-slate-500 mt-1">Audit Logs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">الفلاتر</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المستخدم</label>
            <input
              type="text"
              placeholder="اسم المستخدم..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الإجراء</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">الكل</option>
              <option value="create">إنشاء</option>
              <option value="update">تعديل</option>
              <option value="delete">حذف</option>
              <option value="approve">موافقة</option>
              <option value="reject">رفض</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الكيان</label>
            <select
              value={filters.entity}
              onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">الكل</option>
              <option value="user">مستخدم</option>
              <option value="factory">مصنع</option>
              <option value="department">قسم</option>
              <option value="worker">عامل</option>
              <option value="driver">سائق</option>
              <option value="overtime_request">طلب سهرات</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={() => setFilters({ user: "", action: "", entity: "", dateFrom: "", dateTo: "" })} className="w-full">
              مسح الفلاتر
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileSearch className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-slate-500">إجمالي السجلات</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{filteredLogs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-green-500" />
            <span className="text-sm text-slate-500">المستخدمين النشطين</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{new Set(filteredLogs.map(l => l.userId)).size}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-slate-500">عمليات الموافقة</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{filteredLogs.filter(l => l.action === "approve").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-slate-500">عمليات اليوم</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{filteredLogs.filter(l => l.createdAt.includes("2026")).length}</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الوقت</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المستخدم</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الإجراء</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الكيان</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {log.createdAt}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{log.userName.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-800">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{getEntityLabel(log.entity)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{log.details}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    لا توجد سجلات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Button({ variant, onClick, className, children }: { variant?: string; onClick?: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        variant === "outline" 
          ? "border border-slate-300 text-slate-700 hover:bg-slate-50" 
          : "bg-blue-900 text-white hover:bg-blue-800"
      } ${className || ""}`}
    >
      {children}
    </button>
  );
}