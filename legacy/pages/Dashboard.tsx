import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { overtimeRequests, factories, workers, drivers } from "../data/mockData";
import { Users, Factory, Truck, Clock, FileText, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(overtimeRequests);

  const stats = {
    todayRequests: requests.filter(r => r.shiftDate === new Date().toISOString().split("T")[0]).length,
    approved: requests.filter(r => r.status === "approved").length,
    pending: requests.filter(r => r.status === "pending").length,
    active: requests.filter(r => r.status === "active").length,
    workers: workers.length,
    drivers: drivers.length,
    factories: factories.length,
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const activeRequests = requests.filter(r => r.status === "active");

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Header */}
      <div className="bg-gradient-to-l from-blue-900 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">مرحباً، {user?.name}</h1>
        <p className="text-blue-200 mt-1">لوحة التحكم الرئيسية - {user?.role === "super_admin" ? "مدير عام" : user?.role === "manager" ? "مدير" : "مشرف"}</p>
      </div>

      {/* Pending Alert for Super Admin */}
      {user?.role === "super_admin" && pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-bold text-amber-800">يوجد طلب سهرات جديد بانتظار الموافقة</p>
              <p className="text-sm text-amber-600">{pendingRequests.length} طلب بانتظار المراجعة</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">طلبات اليوم</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.todayRequests}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">الموافقة</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">قيد الانتظار</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">الورديات النشطة</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">العمال</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.workers}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <Users className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">السائقين</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.drivers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">المصانع</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">{stats.factories}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Factory className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">طلبات السهرات الأخيرة</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {requests.slice(0, 5).map(req => (
            <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-800">{req.requestNumber}</p>
                <p className="text-sm text-slate-500">{factories.find(f => f.id === req.factoryId)?.nameAr}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  req.status === "pending" ? "bg-amber-100 text-amber-700" :
                  req.status === "approved" ? "bg-green-100 text-green-700" :
                  req.status === "rejected" ? "bg-red-100 text-red-700" :
                  req.status === "active" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {req.status === "pending" ? "بانتظار الموافقة" :
                   req.status === "approved" ? "موافق عليها" :
                   req.status === "rejected" ? "مرفوضة" :
                   req.status === "active" ? "نشطة" : "مكتملة"}
                </span>
                <span className="text-sm text-slate-400">{new Date(req.shiftDate).toLocaleDateString("ar-EG")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}