import { useState } from "react";
import { Factory } from "../types";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import Button from "./ui/button";

interface FactoriesManagementProps {
  userRole: string;
}

const defaultFactories: Factory[] = [
  { id: "F4", name: "مصنع المنطقة الرابعة", nameEn: "Factory 4 - Spire Dryer, Liquid Flavor and Powder", location: "المنطقة الصناعية الرابعة", createdAt: new Date().toISOString() },
  { id: "F2", name: "مصنع المنطقة الثانية", nameEn: "Factory 2 - Fragrance", location: "المنطقة الصناعية الثانية", createdAt: new Date().toISOString() },
  { id: "F3", name: "مصنع المنطقة الثالثة", nameEn: "Factory 3 - Herbs", location: "المنطقة الصناعية الثالثة", createdAt: new Date().toISOString() },
];

export default function FactoriesManagement({ userRole }: FactoriesManagementProps) {
  const [factories, setFactories] = useState<Factory[]>(defaultFactories);
  const [showModal, setShowModal] = useState(false);
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);

  const handleSave = (data: Partial<Factory>) => {
    if (editingFactory) {
      setFactories(factories.map(f => f.id === editingFactory.id ? { ...f, ...data } : f));
    } else {
      const newFactory: Factory = {
        id: data.id || `F${Date.now()}`,
        name: data.name || "",
        nameEn: data.nameEn || "",
        location: data.location || "",
        createdAt: new Date().toISOString()
      };
      setFactories([...factories, newFactory]);
    }
    setShowModal(false);
    setEditingFactory(null);
  };

  const handleDelete = (id: string) => {
    setFactories(factories.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المصانع</h1>
          <p className="text-slate-500">إدارة مصانع الشركة</p>
        </div>
        {userRole === "super_admin" && (
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة مصنع
          </Button>
        )}
      </div>

      {/* Factories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factories.map((factory) => (
          <div key={factory.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                {factory.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{factory.name}</h3>
            <p className="text-sm text-slate-500 mb-3">{factory.nameEn}</p>
            <p className="text-sm text-slate-600">{factory.location}</p>
            {userRole === "super_admin" && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => { setEditingFactory(factory); setShowModal(true); }}>
                  <Edit className="w-4 h-4 ml-1" /> تعديل
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(factory.id)} className="text-red-600">
                  <Trash2 className="w-4 h-4 ml-1" /> حذف
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingFactory ? "تعديل مصنع" : "إضافة مصنع جديد"}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave({
                id: (e.target as any).factoryId.value,
                name: (e.target as any).name.value,
                nameEn: (e.target as any).nameEn.value,
                location: (e.target as any).location.value
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">معرف المصنع</label>
                  <input name="factoryId" defaultValue={editingFactory?.id} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">اسم المصنع (عربي)</label>
                  <input name="name" defaultValue={editingFactory?.name} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">اسم المصنع (إنجليزي)</label>
                  <input name="nameEn" defaultValue={editingFactory?.nameEn} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الموقع</label>
                  <input name="location" defaultValue={editingFactory?.location} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingFactory(null); }} className="flex-1">إلغاء</Button>
                <Button type="submit" className="flex-1">حفظ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}