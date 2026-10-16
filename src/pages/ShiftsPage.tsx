import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShiftTemplate } from "../types";
import { shiftTemplates as initialTemplates } from "../data/mockData";
import { Plus, Edit, Trash2, X, Clock } from "lucide-react";

export default function ShiftsPage() {
  const [templates, setTemplates] = useState<ShiftTemplate[]>(initialTemplates);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا القالب؟")) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">قوالب الورديات</h1>
          <p className="text-slate-500 mt-1">إدارة قوالب ورديات السهرات</p>
        </div>
        <Button
          onClick={() => { setEditingTemplate(null); setShowModal(true); }}
          className="bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة قالب
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{template.name}</h3>
                  <p className="text-xs text-slate-500">{template.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditingTemplate(template); setShowModal(true); }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">وقت البداية</span>
                <span className="font-medium text-slate-800">{template.startTime}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">وقت النهاية</span>
                <span className="font-medium text-slate-800">{template.endTime}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-blue-600">إجمالي الساعات</span>
                <span className="font-bold text-blue-800">{template.totalHours} ساعة</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ShiftModal
          template={editingTemplate}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editingTemplate) {
              setTemplates(templates.map((t) => (t.id === editingTemplate.id ? { ...t, ...data } : t)));
            } else {
              setTemplates([...templates, { ...data, id: `ST${Date.now()}`, createdAt: new Date().toISOString() } as ShiftTemplate]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function ShiftModal({ template, onClose, onSave }: { template: ShiftTemplate | null; onClose: () => void; onSave: (data: Partial<ShiftTemplate>) => void }) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    startTime: template?.startTime || "16:00",
    endTime: template?.endTime || "19:30",
  });

  const calculateHours = (start: string, end: string): number => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) diff += 24 * 60;
    return Math.round((diff / 60) * 10) / 10;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{template ? "تعديل قالب" : "إضافة قالب جديد"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم القالب</label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">وقت البداية</label>
              <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">وقت النهاية</label>
              <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-600">إجمالي الساعات المحسوبة</span>
              <span className="text-2xl font-bold text-blue-800">{calculateHours(formData.startTime, formData.endTime)} ساعة</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button className="bg-blue-900 hover:bg-blue-800" onClick={() => onSave({ ...formData, totalHours: calculateHours(formData.startTime, formData.endTime) })}>حفظ</Button>
        </div>
      </div>
    </div>
  );
}