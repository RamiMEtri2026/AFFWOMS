import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Driver } from "../types";
import { drivers as initialDrivers, zones } from "../data/mockData";
import { Plus, Search, Edit, Trash2, X, Truck, Phone, Car, MapPin } from "lucide-react";

export default function DriversPage() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = d.name.includes(search) || d.vehicleNumber.includes(search) || d.phone.includes(search);
    const matchesZone = zoneFilter === "all" || d.zoneId === zoneFilter;
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesZone && matchesStatus;
  });

  const getZoneName = (zoneId: string) => {
    return zones.find((z) => z.id === zoneId)?.name || zoneId;
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا السائق؟")) {
      setDrivers(drivers.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة السائقين والمركبات</h1>
          <p className="text-slate-500 mt-1">Drivers & Vehicles Management</p>
        </div>
        {user?.role === "super_admin" && (
          <Button
            onClick={() => { setEditingDriver(null); setShowModal(true); }}
            className="bg-blue-900 hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة سائق
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
              placeholder="البحث عن سائق أو مركبة..."
              className="pr-10"
            />
          </div>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">جميع المناطق</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
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

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className={`rounded-xl border p-5 ${
              driver.status === "active"
                ? "bg-white border-slate-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${driver.status === "active" ? "bg-blue-100" : "bg-red-100"}`}>
                  <Truck className={`w-6 h-6 ${driver.status === "active" ? "text-blue-600" : "text-red-600"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{driver.name}</h3>
                  <p className="text-sm text-slate-500">{driver.phone}</p>
                </div>
              </div>
              {user?.role === "super_admin" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditingDriver(driver); setShowModal(true); }}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Car className="w-4 h-4" />
                  <span className="text-sm">رقم المركبة:</span>
                </div>
                <span className="font-medium text-slate-800">{driver.vehicleNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm">السعة:</span>
                </div>
                <span className="font-medium text-slate-800">{driver.vehicleCapacity}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">المنطقة:</span>
                </div>
                <span className="font-medium text-blue-900 bg-blue-50 px-2 py-1 rounded text-sm">
                  {getZoneName(driver.zoneId)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-sm text-slate-500">الحالة:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  driver.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {driver.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">لا توجد نتائج مطابقة للبحث</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <DriverModal
          driver={editingDriver}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editingDriver) {
              setDrivers(drivers.map((d) => (d.id === editingDriver.id ? { ...d, ...data } : d)));
            } else {
              setDrivers([
                ...drivers,
                {
                  ...data,
                  id: `DR${Date.now()}`,
                  createdAt: new Date().toISOString(),
                } as Driver,
              ]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

// Driver Modal Component
function DriverModal({
  driver,
  onClose,
  onSave,
}: {
  driver: Driver | null;
  onClose: () => void;
  onSave: (data: Partial<Driver>) => void;
}) {
  const [formData, setFormData] = useState({
    name: driver?.name || "",
    phone: driver?.phone || "",
    vehicleNumber: driver?.vehicleNumber || "",
    vehicleCapacity: driver?.vehicleCapacity || "20 راكب",
    zoneId: driver?.zoneId || "Z1",
    status: driver?.status || "active" as "active" | "inactive",
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.vehicleNumber.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white sticky top-0">
          <h3 className="text-lg font-bold">
            {driver ? "تعديل بيانات السائق" : "إضافة سائق جديد"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Driver Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              اسم السائق <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أدخل اسم السائق"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01xxxxxxxxx"
              type="tel"
            />
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              رقم المركبة <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              placeholder="مثال: ABC-1234"
            />
          </div>

          {/* Vehicle Capacity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">سعة المركبة</label>
            <select
              value={formData.vehicleCapacity}
              onChange={(e) => setFormData({ ...formData, vehicleCapacity: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="10 راكب">10 راكب</option>
              <option value="15 راكب">15 راكب</option>
              <option value="20 راكب">20 راكب</option>
              <option value="25 راكب">25 راكب</option>
              <option value="30 راكب">30 راكب</option>
              <option value="35 راكب">35 راكب</option>
              <option value="40 راكب">40 راكب</option>
            </select>
          </div>

          {/* Zone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="w-4 h-4 inline ml-1" />
              المنطقة <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.zoneId}
              onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
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
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800" onClick={handleSubmit}>
            {driver ? "حفظ التعديلات" : "إضافة السائق"}
          </Button>
        </div>
      </div>
    </div>
  );
}