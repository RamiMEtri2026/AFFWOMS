import { User } from "../types";
import { Clock, CheckCircle, AlertCircle, Users, Truck, Building2, TrendingUp, Calendar } from "lucide-react";
import KPICard from "./KPICard";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const kpis = [
    { title: "طلبات اليوم", value: 12, icon: Calendar, color: "blue" as const },
    { title: "الموافقة", value: 8, icon: CheckCircle, color: "green" as const },
    { title: "قيد الانتظار", value: 4, icon: AlertCircle, color: "amber" as const },
    { title: "الورديات النشطة", value: 3, icon: Clock, color: "purple" as const },
    { title: "عدد العمال", value: 156, icon: Users, color: "slate" as const },
    { title: "عدد السائقين", value: 12, icon: Truck, color: "blue" as const },
    { title: "عدد المصانع", value: 3, icon: Building2, color: "green" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-l from-blue-900 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً، {user.name}</h1>
        <p className="text-blue-200">لوحة التحكم الرئيسية - نظام إدارة سهرات العمال</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart Placeholder */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            الإحصائيات الشهرية
          </h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <p className="text-slate-400">الرسم البياني الشهري</p>
          </div>
        </div>

        {/* Factory Performance */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            أداء المصانع
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">مصنع المنطقة الرابعة</span>
              <span className="text-green-600 font-bold">85%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">مصنع المنطقة الثانية</span>
              <span className="text-blue-600 font-bold">72%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">مصنع المنطقة الثالثة</span>
              <span className="text-amber-600 font-bold">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">طلبات السهرات الأخيرة</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-right py-3 px-4 font-medium text-slate-600">رقم الطلب</th>
                <th className="text-right py-3 px-4 font-medium text-slate-600">المصنع</th>
                <th className="text-right py-3 px-4 font-medium text-slate-600">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-slate-600">عدد العمال</th>
                <th className="text-right py-3 px-4 font-medium text-slate-600">الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">OT-2026-0001</td>
                <td className="py-3 px-4">مصنع المنطقة الرابعة</td>
                <td className="py-3 px-4">2026-01-15</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">قيد الانتظار</span>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">OT-2026-0002</td>
                <td className="py-3 px-4">مصنع المنطقة الثانية</td>
                <td className="py-3 px-4">2026-01-15</td>
                <td className="py-3 px-4">3</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">تمت الموافقة</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}