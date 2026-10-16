import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Zone } from "../types";
import { zones as initialZones } from "../data/mockData";
import { Plus, Search, Edit, Trash2, X, MapPin, CheckCircle, XCircle } from "lucide-react";

export default function ZonesPage() {
  const { user } = useAuth();
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const filteredZones = zones.filter((z) => {
    const matchesSearch = z.name.includes(search);
    const matchesStatus = statusFilter === "all" || z.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المنطقة؟")) {
      setZones(zones.filter((z) => z.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المناطق</h1>
          <p className="text-slate-500 mt-1">Zones Management</p>
        </div>
        {user?.role === "super_admin" && (
          <Button
            onClick={() => { setEditingZone(null); setShowModal(true); }}
            className="bg-blue-900 hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة منطقة
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
              placeholder="البحث عن منطقة..."
              className="pr-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">إجمالي المناطق</p>
              <p className="text-xl font-bold text-slate-800">{zones.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">المناطق النشطة</p>
              <p className="text-xl font-bold text-green-700">{zones.filter(z => z.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">المناطق غير النشطة</p>
              <p className="text-xl font-bold text-red-700">{zones.filter(z => z.status === "inactive").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">#</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">اسم المنطقة</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">تاريخ الإنشاء</th>
                {user?.role === "super_admin" && (
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">الإجراءات</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredZones.map((zone, index) => (
                <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-800">{zone.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      zone.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {zone.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(zone.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  {user?.role === "super_admin" && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditingZone(zone); setShowModal(true); }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredZones.length === 0 && (
          <div className="p-12 text-center">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">لا توجد نتائج مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ZoneModal
          zone={editingZone}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editingZone) {
              setZones(zones.map((z) => (z.id === editingZone.id ? { ...z, ...data } : z)));
            } else {
              setZones([
                ...zones,
                {
                  ...data,
                  id: `Z${Date.now()}`,
                  createdAt: new Date().toISOString(),
                } as Zone,
              ]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

// Zone Modal Component
function ZoneModal({
  zone,
  onClose,
  onSave,
}: {
  zone: Zone | null;
  onClose: () => void;
  onSave: (data: Partial<Zone>) => void;
}) {
  const [formData, setFormData] = useState({
    name: zone?.name || "",
    status: zone?.status || "active" as "active" | "inactive",
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("يرجى إدخال اسم المنطقة");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white rounded-t-xl">
          <h3 className="text-lg font-bold">
            {zone ? "تعديل المنطقة" : "إضافة منطقة جديدة"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Zone Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="w-4 h-4 inline ml-1" />
              اسم المنطقة <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أدخل اسم المنطقة"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">الحالة</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800" onClick={handleSubmit}>
            {zone ? "حفظ التعديلات" : "إضافة المنطقة"}
          </Button>
        </div>
      </div>
    </div>
  );
}