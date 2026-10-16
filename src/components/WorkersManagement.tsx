import { useState } from "react";
import { User, Worker, Factory, Department } from "../types";
import { defaultWorkers, defaultFactories, defaultDepartments } from "../data/mockData";
import { Search, Plus, Edit, Trash2, X, Shield } from "lucide-react";
import Button from "./ui/button";

interface WorkersManagementProps {
  userRole: User["role"];
  userFactoryId?: string;
  userDepartmentId?: string;
}

export default function WorkersManagement({ userRole, userFactoryId, userDepartmentId }: WorkersManagementProps) {
  const [workers, setWorkers] = useState<Worker[]>(defaultWorkers);
  const [factories] = useState<Factory[]>(defaultFactories);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [filterFactory, setFilterFactory] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");

  // Filter workers based on user role
  const getFilteredWorkers = () => {
    let filtered = workers;

    // Manager can only see workers in their department and factory
    if (userRole === "manager" && userFactoryId && userDepartmentId) {
      filtered = filtered.filter(
        (w) => w.factoryId === userFactoryId && w.departmentId === userDepartmentId
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (w) =>
          w.name.includes(searchTerm) ||
          w.employeeNumber.includes(searchTerm) ||
          w.jobTitle?.includes(searchTerm)
      );
    }

    // Apply factory filter (Super Admin only)
    if (userRole === "super_admin" && filterFactory) {
      filtered = filtered.filter((w) => w.factoryId === filterFactory);
    }

    // Apply department filter
    if (filterDepartment) {
      filtered = filtered.filter((w) => w.departmentId === filterDepartment);
    }

    return filtered;
  };

  // Get departments based on factory (for Manager role)
  const getAvailableDepartments = () => {
    if (userRole === "manager" && userFactoryId) {
      return departments.filter((d) => d.factoryId === userFactoryId);
    }
    if (filterFactory) {
      return departments.filter((d) => d.factoryId === filterFactory);
    }
    return departments;
  };

  const canManage = userRole === "super_admin" || userRole === "manager";

  // Check if user has permission to access this page
  if (userRole !== "super_admin" && userRole !== "manager") {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">غير مصرح</h2>
        <p className="text-slate-500">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
      </div>
    );
  }

  const handleSave = (worker: Worker) => {
    if (editingWorker) {
      setWorkers(workers.map((w) => (w.id === worker.id ? worker : w)));
    } else {
      setWorkers([...workers, { ...worker, id: `W${Date.now()}` }]);
    }
    setShowModal(false);
    setEditingWorker(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العامل؟")) {
      setWorkers(workers.filter((w) => w.id !== id));
    }
  };

  const getFactoryName = (factoryId: string) => {
    const factory = factories.find((f) => f.id === factoryId);
    return factory?.nameAr || factoryId;
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((d) => d.id === departmentId);
    return department?.nameAr || departmentId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة العمال</h1>
          {userRole === "manager" && (
            <p className="text-sm text-slate-500 mt-1">عرض عمال قسمك في مصنعك فقط</p>
          )}
        </div>
        {canManage && (
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة عامل
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الرقم الوظيفي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {userRole === "super_admin" && (
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">كل المصانع</option>
              {factories.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameAr}
                </option>
              ))}
            </select>
          )}

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">كل الأقسام</option>
            {getAvailableDepartments().map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">الرقم الوظيفي</th>
                {userRole === "super_admin" && (
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">المصنع</th>
                )}
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">القسم</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">المسمى الوظيفي</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">الحالة</th>
                {canManage && <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">الإجراءات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {getFilteredWorkers().map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-800">{worker.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{worker.employeeNumber}</td>
                  {userRole === "super_admin" && (
                    <td className="px-6 py-4 text-sm text-slate-600">{getFactoryName(worker.factoryId)}</td>
                  )}
                  <td className="px-6 py-4 text-sm text-slate-600">{getDepartmentName(worker.departmentId)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{worker.jobTitle || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        worker.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {worker.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingWorker(worker);
                            setShowModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(worker.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
        {getFilteredWorkers().length === 0 && (
          <div className="text-center py-12 text-slate-500">لا يوجد عمال</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <WorkerModal
          worker={editingWorker}
          factories={userRole === "super_admin" ? factories : factories.filter((f) => f.id === userFactoryId)}
          departments={getAvailableDepartments()}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingWorker(null);
          }}
          isManager={userRole === "manager"}
          userFactoryId={userFactoryId}
          userDepartmentId={userDepartmentId}
        />
      )}
    </div>
  );
}

interface WorkerModalProps {
  worker: Worker | null;
  factories: Factory[];
  departments: Department[];
  onSave: (worker: Worker) => void;
  onClose: () => void;
  isManager: boolean;
  userFactoryId?: string;
  userDepartmentId?: string;
}

function WorkerModal({ worker, factories, departments, onSave, onClose, isManager, userFactoryId, userDepartmentId }: WorkerModalProps) {
  const [form, setForm] = useState<Partial<Worker>>(
    worker || {
      name: "",
      employeeNumber: "",
      factoryId: isManager ? userFactoryId : "",
      departmentId: isManager ? userDepartmentId : "",
      phone: "",
      jobTitle: "",
      status: "active",
      createdAt: new Date(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as Worker);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">{worker ? "تعديل عامل" : "إضافة عامل جديد"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الرقم الوظيفي</label>
            <input
              type="text"
              value={form.employeeNumber || ""}
              onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          {!isManager && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">المصنع</label>
              <select
                value={form.factoryId || ""}
                onChange={(e) => setForm({ ...form, factoryId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">اختر المصنع</option>
                {factories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nameAr}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">القسم</label>
            <select
              value={form.departmentId || ""}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">اختر القسم</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameAr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الهاتف</label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
            <input
              type="text"
              value={form.jobTitle || ""}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الحالة</label>
            <select
              value={form.status || "active"}
              onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" className="flex-1">
              حفظ
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}