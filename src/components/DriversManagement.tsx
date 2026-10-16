import { useState } from "react";
import { Driver } from "../types";
import { Plus, Edit, Trash2, Search, Truck, Phone } from "lucide-react";
import Button from "./ui/button";

interface DriversManagementProps {
  userRole: string;
}

const initialDrivers: Driver[] = [
  { id: "DR1", name: "محمد أحمد", phone: "01001111111", vehicleNumber: "أ ب ج 1234", vehicleCapacity: 20, status: "active" },
  { id: "DR2", name: "سعيد محمود", phone: "01002222222", vehicleNumber: "د هـ و 5678", vehicleCapacity: 15, status: "active" },
  { id: "DR3", name: "علي حسن", phone: "01003333333", vehicleNumber: "ز ح ط 9012", vehicleCapacity: 25, status: "inactive" },
];

export default function DriversManagement({ userRole }: DriversManagementProps) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter(d =>
    d.name.includes(searchQuery) || d.vehicleNumber.includes(searchQuery)
  );

  const handleSave = (data: Partial<Driver>) => {
    if (editingDriver) {
      setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...data } : d));
    } else {
      const newDriver: Driver = {
        id: `DR${Date.now()}`,
        name: data.name || "",
        phone: data.phone || "",
        vehicleNumber: data.vehicleNumber || "",
        vehicleCapacity: data.vehicleCapacity || 0,
        status: "active"
      };
      setDrivers([...drivers, newDriver]);
    }
    setShowModal(false);
    setEditingDriver(null);
  };

  const handleDelete = (id: string) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة السائقين والمركبات</h1>
          <p className="text-slate-500">سجل السائقين والمركبات</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة سائق
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو رقم المركبة..."
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10"
          />
        </div>
      </div>

      {/* Drivers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${driver.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {driver.status === "active" ? "نشط" : "غير نشط"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{driver.name}</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {driver.phone}
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                {driver.vehicleNumber}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">السعة:</span>
                {driver.vehicleCapacity} عامل
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => { setEditingDriver(driver); setShowModal(true); }}>
                <Edit className="w-4 h-4 ml-1" /> تعديل
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(driver.id)} className="text-red-600">
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
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingDriver ? "تعديل سائق" : "إضافة سائق جديد"}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave({
                name: (e.target as any).name.value,
                phone: (e.target as any).phone.value,
                vehicleNumber: (e.target as any).vehicleNumber.value,
                vehicleCapacity: Number((e.target as any).vehicleCapacity.value)
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">اسم السائق</label>
                  <input name="name" defaultValue={editingDriver?.name} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الهاتف</label>
                  <input name="phone" defaultValue={editingDriver?.phone} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">رقم المركبة</label>
                  <input name="vehicleNumber" defaultValue={editingDriver?.vehicleNumber} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">سعة المركبة (عدد العمال)</label>
                  <input name="vehicleCapacity" type="number" defaultValue={editingDriver?.vehicleCapacity} className="w-full border border-slate-300 rounded-lg px-4 py-2.5" required />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingDriver(null); }} className="flex-1">إلغاء</Button>
                <Button type="submit" className="flex-1">حفظ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}