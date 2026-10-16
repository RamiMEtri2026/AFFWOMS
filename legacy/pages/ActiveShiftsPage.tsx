import { useState, useMemo } from "react";
import { Button } from "../components/ui/button";
import { overtimeRequests, factories, zones } from "../data/mockData";
import { OvertimeRequest } from "../types";
import { Clock, Users, Truck, MapPin, Play, Pause, CheckCircle, AlertCircle, Timer, ArrowRight } from "lucide-react";

export default function ActiveShiftsPage() {
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);

  const activeShifts = useMemo(() => {
    return overtimeRequests.filter(r => {
      if (r.status !== "active" && r.status !== "approved") return false;
      if (selectedFactory && r.factoryId !== selectedFactory) return false;
      return true;
    });
  }, [selectedFactory]);

  const getElapsedTime = (startTime: string) => {
    const now = new Date();
    const [hours, minutes] = startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    const diff = now.getTime() - start.getTime();
    const elapsedHours = Math.floor(diff / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${elapsedHours} ساعة ${elapsedMinutes} دقيقة`;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الورديات النشطة</h1>
          <p className="text-slate-500 mt-1">Active Shifts Monitor</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="">جميع المصانع</option>
            {factories.map(f => <option key={f.id} value={f.id}>{f.nameAr}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-100 rounded-lg"><Play className="w-5 h-5 text-green-600" /></div>
            <span className="text-sm text-slate-500">ورديات نشطة</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeShifts.filter(s => s.status === "active").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
            <span className="text-sm text-slate-500">بانتظار البدء</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeShifts.filter(s => s.status === "approved").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-100 rounded-lg"><Users className="w-5 h-5 text-amber-600" /></div>
            <span className="text-sm text-slate-500">عمال في الورديات</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeShifts.reduce((sum, s) => sum + s.workers.length, 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-100 rounded-lg"><Truck className="w-5 h-5 text-purple-600" /></div>
            <span className="text-sm text-slate-500">سائقين نشطين</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{new Set(activeShifts.flatMap(s => s.workers.map(w => w.driverId).filter(Boolean))).size}</p>
        </div>
      </div>

      {/* Active Shifts List */}
      <div className="space-y-4">
        {activeShifts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">لا توجد ورديات نشطة حالياً</p>
          </div>
        ) : (
          activeShifts.map((shift) => {
            const factory = factories.find(f => f.id === shift.factoryId);
            return (
              <div key={shift.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className={`p-4 ${shift.status === "active" ? "bg-green-50 border-b border-green-100" : "bg-blue-50 border-b border-blue-100"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${shift.status === "active" ? "bg-green-100" : "bg-blue-100"}`}>
                        {shift.status === "active" ? <Play className="w-6 h-6 text-green-600" /> : <Pause className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{shift.requestNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${shift.status === "active" ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"}`}>
                            {shift.status === "active" ? "نشط" : "بانتظار البدء"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{factory?.nameAr} • {shift.shiftTemplateName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {shift.status === "active" && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Timer className="w-5 h-5" />
                          <span className="font-medium">{getElapsedTime(shift.startTime)}</span>
                        </div>
                      )}
                      <Button variant="outline" onClick={() => setSelectedRequest(shift)}>
                        عرض التفاصيل
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">التاريخ</p>
                      <p className="font-medium text-slate-800">{shift.shiftDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">وقت البداية</p>
                      <p className="font-medium text-slate-800">{shift.startTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">وقت النهاية</p>
                      <p className="font-medium text-slate-800">{shift.endTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">عدد العمال</p>
                      <p className="font-medium text-slate-800">{shift.workers.length}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {shift.workers.slice(0, 5).map((worker, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">{worker.workerName}</span>
                    ))}
                    {shift.workers.length > 5 && (
                      <span className="px-3 py-1 bg-slate-200 rounded-full text-sm text-slate-600">+{shift.workers.length - 5} آخرين</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">تفاصيل الوردية</h2>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">رقم الطلب</p>
                  <p className="font-medium text-slate-800">{selectedRequest.requestNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">المصنع</p>
                  <p className="font-medium text-slate-800">{factories.find(f => f.id === selectedRequest.factoryId)?.nameAr}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">التاريخ</p>
                  <p className="font-medium text-slate-800">{selectedRequest.shiftDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">القالب</p>
                  <p className="font-medium text-slate-800">{selectedRequest.shiftTemplateName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">وقت البداية</p>
                  <p className="font-medium text-slate-800">{selectedRequest.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">وقت النهاية</p>
                  <p className="font-medium text-slate-800">{selectedRequest.endTime}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-3">العمال ({selectedRequest.workers.length})</h3>
                <div className="space-y-2">
                  {selectedRequest.workers.map((worker, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{worker.workerName}</p>
                        <p className="text-sm text-slate-500">{worker.departmentName}</p>
                      </div>
                      <div className="text-left">
                        {worker.driverName && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Truck className="w-4 h-4" />
                            <span>{worker.driverName}</span>
                          </div>
                        )}
                        {worker.zoneName && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4" />
                            <span>{worker.zoneName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}