import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { User } from "../types";
import { users as initialUsers, factories } from "../data/mockData";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as User["role"],
    jobTitle: "",
    factoryId: "",
    status: "active" as "active" | "inactive",
  });

  const filteredUsers = users.filter(u => u.name.includes(search) || u.email.includes(search));

  const roleLabels = {
    super_admin: "مدير عام",
    manager: "مدير",
    supervisor: "مشرف",
    viewer: "عرض فقط",
  };

  const handleAdd = () => {
    if (!formData.name || !formData.email) return;
    const newUser: User = {
      id: `U${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      jobTitle: user.jobTitle,
      factoryId: user.factoryId || "",
      status: user.status,
    });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    setShowModal(false);
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "viewer", jobTitle: "", factoryId: "", status: "active" });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h1>
          <p className="text-slate-500 mt-1">Users Management</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingUser(null); setShowModal(true); }} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مستخدم
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث عن مستخدم..." className="pr-10" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-right py-3 px-4 font-semibold text-slate-700">الاسم</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">الدور</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">المسمى الوظيفي</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">المصنع</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">الحالة</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{user.name}</td>
                  <td className="py-3 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "super_admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "manager" ? "bg-blue-100 text-blue-700" :
                      user.role === "supervisor" ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.jobTitle}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {user.factoryId ? factories.find(f => f.id === user.factoryId)?.nameAr : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white">
              <h3 className="text-lg font-bold">{editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-blue-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الاسم</label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الدور</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as User["role"] })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="super_admin">مدير عام</option>
                  <option value="manager">مدير</option>
                  <option value="supervisor">مشرف</option>
                  <option value="viewer">عرض فقط</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">المسمى الوظيفي</label>
                <Input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} />
              </div>
              {formData.role !== "super_admin" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">المصنع</label>
                  <select value={formData.factoryId} onChange={e => setFormData({ ...formData, factoryId: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option value="">اختر المصنع</option>
                    {factories.map(f => <option key={f.id} value={f.id}>{f.nameAr}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الحالة</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <Button variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
              <Button className="bg-blue-900 hover:bg-blue-800" onClick={editingUser ? handleUpdate : handleAdd}>
                {editingUser ? "حفظ التعديلات" : "إضافة المستخدم"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}