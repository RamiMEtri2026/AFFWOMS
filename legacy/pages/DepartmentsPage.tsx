import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Department } from "../types";
import { departments as initialDepartments, factories } from "../data/mockData";
import { Plus, Search, Edit, Trash2, X, Building2 } from "lucide-react";

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [search, setSearch] = useState("");
  const [factoryFilter, setFactoryFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ nameAr: "", nameEn: "", factoryId: "" });

  const filteredDepartments = departments.filter(d => {
    const matchSearch = d.nameAr.includes(search) || d.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchFactory = factoryFilter === "all" || d.factoryId === factoryFilter;
    const matchPerm = user?.role === "super_admin" || user?.factoryId === d.factoryId;
    return matchSearch && matchFactory && matchPerm;
  });

  const handleAdd = () => {
    if (!formData.nameAr || !formData.factoryId) return;
    const newDept: Department = {
      id: `D${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setDepartments([...departments, newDept]);
    setShowModal(false);
    setFormData({ nameAr: "", nameEn: "", factoryId: "" });
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ nameAr: dept.nameAr, nameEn: dept.nameEn, factoryId: dept.factoryId });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editingDept) return;
    setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...formData } : d));
    setShowModal(false);
    setEditingDept(null);
    setFormData({ nameAr: "", nameEn: "", factoryId: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الأقسام</h1>
          <p className="text-slate-500 mt-1">Departments Management</p>
        </div>
        <Button onClick={() => { setEditingDept(null); setFormData({ nameAr: "", nameEn: "", factoryId: user?.factoryId || "" }); setShowModal(true); }} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 ml-2" />
          إضافة قسم
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث عن قسم..." className="pr-10" />
          </div>
          {user?.role === "super_admin" && (
            <select value={factoryFilter} onChange={e => setFactoryFilter(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-lg">
              <option value="all">جميع المصانع</option>
              {factories.map(f => <option key={f.id} value={f.id}>{f.nameAr}</option>)}
            </select>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-right py-3 px-4 font-semibold text-slate-700">القسم</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">الاسم بالإنجليزية</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">المصنع</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dept => (
                <tr key={dept.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-800">{dept.nameAr}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{dept.nameEn}</td>
                  <td className="py-3 px-4 text-slate-600">{factories.find(f => f.id === dept.factoryId)?.nameAr}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(dept)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(dept.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white">
              <h3 className="text-lg font-bold">{editingDept ? "تعديل القسم" : "إضافة قسم جديد"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-blue-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الاسم بالعربية</label>
                <Input value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الاسم بالإنجليزية</label>
                <Input value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">المصنع</label>
                <select value={formData.factoryId} onChange={e => setFormData({ ...formData, factoryId: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="">اختر المصنع</option>
                  {factories.map(f => <option key={f.id} value={f.id}>{f.nameAr}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <Button variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
              <Button className="bg-blue-900 hover:bg-blue-800" onClick={editingDept ? handleUpdate : handleAdd}>
                {editingDept ? "حفظ التعديلات" : "إضافة القسم"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}