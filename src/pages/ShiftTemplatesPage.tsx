import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShiftTemplate } from "../types";
import { shiftTemplates as initialTemplates } from "../data/mockData";
import { Plus, Search, Edit, Trash2, X, Clock } from "lucide-react";

export default function ShiftTemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ShiftTemplate[]>(initialTemplates);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
  const [formData, setFormData] = useState({ name: "", startTime: "", endTime: "" });

  const filteredTemplates = templates.filter(t => t.name.includes(search));

  const calculateHours = (start: string, end: string): number => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = endMinutes >= startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes;
    return Math.round((diff / 60) * 10) / 10;
  };

  const handleAdd = () => {
    if (!formData.name || !formData.startTime || !formData.endTime) return;
    const newTemplate: ShiftTemplate = {
      id: `ST${Date.now()}`,
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      totalHours: calculateHours(formData.startTime, formData.endTime),
      createdBy: user?.id || "",
      createdAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    setShowModal(false);
    setFormData({ name: "", startTime: "", endTime: "" });
  };

  const handleEdit = (template: ShiftTemplate) => {
    setEditingTemplate(template);
    setFormData({ name: template.name, startTime: template.startTime, endTime: template.endTime });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editingTemplate) return;
    setTemplates(templates.map(t => t.id === editingTemplate.id ? {
      ...t,
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      totalHours: calculateHours(formData.startTime, formData.endTime),
    } : t));
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({ name: "", startTime: "", endTime: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا القالب؟")) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">قوالب الورديات</h1>
          <p className="text-slate-500 mt-1">Shift Templates Management</p>
        </div>
        {user?.role === "super_admin" && (
          <Button onClick={() => { setFormData({ name: "", startTime: "", endTime: "" }); setEditingTemplate(null); setShowModal(true); }} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="w-4 h-4 ml-2" />
            إضافة قالب
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث عن قالب..." className="pr-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{template.name}</h3>
                    <p className="text-sm text-slate-500">{template.startTime} - {template.endTime}</p>
                  </div>
                </div>
                {user?.role === "super_admin" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(template)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(template.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">إجمالي الساعات:</span>
                  <span className="font-bold text-blue-900">{template.totalHours} ساعة</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white">
              <h3 className="text-lg font-bold">{editingTemplate ? "تعديل القالب" : "إضافة قالب جديد"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-blue-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">اسم القالب</label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: وردية مسائية" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">وقت البداية</label>
                  <Input type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">وقت النهاية</label>
                  <Input type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                </div>
              </div>
              {formData.startTime && formData.endTime && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">إجمالي الساعات: <span className="font-bold">{calculateHours(formData.startTime, formData.endTime)} ساعة</span></p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <Button variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
              <Button className="bg-blue-900 hover:bg-blue-800" onClick={editingTemplate ? handleUpdate : handleAdd}>
                {editingTemplate ? "حفظ التعديلات" : "إضافة القالب"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}