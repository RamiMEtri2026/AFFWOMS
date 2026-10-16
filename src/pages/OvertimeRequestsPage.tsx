import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { OvertimeRequest, OvertimeRequestWorker, Worker, Driver, Zone } from "../types";
import { overtimeRequests as initialRequests, factories, workers as allWorkers, shiftTemplates, drivers as allDrivers, zones as allZones } from "../data/mockData";
import { Plus, Search, CheckCircle, XCircle, Clock, Users, Truck, MapPin, Eye, Edit, ChevronDown, ChevronUp, User, FileText } from "lucide-react";

export default function OvertimeRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<OvertimeRequest[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [factoryFilter, setFactoryFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = r.requestNumber.includes(search) || r.workers.some(w => w.workerName.includes(search));
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesFactory = factoryFilter === "all" || r.factoryId === factoryFilter;
    return matchesSearch && matchesStatus && matchesFactory;
  });

  const getFactoryName = (id: string) => factories.find(f => f.id === id)?.nameAr || id;
  const getShiftName = (id: string) => shiftTemplates.find(s => s.id === id)?.name || id;

  const statusLabels: Record<string, string> = {
    pending: "بانتظار الموافقة",
    approved: "تمت الموافقة",
    rejected: "مرفوض",
    active: "نشط",
    completed: "مكتمل",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    active: "bg-blue-100 text-blue-700",
    completed: "bg-slate-100 text-slate-700",
  };

  const handleApprove = (request: OvertimeRequest) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const handleReject = (request: OvertimeRequest) => {
    const reason = prompt("يرجى إدخال سبب الرفض:");
    if (reason) {
      setRequests(requests.map(r => 
        r.id === request.id 
          ? { ...r, status: "rejected" as const, rejectedBy: user?.id, rejectedAt: new Date().toISOString(), rejectionReason: reason }
          : r
      ));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">طلبات السهرات</h1>
          <p className="text-slate-500 mt-1">Overtime Requests Management</p>
        </div>
        {(user?.role === "super_admin" || user?.role === "manager") && (
          <Button
            onClick={() => { setSelectedRequest(null); setShowModal(true); }}
            className="bg-blue-900 hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 ml-2" />
            طلب جديد
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث برقم الطلب أو اسم العامل..."
              className="pr-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">بانتظار الموافقة</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
            <option value="active">نشط</option>
            <option value="completed">مكتمل</option>
          </select>
          {user?.role === "super_admin" && (
            <select
              value={factoryFilter}
              onChange={(e) => setFactoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">جميع المصانع</option>
              {factories.map(f => (
                <option key={f.id} value={f.id}>{f.nameAr}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">إجمالي الطلبات</p>
              <p className="text-xl font-bold text-slate-800">{requests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">بانتظار الموافقة</p>
              <p className="text-xl font-bold text-amber-700">{requests.filter(r => r.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">تمت الموافقة</p>
              <p className="text-xl font-bold text-green-700">{requests.filter(r => r.status === "approved").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">الورديات النشطة</p>
              <p className="text-xl font-bold text-blue-700">{requests.filter(r => r.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">مرفوض</p>
              <p className="text-xl font-bold text-red-700">{requests.filter(r => r.status === "rejected").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Request Header */}
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  request.status === "pending" ? "bg-amber-100" :
                  request.status === "approved" ? "bg-green-100" :
                  request.status === "rejected" ? "bg-red-100" :
                  request.status === "active" ? "bg-blue-100" : "bg-slate-100"
                }`}>
                  <FileText className={`w-5 h-5 ${
                    request.status === "pending" ? "text-amber-600" :
                    request.status === "approved" ? "text-green-600" :
                    request.status === "rejected" ? "text-red-600" :
                    request.status === "active" ? "text-blue-600" : "text-slate-600"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800">{request.requestNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span>{getFactoryName(request.factoryId)}</span>
                    <span>•</span>
                    <span>{getShiftName(request.shiftTemplateId)}</span>
                    <span>•</span>
                    <span>{request.workers.length} عامل</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{request.shiftDate}</span>
                {expandedRequest === request.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRequest === request.id && (
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                {/* Workers List */}
                <div className="mb-4">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    العمال المحددون للوردية
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {request.workers.map((w, idx) => (
                      <div key={idx} className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-800">{w.workerName}</span>
                        </div>
                        <div className="text-sm text-slate-500 space-y-1">
                          <p>ساعات العمل: {w.assignedHours} ساعة</p>
                          {w.zoneName && (
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              المنطقة: {w.zoneName}
                            </p>
                          )}
                          {w.driverName && (
                            <p className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              السائق: {w.driverName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {request.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800"><strong>ملاحظات:</strong> {request.notes}</p>
                  </div>
                )}

                {/* Rejection Reason */}
                {request.status === "rejected" && request.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800"><strong>سبب الرفض:</strong> {request.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                {request.status === "pending" && user?.role === "super_admin" && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <Button
                      onClick={() => handleApprove(request)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      موافقة وتعيين
                    </Button>
                    <Button
                      onClick={() => handleReject(request)}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 ml-2" />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">لا توجد طلبات مطابقة للبحث</p>
        </div>
      )}

      {/* New Request Modal */}
      {showModal && (
        <NewRequestModal
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            const newRequest: OvertimeRequest = {
              ...data,
              id: `OR${Date.now()}`,
              requestNumber: `OT-2026-${String(requests.length + 1).padStart(3, "0")}`,
              createdAt: new Date().toISOString(),
              status: "pending",
            };
            setRequests([newRequest, ...requests]);
            setShowModal(false);
          }}
        />
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <ApprovalModal
          request={selectedRequest}
          onClose={() => setShowApprovalModal(false)}
          onSave={(updatedWorkers) => {
            setRequests(requests.map(r => 
              r.id === selectedRequest.id 
                ? { 
                    ...r, 
                    status: "approved" as const, 
                    approvedBy: user?.id, 
                    approvedAt: new Date().toISOString(),
                    workers: updatedWorkers 
                  }
                : r
            ));
            setShowApprovalModal(false);
          }}
        />
      )}
    </div>
  );
}

// New Request Modal
function NewRequestModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Partial<OvertimeRequest>) => void;
}) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    factoryId: user?.factoryId || "",
    shiftDate: new Date().toISOString().split("T")[0],
    shiftTemplateId: "",
    notes: "",
    workers: [] as { workerId: string; workerName: string; assignedHours: number }[],
  });

  const availableWorkers = allWorkers.filter(w => 
    formData.factoryId ? w.factoryId === formData.factoryId : true
  );
  const selectedShift = shiftTemplates.find(s => s.id === formData.shiftTemplateId);

  const handleWorkerToggle = (worker: Worker) => {
    const exists = formData.workers.find(w => w.workerId === worker.id);
    if (exists) {
      setFormData({
        ...formData,
        workers: formData.workers.filter(w => w.workerId !== worker.id),
      });
    } else {
      setFormData({
        ...formData,
        workers: [
          ...formData.workers,
          { workerId: worker.id, workerName: worker.name, assignedHours: selectedShift?.totalHours || 3.5 },
        ],
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.factoryId || !formData.shiftTemplateId || formData.workers.length === 0) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    onSave({
      ...formData,
      totalHours: selectedShift?.totalHours || 0,
      createdBy: user?.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white sticky top-0">
          <h3 className="text-lg font-bold">طلب سهرات جديد</h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg">✕</button>
        </div>

        {/* Steps */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-900" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-900 text-white" : "bg-slate-200"}`}>
                1
              </div>
              <span className="font-medium">تفاصيل الوردية</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-900" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-900 text-white" : "bg-slate-200"}`}>
                2
              </div>
              <span className="font-medium">اختيار العمال</span>
            </div>
          </div>
        </div>

        {/* Step 1: Shift Details */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المصنع <span className="text-red-500">*</span></label>
              <select
                value={formData.factoryId}
                onChange={(e) => setFormData({ ...formData, factoryId: e.target.value, workers: [] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                disabled={user?.role !== "super_admin"}
              >
                <option value="">اختر المصنع</option>
                {factories.map(f => (
                  <option key={f.id} value={f.id}>{f.nameAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الوردية <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.shiftDate}
                onChange={(e) => setFormData({ ...formData, shiftDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">قالب الوردية <span className="text-red-500">*</span></label>
              <select
                value={formData.shiftTemplateId}
                onChange={(e) => setFormData({ ...formData, shiftTemplateId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">اختر قالب الوردية</option>
                {shiftTemplates.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.totalHours} ساعات)</option>
                ))}
              </select>
            </div>

            {selectedShift && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">ساعات العمل:</span>
                  <span className="font-bold text-blue-900">{selectedShift.totalHours} ساعات</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-800">وقت البداية:</span>
                  <span className="font-medium text-blue-900">{selectedShift.startTime}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-blue-800">وقت النهاية:</span>
                  <span className="font-medium text-blue-900">{selectedShift.endTime}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                rows={3}
                placeholder="أي ملاحظات إضافية..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Select Workers */}
        {step === 2 && (
          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-bold text-slate-800 mb-2">اختر العمال للوردية</h4>
              <p className="text-sm text-slate-500">تم تحديد {formData.workers.length} عامل</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {availableWorkers.map(worker => {
                const isSelected = formData.workers.some(w => w.workerId === worker.id);
                return (
                  <div
                    key={worker.id}
                    onClick={() => handleWorkerToggle(worker)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        isSelected ? "bg-blue-500 text-white" : "bg-slate-200"
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{worker.name}</p>
                        <p className="text-xs text-slate-500">{worker.jobTitle} • {worker.employeeNumber}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <Button
            variant="outline"
            onClick={() => step === 1 ? onClose() : setStep(step - 1)}
          >
            {step === 1 ? "إلغاء" : "السابق"}
          </Button>
          {step === 1 ? (
            <Button
              className="bg-blue-900 hover:bg-blue-800"
              onClick={() => {
                if (!formData.factoryId || !formData.shiftTemplateId) {
                  alert("يرجى ملء جميع الحقول المطلوبة");
                  return;
                }
                setStep(2);
              }}
            >
              التالي
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              إرسال الطلب
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Approval Modal with Zone and Driver Assignment
function ApprovalModal({
  request,
  onClose,
  onSave,
}: {
  request: OvertimeRequest;
  onClose: () => void;
  onSave: (workers: OvertimeRequestWorker[]) => void;
}) {
  const [workers, setWorkers] = useState<OvertimeRequestWorker[]>(
    request.workers.map(w => ({
      ...w,
      zoneId: w.zoneId || "",
      zoneName: w.zoneName || "",
      driverId: w.driverId || "",
      driverName: w.driverName || "",
    }))
  );

  const activeDrivers = allDrivers.filter(d => d.status === "active");

  const handleWorkerZoneChange = (workerId: string, zoneId: string) => {
    const zone = allZones.find(z => z.id === zoneId);
    setWorkers(workers.map(w => 
      w.workerId === workerId 
        ? { ...w, zoneId, zoneName: zone?.name || "", driverId: "", driverName: "" }
        : w
    ));
  };

  const handleWorkerDriverChange = (workerId: string, driverId: string) => {
    const driver = allDrivers.find(d => d.id === driverId);
    setWorkers(workers.map(w => 
      w.workerId === workerId 
        ? { ...w, driverId, driverName: driver?.name || "" }
        : w
    ));
  };

  const handleZoneForAll = (zoneId: string) => {
    const zone = allZones.find(z => z.id === zoneId);
    setWorkers(workers.map(w => ({
      ...w,
      zoneId,
      zoneName: zone?.name || "",
      driverId: "",
      driverName: "",
    })));
  };

  const handleDriverForAll = (driverId: string) => {
    const driver = allDrivers.find(d => d.id === driverId);
    setWorkers(workers.map(w => ({
      ...w,
      driverId,
      driverName: driver?.name || "",
    })));
  };

  const handleSubmit = () => {
    const allAssigned = workers.every(w => w.zoneId && w.driverId);
    if (!allAssigned) {
      alert("يرجى تعيين المنطقة والسائق لجميع العمال");
      return;
    }
    onSave(workers);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-green-600 text-white sticky top-0">
          <div>
            <h3 className="text-lg font-bold">الموافقة وتعيين السائقين</h3>
            <p className="text-sm text-green-100">{request.requestNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-700 rounded-lg">✕</button>
        </div>

        {/* Quick Assign All */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h4 className="font-bold text-slate-700 mb-3">تعيين سريع للجميع</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-slate-600 mb-1">تعيين نفس المنطقة للجميع:</label>
              <select
                onChange={(e) => handleZoneForAll(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">اختر المنطقة</option>
                {allZones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-slate-600 mb-1">تعيين نفس السائق للجميع:</label>
              <select
                onChange={(e) => handleDriverForAll(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">اختر السائق</option>
                {activeDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} - {d.vehicleNumber}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Workers Assignment */}
        <div className="p-6">
          <h4 className="font-bold text-slate-700 mb-4">تعيين لكل عامل على حدة</h4>
          <div className="space-y-4">
            {workers.map((worker, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{worker.workerName}</p>
                    <p className="text-sm text-slate-500">{worker.assignedHours} ساعات عمل</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Zone Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline ml-1" />
                      المنطقة المتجه إليها <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={worker.zoneId || ""}
                      onChange={(e) => handleWorkerZoneChange(worker.workerId, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">اختر المنطقة</option>
                      {allZones.map(z => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Driver Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Truck className="w-4 h-4 inline ml-1" />
                      السائق <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={worker.driverId || ""}
                      onChange={(e) => handleWorkerDriverChange(worker.workerId, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      disabled={!worker.zoneId}
                    >
                      <option value="">اختر السائق</option>
                      {activeDrivers
                        .filter(d => !worker.zoneId || d.zoneId === worker.zoneId)
                        .map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} - {d.vehicleNumber} ({d.vehicleCapacity})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
          >
            <CheckCircle className="w-4 h-4 ml-2" />
            تأكيد الموافقة
          </Button>
        </div>
      </div>
    </div>
  );
}