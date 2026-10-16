import { useState, useEffect } from "react";
import { Clock, Users, Truck, Activity } from "lucide-react";

interface ActiveShiftsProps {
  userRole: string;
}

const mockActiveShifts = [
  {
    id: "OT-2026-0001",
    factory: "مصنع المنطقة الرابعة",
    workers: 12,
    startTime: "16:00",
    endTime: "19:30",
    status: "active",
    driver: "محمد أحمد",
    vehicleNumber: "أ ب ج 1234",
    elapsedMinutes: 45
  },
  {
    id: "OT-2026-0002",
    factory: "مصنع المنطقة الثانية",
    workers: 8,
    startTime: "18:00",
    endTime: "00:00",
    status: "pending",
    driver: null,
    vehicleNumber: null,
    elapsedMinutes: 0
  }
];

export default function ActiveShifts({ userRole }: ActiveShiftsProps) {
  const [shifts, setShifts] = useState(mockActiveShifts);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الورديات النشطة</h1>
          <p className="text-slate-500">متابعة الورديات الجارية في الوقت الحقيقي</p>
        </div>
        <div className="text-left">
          <p className="text-sm text-slate-500">الوقت الحالي</p>
          <p className="text-xl font-bold text-slate-800">
            {currentTime.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Active Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shifts.map((shift) => (
          <div key={shift.id} className={`bg-white rounded-xl shadow p-6 border-r-4 ${shift.status === "active" ? "border-green-500" : "border-amber-500"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${shift.status === "active" ? "bg-green-100" : "bg-amber-100"}`}>
                  <Activity className={`w-6 h-6 ${shift.status === "active" ? "text-green-600" : "text-amber-600"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{shift.id}</h3>
                  <p className="text-sm text-slate-500">{shift.factory}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${shift.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {shift.status === "active" ? "نشطة" : "في الانتظار"}
              </span>
            </div>

            {/* Timer */}
            {shift.status === "active" && (
              <div className="bg-slate-50 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm text-slate-500 mb-1">الوقت المنقضي</p>
                <p className="text-3xl font-bold text-slate-800 font-mono">{formatTime(shift.elapsedMinutes)}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{shift.startTime} → {shift.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{shift.workers} عامل</span>
              </div>
            </div>

            {/* Driver Info */}
            {shift.driver && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 rounded-lg p-3">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">{shift.driver} - {shift.vehicleNumber}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">ورديات نشطة</p>
              <p className="text-2xl font-bold text-slate-800">{shifts.filter(s => s.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">في الانتظار</p>
              <p className="text-2xl font-bold text-slate-800">{shifts.filter(s => s.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">إجمالي العمال</p>
              <p className="text-2xl font-bold text-slate-800">{shifts.reduce((sum, s) => sum + s.workers, 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}