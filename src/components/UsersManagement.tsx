import { useState } from "react";
import { User } from "../types";
import { defaultUsers, defaultFactories } from "../data/mockData";
import { Search, Plus, Edit, Trash2, X, Shield } from "lucide-react";
import Button from "./ui/button";

interface UsersManagementProps {
  currentUserRole: User["role"];
}

export default function UsersManagement({ currentUserRole }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>("");

  if (currentUserRole !== "super_admin") {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">غير مصرح</h2>
        <p className="text-slate-500">فقط المدير العام يمكنه إدارة المستخدمين</p>
      </div>
    );
  }

  const getFilteredUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.includes(searchTerm) ||
          u.email.includes(searchTerm) ||
          u.jobTitle?.includes(searchTerm)
      );
    }

    if (filterRole) {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    return filtered;
  };

  const getRoleLabel = (role: User["role"]): string => {
    switch (role) {
      case "super_admin": return "مدير عام";
      case "manager": return "مدير مصنع";
      case "supervisor": return "مشرف";
      case "viewer": return "عرض فقط";
      default: return "مستخدم";
    }
  };

  const getRoleBadgeColor = (role: User["role"]): string => {
    switch (role) {
      case "super_admin": return "bg-purple-100 text-purple-700";
      case "manager": return "bg-blue-100 text-blue-700";
      case "supervisor": return "bg-green-100 text-green-700";
      case "viewer": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getFactoryName = (factoryId?: string) => {
    if (!factoryId) return "-";
    const factory = defaultFactories.find((f) => f.id === factoryId);
    return factory?.nameAr || factoryId;
  };

  const handleSave = (user: User) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, { ...user, id: `U${Date.now()}` }]);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h1>
          <p className="text-sm text-slate-500 mt-1">إضافة وتعديل وحذف المستخدمين</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة مستخدم
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">كل الأدوار</option>
            <option value="super_admin">مدير عام</option>
            <option value="manager">مدير مصنع</option>
            <option value="supervisor">مشرف</option>
            <option value="viewer">عرض فقط</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredUsers().map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{user.name?.charAt(0) || "؟"}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{user.name || "مستخدم"}</h3>
                  <p className="text-sm text-slate-500">{user.jobTitle || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setShowModal(true);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(user.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">البريد:</span>
                <span className="text-slate-600 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">الدور:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              {user.factoryId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">المصنع:</span>
                  <span className="text-slate-600">{getFactoryName(user.factoryId)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">الحالة:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {user.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredUsers().length === 0 && (
        <div className="bg-white rounded-xl shadow p-12 text-center text-slate-500">لا يوجد مستخدمين</div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

interface UserModalProps {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

function UserModal({ user, onSave, onClose }: UserModalProps) {
  const [form, setForm] = useState<Partial<User>>(
    user || {
      name: "",
      email: "",
      password: "",
      role: "viewer",
      jobTitle: "",
      factoryId: "",
      departmentId: "",
      status: "active",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as User);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-slate-800">{user ? "تعديل مستخدم" : "إضافة مستخدم جديد"}</h2>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
            <input
              type="text"
              value={form.jobTitle || ""}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={form.password || ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الدور</label>
            <select
              value={form.role || "viewer"}
              onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="super_admin">مدير عام</option>
              <option value="manager">مدير مصنع</option>
              <option value="supervisor">مشرف</option>
              <option value="viewer">عرض فقط</option>
            </select>
          </div>
          {(form.role === "manager" || form.role === "supervisor") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">المصنع</label>
              <select
                value={form.factoryId || ""}
                onChange={(e) => setForm({ ...form, factoryId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">اختر المصنع</option>
                {defaultFactories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nameAr}
                  </option>
                ))}
              </select>
            </div>
          )}
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