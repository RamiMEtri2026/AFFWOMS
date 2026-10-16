import { useState } from "react";
import { FileSearch, User, Clock, Filter, CheckCircle, XCircle, Plus, Edit, Trash2 } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userName: string;
  details: string;
  createdAt: string;
}

const mockLogs: AuditLog[] = [
  { id: "1", action: "إنشاء", entity: "طلب سهرات", entityId: "OT-2026-0001", userName: "Peter Saidhom", details: "تم إنشاء طلب سهرات جديد لمصنع F4", createdAt: "2026-01-15 10:30:00" },
  { id: "2", action: "موافقة", entity: "طلب سهرات", entityId: "OT-2026-0001", userName: "Maged Samir", details: "تم الموافقة على الطلب", createdAt: "2026-01-15 11:00:00" },
  { id: "3", action: "تعديل", entity: "مستخدم", entityId: "U003", userName: "Peter Saidhom", details: "تم تعديل بيانات المستخدم", createdAt: "2026-01-15 09:15:00" },
  { id: "4", action: "حذف", entity: "سائق", entityId: "DR5", userName: "Peter Saidhom", details: "تم حذف سائق من النظام", createdAt: "2026-01-14 16:45:00" },
  { id: "5", action: "رفض", entity: "طلب سهرات", entityId: "OT-2026-0005", userName: "Maged Samir", details: "تم رفض الطلب - السائق غير متاح", createdAt: "2026-01-14 14:30:00" },
  { id: "6", action: "إنشاء", entity: "عامل", entityId: "W100", userName: "شنودة عوض", details: "تم إضافة عامل جديد لمصنع F4", createdAt: "2026-01-14 10:00:00" },
];

const actionColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "إنشاء": { bg: "bg-green-100", text: "text-green-700", icon: <Plus className="w-4 h-4" /> },
  "تعديل": { bg: "bg-blue-100", text: "text-blue-700", icon: <Edit className="w-4 h-4" /> },
  "حذف": { bg: "bg-red-100", text: "text-red-700", icon: <Trash2 className="w-4 h-4" /> },
  "موافقة": { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
  "رفض": { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-4 h-4" /> },
};

export default function AuditLogs() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredLogs = logs.filter(log => {
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesEntity = !filterEntity || log.entity === filterEntity;
    return matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">سجلات المراجعة</h1>
        <p className="text-slate-500">سجل جميع الإجراءات في النظام</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">الفلاتر</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5"
          >
            <option value="">كل الإجراءات</option>
            <option value="إنشاء">إنشاء</option>
            <option value="تعديل">تعديل</option>
            <option value="حذف">حذف</option>
            <option value="موافقة">موافقة</option>
            <option value="رفض">رفض</option>
          </select>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5"
          >
            <option value="">كل الكيانات</option>
            <option value="طلب سهرات">طلب سهرات</option>
            <option value="مستخدم">مستخدم</option>
            <option value="عامل">عامل</option>
            <option value="سائق">سائق</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5"
            placeholder="من تاريخ"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5"
            placeholder="إلى تاريخ"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-right py-4 px-6 font-medium text-slate-600">الإجراء</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">الكيان</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">المستخدم</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">التفاصيل</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const actionStyle = actionColors[log.action] || { bg: "bg-slate-100", text: "text-slate-700", icon: null };
              return (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${actionStyle.bg} ${actionStyle.text}`}>
                      {actionStyle.icon}
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-800">{log.entity}</p>
                      <p className="text-sm text-slate-500">{log.entityId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700">{log.userName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{log.details}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {log.createdAt}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">إجمالي السجلات</p>
          <p className="text-2xl font-bold text-slate-800">{filteredLogs.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">عمليات إنشاء</p>
          <p className="text-2xl font-bold text-green-600">{filteredLogs.filter(l => l.action === "إنشاء").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">عمليات تعديل</p>
          <p className="text-2xl font-bold text-blue-600">{filteredLogs.filter(l => l.action === "تعديل").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">عمليات حذف</p>
          <p className="text-2xl font-bold text-red-600">{filteredLogs.filter(l => l.action === "حذف").length}</p>
        </div>
      </div>
    </div>
  );
}