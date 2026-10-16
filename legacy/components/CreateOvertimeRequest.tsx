import { useState } from "react";
import { User, Factory, Worker, ShiftTemplate, OvertimeRequest } from "../types";
import { Clock, Users, Check, AlertCircle } from "lucide-react";
import Button from "./ui/button";

interface CreateOvertimeRequestProps {
  user: User;
  factories: Factory[];
  workers: Worker[];
  shiftTemplates: ShiftTemplate[];
  onSubmit: (request: Omit<OvertimeRequest, "id" | "requestNumber" | "createdAt" | "status">) => void;
  onCancel: () => void;
}

export default function CreateOvertimeRequest({
  user,
  factories,
  workers,
  shiftTemplates,
  onSubmit,
  onCancel
}: CreateOvertimeRequestProps) {
  const [selectedFactory, setSelectedFactory] = useState<string>(user.factoryId || "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [customHours, setCustomHours] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedShiftTemplate = shiftTemplates.find(s => s.id === selectedShift);
  
  const filteredWorkers = workers.filter(w => w.factoryId === selectedFactory && w.status === "active");

  const handleWorkerToggle = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleSelectAllWorkers = () => {
    if (selectedWorkers.length === filteredWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(filteredWorkers.map(w => w.id));
    }
  };

  const calculateTotalHours = () => {
    if (!selectedShiftTemplate) return 0;
    return customHours > 0 ? customHours : selectedShiftTemplate.totalHours;
  };

  const handleSubmit = async () => {
    if (!selectedFactory || !selectedDate || !selectedShift || selectedWorkers.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const workerData = selectedWorkers.map(workerId => {
      const worker = workers.find(w => w.id === workerId);
      return {
        workerId,
        workerName: worker?.name || "",
        assignedHours: calculateTotalHours()
      };
    });

    const request: Omit<OvertimeRequest, "id" | "requestNumber" | "createdAt" | "status"> = {
      factoryId: selectedFactory,
      createdBy: user.id,
      shiftTemplateId: selectedShift,
      shiftDate: selectedDate,
      startDatetime: selectedShiftTemplate?.startTime || "",
      endDatetime: selectedShiftTemplate?.endTime || "",
      totalHours: calculateTotalHours(),
      workers: workerData,
      notes,
      driverId: undefined,
      vehicleNumber: undefined,
      approvedBy: undefined,
      approvedAt: undefined
    };

    onSubmit(request);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">تم إرسال الطلب بنجاح</h2>
        <p className="text-slate-600 mb-2">تم إرسال طلب السهرات إلى المدير العام للموافقة عليه</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">تم إرسال إشعار للمدير العام</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">"يوجد طلب سهرات جديد بانتظار الموافقة"</p>
        </div>
        <Button onClick={onCancel} className="bg-blue-900 hover:bg-blue-800 text-white px-8">
          العودة للقائمة
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">إنشاء طلب سهرات جديد</h2>
          <p className="text-sm text-slate-500">أدخل بيانات طلب السهرات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factory Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">المصنع</label>
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={user.role !== "super_admin"}
          >
            <option value="">اختر المصنع</option>
            {factories.map(f => (
              <option key={f.id} value={f.id}>{f.nameAr}</option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الوردية</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Shift Template Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">قالب الوردية</label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">اختر قالب الوردية</option>
            {shiftTemplates.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.startTime} - {s.endTime}) - {s.totalHours} ساعات
              </option>
            ))}
          </select>
        </div>

        {/* Custom Hours */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ساعات العمل (اختياري - للتعديل)
          </label>
          <input
            type="number"
            value={customHours || ""}
            onChange={(e) => setCustomHours(parseFloat(e.target.value) || 0)}
            placeholder={selectedShiftTemplate ? `الافتراضي: ${selectedShiftTemplate.totalHours} ساعات` : ""}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Workers Selection */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            <Users className="inline w-4 h-4 ml-1" />
            اختيار العمال ({selectedWorkers.length} من {filteredWorkers.length})
          </label>
          <button
            onClick={handleSelectAllWorkers}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedWorkers.length === filteredWorkers.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
          </button>
        </div>
        
        <div className="border border-slate-200 rounded-lg max-h-64 overflow-y-auto">
          {filteredWorkers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              لا يوجد عمال في هذا المصنع
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredWorkers.map(worker => (
                <label
                  key={worker.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedWorkers.includes(worker.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedWorkers.includes(worker.id)}
                    onChange={() => handleWorkerToggle(worker.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{worker.name}</p>
                    <p className="text-sm text-slate-500">{worker.jobTitle} - {worker.employeeNumber}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أدخل أي ملاحظات إضافية..."
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Summary */}
      {selectedShiftTemplate && selectedWorkers.length > 0 && (
        <div className="mt-6 bg-slate-50 rounded-lg p-4">
          <h3 className="font-medium text-slate-800 mb-2">ملخص الطلب</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500">عدد العمال:</span>
              <span className="font-bold text-slate-800 mr-1">{selectedWorkers.length}</span>
            </div>
            <div>
              <span className="text-slate-500">ساعات العمل:</span>
              <span className="font-bold text-slate-800 mr-1">{calculateTotalHours()}</span>
            </div>
            <div>
              <span className="text-slate-500">إجمالي الساعات:</span>
              <span className="font-bold text-blue-600 mr-1">{selectedWorkers.length * calculateTotalHours()}</span>
            </div>
            <div>
              <span className="text-slate-500">التاريخ:</span>
              <span className="font-bold text-slate-800 mr-1">{selectedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6"
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedFactory || !selectedDate || !selectedShift || selectedWorkers.length === 0 || isSubmitting}
          className="bg-blue-900 hover:bg-blue-800 text-white px-8"
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
        </Button>
      </div>
    </div>
  );
}