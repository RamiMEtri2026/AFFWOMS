import { useState } from "react";
import { ShiftTemplate } from "../types";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import Button from "./ui/button";

interface ShiftTemplatesProps {
  userRole: string;
}

const initialTemplates: ShiftTemplate[] = [
  { id: "ST1", name: "الوردية الأساسية", startTime: "16:00", endTime: "19:30", totalHours: 3.5 },
  { id: "ST2", name: "وردية المساء", startTime: "18:00", endTime: "00:00", totalHours: 6 },
  { id: "ST3", name: "وردية الليل", startTime: "20:00", endTime: "02:00", totalHours: 6 },
];

export default function ShiftTemplates({ userRole }: ShiftTemplatesProps) {
  const [templates, setTemplates] = useState<ShiftTemplate[]>(initialTemplates);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);

  const calculateHours = (start: string, end: string): number => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    return (endMinutes - startMinutes) / 60;
  };

  const handleSave = (data: Partial<ShiftTemplate>) => {
    const totalHours = calculateHours(data.startTime || "00:00", data.endTime || "00:00");
    
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, ...data, totalHours } : t));
    } else {
      const newTemplate: ShiftTemplate = {
        id: `ST${Date.now()}`,
        name: data.name || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        totalHours
      };
      setTemplates([...templates, newTemplate]);
    }
    setShowModal(false);
    setEditingTemplate(null);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">قوالب الورديات</h1>
          <p className="text-slate-500">إدارة قوالب ورديات السهرات</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة قالب
        </Button>
      </div>

      {/* Templates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                {template.totalHours} ساعات
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">{template.name}</h3>
            <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
              <span>{template.startTime}</span>
              <span>→</span>
              <span>{template.endTime}</span>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => { setEditingTemplate(template); setShowModal(true); }}>
                <Edit className="w-4 h-4 ml-1" /> تعديل
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 ml-1" /> حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingTemplate ? "تعديل قالب" : "إضافة قالب جديد"}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave({
                name: (e.target as any).name.value,
                startTime: (e.target as any).startTime.value,
                endTime: (e.target as any).endTime.value
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">اسم القالب</label>
                  <input name="name" defaultValue={editingTemplate?.name} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">وقت البداية</label>
                    <input name="startTime" type="time" defaultValue={editingTemplate?.startTime} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">وقت النهاية</label>
                    <input name="endTime" type="time" defaultValue={editingTemplate?.endTime} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingTemplate(null); }} className="flex-1">إلغاء</Button>
                <Button type="submit" className="flex-1">حفظ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}