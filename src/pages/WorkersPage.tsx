import { useState } from "react";
import { Plus, Search, Edit, Trash2, Users, Building2, Factory, Briefcase, UserCheck, UserX } from "lucide-react";
import { Button } from "../components/ui/button";
import { workers as initialWorkers, factories, departments, zones } from "../data/mockData";
import { Worker } from "../types";

export default function WorkersPage() {
  const [workersList, setWorkersList] = useState<Worker[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    factoryId: "",
    departmentId: "",
    zoneId: "",
    jobTitle: "",
    status: "active" as "active" | "inactive",
  });

  const filteredWorkers = workersList.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFactory = !selectedFactory || worker.factoryId === selectedFactory;
    const matchesDepartment = !selectedDepartment || worker.departmentId === selectedDepartment;
    const matchesStatus = !selectedStatus || worker.status === selectedStatus;
    return matchesSearch && matchesFactory && matchesDepartment && matchesStatus;
  });

  const handleAddWorker = () => {
    const newWorker: Worker = {
      id: `W${Date.now()}`,
      name: formData.name,
      employeeNumber: `EMP${Date.now()}`,
      factoryId: formData.factoryId,
      departmentId: formData.departmentId,
      zoneId: formData.zoneId,
      jobTitle: formData.jobTitle,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkersList([...workersList, newWorker]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditWorker = () => {
    if (!selectedWorker) return;
    setWorkersList(workersList.map((w) =>
      w.id === selectedWorker.id
        ? { ...w, ...formData, updatedAt: new Date().toISOString() }
        : w
    ));
    setShowEditModal(false);
    setSelectedWorker(null);
    resetForm();
  };

  const handleDeleteWorker = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العامل؟")) {
      setWorkersList(workersList.filter((w) => w.id !== id));
    }
  };

  const openEditModal = (worker: Worker) => {
    setSelectedWorker(worker);
    setFormData({
      name: worker.name,
      factoryId: worker.factoryId,
      departmentId: worker.departmentId,
      zoneId: worker.zoneId || "",
      jobTitle: worker.jobTitle,
      status: worker.status,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      factoryId: "",
      departmentId: "",
      zoneId: "",
      jobTitle: "",
      status: "active",
    });
  };

  const getFactoryName = (id: string) => factories.find((f) => f.id === id)?.nameAr || "-";
  const getDepartmentName = (id: string) => departments.find((d) => d.id === id)?.nameAr || "-";
  const getZoneName = (id: string) => zones.find((z) => z.id === id)?.name || "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة العمال</h1>
          <p className="text-slate-500 mt-1">سجل العمال والموظفين</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800 text-white gap-2">
          <Plus className="w-4 h-4" />
          إضافة عامل
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">إجمالي العمال</p>
              <p className="text-2xl font-bold text-slate-800">{workersList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">العمال النشطين</p>
              <p className="text-2xl font-bold text-green-600">{workersList.filter(w => w.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">العمال غير النشطين</p>
              <p className="text-2xl font-bold text-red-600">{workersList.filter(w => w.status === "inactive").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Factory className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">المصانع</p>
              <p className="text-2xl font-bold text-purple-600">{factories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="البحث بالاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل المصانع</option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>{factory.nameAr}</option>
            ))}
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الأقسام</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.nameAr}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المصنع</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">القسم</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الجهة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المسمى الوظيفي</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    لا يوجد عمال مطابقين للبحث
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-slate-800">{worker.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getFactoryName(worker.factoryId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getDepartmentName(worker.departmentId)}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        {getZoneName(worker.zoneId || "")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{worker.jobTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        worker.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {worker.status === "active" ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(worker)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">إضافة عامل جديد</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم العامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسم العامل"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المصنع</label>
                  <select
                    value={formData.factoryId}
                    onChange={(e) => setFormData({ ...formData, factoryId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر المصنع</option>
                    {factories.map((factory) => (
                      <option key={factory.id} value={factory.id}>{factory.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">القسم</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الجهة</label>
                <select
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر الجهة</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="المسمى الوظيفي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
              <Button onClick={() => { setShowAddModal(false); resetForm(); }} variant="outline">
                إلغاء
              </Button>
              <Button onClick={handleAddWorker} className="bg-blue-900 hover:bg-blue-800 text-white">
                إضافة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">تعديل بيانات العامل</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم العامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المصنع</label>
                  <select
                    value={formData.factoryId}
                    onChange={(e) => setFormData({ ...formData, factoryId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر المصنع</option>
                    {factories.map((factory) => (
                      <option key={factory.id} value={factory.id}>{factory.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">القسم</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الجهة</label>
                <select
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر الجهة</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
              <Button onClick={() => { setShowEditModal(false); setSelectedWorker(null); resetForm(); }} variant="outline">
                إلغاء
              </Button>
              <Button onClick={handleEditWorker} className="bg-blue-900 hover:bg-blue-800 text-white">
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}