import { useState } from "react";
import { OvertimeRequest } from "../types";
import { Plus, Search, Clock, Users, CheckCircle, XCircle, AlertCircle, Truck } from "lucide-react";
import Button from "./ui/button";

interface OvertimeRequestsProps {
  userRole: string;
  userFactoryId?: string;
}

const mockRequests: OvertimeRequest[] = [
  {
    id: "OT-2026-0001",
    factoryId: "F4",
    createdByName: "شنودة عوض",
    createdAt: "2026-01-15",
    status: "pending",
    shiftDate: "2026-01-16",
    shiftTemplateId: "ST1",
    totalHours: 3.5,
    workers: [{ workerId: "W1", workerName: "أحمد محمد" }, { workerId: "W2", workerName: "محمود علي" }],
    notes: "تغطية إضافية لخط الإنتاج"
  },
  {
    id: "OT-2026-0002",
    factoryId: "F2",
    createdByName: "رفيق",
    createdAt: "2026-01-14",
    status: "approved",
    approvedByName: "Peter Saidhom",
    shiftDate: "2026-01-15",
    shiftTemplateId: "ST2",
    totalHours: 6,
    workers: [{ workerId: "W4", workerName: "كريم حسن" }],
    driverId: "DR1",
    driverName: "محمد أحمد",
    vehicleNumber: "أ ب ج 1234"
  },
  {
    id: "OT-2026-0003",
    factoryId: "F4",
    createdByName: "رأفت سعد",
    createdAt: "2026-01-13",
    status: "rejected",
    rejectedByName: "Maged Samir",
    rejectionReason: "السائق غير متاح في هذا الوقت",
    shiftDate: "2026-01-14",
    shiftTemplateId: "ST3",
    totalHours: 6,
    workers: [{ workerId: "W3", workerName: "سعيد أحمد" }]
  }
];

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: <AlertCircle className="w-4 h-4" /> },
  approved: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-4 h-4" /> },
  active: { bg: "bg-blue-100", text: "text-blue-700", icon: <Clock className="w-4 h-4" /> },
  completed: { bg: "bg-slate-100", text: "text-slate-700", icon: <CheckCircle className="w-4 h-4" /> }
};

const statusLabels: Record<string, string> = {
  pending: "بانتظار الموافقة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  active: "نشطة",
  completed: "مكتملة"
};

export default function OvertimeRequests({ userRole, userFactoryId }: OvertimeRequestsProps) {
  const [requests] = useState<OvertimeRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFactory, setFilterFactory] = useState(userFactoryId || "");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.id.includes(searchQuery) || r.createdByName.includes(searchQuery);
    const matchesStatus = !filterStatus || r.status === filterStatus;
    const matchesFactory = !filterFactory || r.factoryId === filterFactory;
    return matchesSearch && matchesStatus && matchesFactory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">طلبات السهرات</h1>
          <p className="text-slate-500">إدارة طلبات سهرات العمال</p>
        </div>
        {(userRole === "super_admin" || userRole === "manager") && (
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            طلب جديد
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب أو اسم المدير..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5"
          >
            <option value="">كل الحالات</option>
            <option value="pending">بانتظار الموافقة</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
            <option value="active">نشطة</option>
            <option value="completed">مكتملة</option>
          </select>
          {userRole === "super_admin" && (
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-2.5"
            >
              <option value="">كل المصانع</option>
              <option value="F4">مصنع F4</option>
              <option value="F2">مصنع F2</option>
              <option value="F3">مصنع F3</option>
            </select>
          )}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const statusStyle = statusColors[request.status] || statusColors.pending;
          return (
            <div key={request.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{request.id}</h3>
                    <p className="text-sm text-slate-500">بواسطة: {request.createdByName}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.icon}
                  {statusLabels[request.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">المصنع</p>
                  <p className="font-medium text-slate-800">{request.factoryId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">تاريخ الوردية</p>
                  <p className="font-medium text-slate-800">{request.shiftDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">ساعات العمل</p>
                  <p className="font-medium text-slate-800">{request.totalHours} ساعات</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">عدد العمال</p>
                  <p className="font-medium text-slate-800">{request.workers?.length || 0} عمال</p>
                </div>
              </div>

              {request.driverName && (
                <div className="flex items-center gap-2 text-sm bg-green-50 rounded-lg p-3 mb-4">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-green-800">السائق: {request.driverName} - {request.vehicleNumber}</span>
                </div>
              )}

              {request.rejectionReason && (
                <div className="flex items-center gap-2 text-sm bg-red-50 rounded-lg p-3 mb-4">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800">سبب الرفض: {request.rejectionReason}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {request.workers?.map(w => w.workerName).join("، ")}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-6">إنشاء طلب سهرات جديد</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("تم إرسال الطلب بنجاح - في انتظار موافقة المدير العام");
              setShowCreateModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الوردية</label>
                  <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">قالب الوردية</label>
                  <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required>
                    <option value="ST1">الوردية الأساسية (16:00 - 19:30) - 3.5 ساعات</option>
                    <option value="ST2">وردية المساء (18:00 - 00:00) - 6 ساعات</option>
                    <option value="ST3">وردية الليل (20:00 - 02:00) - 6 ساعات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">العمال</label>
                  <div className="border border-slate-300 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>أحمد محمد - EMP001</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>محمود علي - EMP002</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>سعيد أحمد - EMP003</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات</label>
                  <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2.5" rows={3} placeholder="أي ملاحظات إضافية..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">إلغاء</Button>
                <Button type="submit" className="flex-1">إرسال الطلب</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">تفاصيل الطلب {selectedRequest.id}</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">المصنع</p>
                  <p className="font-bold text-slate-800">{selectedRequest.factoryId}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">الحالة</p>
                  <p className="font-bold text-slate-800">{statusLabels[selectedRequest.status]}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">تاريخ الوردية</p>
                  <p className="font-bold text-slate-800">{selectedRequest.shiftDate}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">ساعات العمل</p>
                  <p className="font-bold text-slate-800">{selectedRequest.totalHours} ساعات</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">العمال المعينون:</p>
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  {selectedRequest.workers?.map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{w.workerName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {userRole === "super_admin" && selectedRequest.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    موافقة
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 border-red-300">
                    <XCircle className="w-4 h-4 ml-2" />
                    رفض
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}