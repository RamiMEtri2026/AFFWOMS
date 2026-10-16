import { useState } from "react";
import { Department } from "../types";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import Button from "./ui/button";

interface DepartmentsManagementProps {
  userRole: string;
  userFactoryId?: string;
}

const defaultDepartments: Department[] = [
  { id: "D1", nameAr: "ضمان الجودة والرقابة", nameEn: "Quality Assurance & Control (QA/QC)", factoryId: "F4" },
  { id: "D2", nameAr: "الصيانة", nameEn: "Maintenance", factoryId: "F4" },
  { id: "D3", nameAr: "المخازن والمستودعات", nameEn: "Warehouse & Stores", factoryId: "F4" },
  { id: "D4", nameAr: "النظافة والصحة", nameEn: "Sanitation/Hygiene", factoryId: "F4" },
  { id: "D5", nameAr: "تخطيط ومراقبة الإنتاج", nameEn: "Production Planning & Control (PPC)", factoryId: "F4" },
  { id: "D6", nameAr: "البيئة والصحة والسلامة", nameEn: "Environment, Health & Safety (EHS)", factoryId: "F4" },
  { id: "D7", nameAr: "الإدارة والدعم", nameEn: "Administration & Support", factoryId: "F4" },
  { id: "D8", nameAr: "ضمان الجودة والرقابة", nameEn: "Quality Assurance & Control (QA/QC)", factoryId: "F2" },
  { id: "D9", nameAr: "الصيانة", nameEn: "Maintenance", factoryId: "F2" },
  { id: "D10", nameAr: "ضمان الجودة والرقابة", nameEn: "Quality Assurance & Control (QA/QC)", factoryId: "F3" },
];

const factories = [
  { id: "F4", name: "مصنع المنطقة الرابعة" },
  { id: "F2", name: "مصنع المنطقة الثانية" },
  { id: "F3", name: "مصنع المنطقة الثالثة" }
];

export default function DepartmentsManagement({ userRole, userFactoryId }: DepartmentsManagementProps) {
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [filterFactory, setFilterFactory] = useState(userFactoryId || "");
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const filteredDepartments = departments.filter(d => !filterFactory || d.factoryId === filterFactory);

  const handleSave = (data: Partial<Department>) => {
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...data } : d));
    } else {
      const newDept: Department = {
        id: `D${Date.now()}`,
        nameAr: data.nameAr || "",
        nameEn: data.nameEn || "",
        factoryId: data.factoryId || ""
      };
      setDepartments([...departments, newDept]);
    }
    setShowModal(false);
    setEditingDept(null);
  };

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الأقسام</h1>
          <p className="text-slate-500">إدارة أقسام المصانع</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة قسم
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow p-4">
        <select
          value={filterFactory}
          onChange={(e) => setFilterFactory(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2.5"
        >
          <option value="">كل المصانع</option>
          {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-right py-4 px-6 font-medium text-slate-600">القسم</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">الاسم بالإنجليزية</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">المصنع</th>
              <th className="text-right py-4 px-6 font-medium text-slate-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="hover:bg-slate-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{dept.nameAr}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">{dept.nameEn}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{dept.factoryId}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingDept(dept); setShowModal(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(dept.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingDept ? "تعديل قسم" : "إضافة قسم جديد"}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave({
                nameAr: (e.target as any).nameAr.value,
                nameEn: (e.target as any).nameEn.value,
                factoryId: (e.target as any).factoryId.value
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الاسم بالعربية</label>
                  <input name="nameAr" defaultValue={editingDept?.nameAr} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الاسم بالإنجليزية</label>
                  <input name="nameEn" defaultValue={editingDept?.nameEn} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">المصنع</label>
                  <select name="factoryId" defaultValue={editingDept?.factoryId} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required>
                    {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingDept(null); }} className="flex-1">إلغاء</Button>
                <Button type="submit" className="flex-1">حفظ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}