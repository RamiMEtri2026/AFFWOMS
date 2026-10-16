import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { factories, workers, drivers, overtimeRequests, shiftTemplates } from "../data/mockData";
import KPICard from "../components/KPICard";
import OvertimeChart from "../components/OvertimeChart";
import RecentRequests from "../components/RecentRequests";
import { Clock, Users, Truck, Factory, CheckCircle, AlertCircle, Play } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const filteredRequests = user?.role === "super_admin"
    ? overtimeRequests
    : overtimeRequests.filter((r) => r.factoryId === user?.factoryId);

  const filteredWorkers = user?.role === "super_admin"
    ? workers
    : workers.filter((w) => w.factoryId === user?.factoryId);

  const todayRequests = filteredRequests.filter(
    (r) => new Date(r.shiftDate).toDateString() === new Date().toDateString()
  );

  const pendingRequests = filteredRequests.filter((r) => r.status === "pending");
  const approvedRequests = filteredRequests.filter((r) => r.status === "approved");
  const activeShifts = filteredRequests.filter((r) => r.status === "active");

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
        <p className="text-slate-500 mt-1">مرحباً، {user?.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="طلبات اليوم" value={todayRequests.length} icon={Clock} color="blue" />
        <KPICard title="بانتظار الموافقة" value={pendingRequests.length} icon={AlertCircle} color="amber" />
        <KPICard title="موافق عليها" value={approvedRequests.length} icon={CheckCircle} color="green" />
        <KPICard title="ورديات نشطة" value={activeShifts.length} icon={Play} color="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="عدد العمال" value={filteredWorkers.length} icon={Users} color="slate" />
        <KPICard title="عدد السائقين" value={drivers.length} icon={Truck} color="slate" />
        <KPICard title="عدد المصانع" value={user?.role === "super_admin" ? factories.length : 1} icon={Factory} color="slate" />
        <KPICard title="قوالب الورديات" value={shiftTemplates.length} icon={Clock} color="slate" />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OvertimeChart />
        <RecentRequests requests={filteredRequests} />
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">ملخص السهرات</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-900">{filteredRequests.length}</p>
            <p className="text-sm text-slate-500 mt-1">إجمالي الطلبات</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-700">{filteredRequests.filter((r) => r.status === "completed").length}</p>
            <p className="text-sm text-slate-500 mt-1">مكتملة</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-3xl font-bold text-amber-700">{filteredRequests.reduce((acc, r) => acc + r.totalHours, 0).toFixed(1)}</p>
            <p className="text-sm text-slate-500 mt-1">ساعات العمل</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-700">{filteredRequests.reduce((acc, r) => acc + r.workers.length, 0)}</p>
            <p className="text-sm text-slate-500 mt-1">عمال مشاركين</p>
          </div>
        </div>
      </div>
    </div>
  );
}