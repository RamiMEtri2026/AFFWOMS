import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Factory } from "../types";
import { factories as initialFactories } from "../data/mockData";
import { Plus, Search, Edit, Trash2, X, Factory as FactoryIcon } from "lucide-react";

export default function FactoriesPage() {
  const [factories, setFactories] = useState<Factory[]>(initialFactories);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);
  const [formData, setFormData] = useState({ nameAr: "", nameEn: "", location: "" });

  const filteredFactories = factories.filter(f => f.nameAr.includes(search) || f.id.includes(search));

  const handleAdd = () => {
    if (!formData.nameAr) return;
    const newFactory: Factory = {
      id: `F${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setFactories([...factories, newFactory]);
    setShowModal(false);
    setFormData({ nameAr: "", nameEn: "", location: "" });
  };

  const handleEdit = (factory: Factory) => {
    setEditingFactory(factory);
    setFormData({ nameAr: factory.nameAr, nameEn: factory.nameEn, location: factory.location });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editingFactory) return;
    setFactories(factories.map(f => f.id === editingFactory.id ? { ...f, ...formData } : f));
    setShowModal(false);
    setEditingFactory(null);
    setFormData({ nameAr: "", nameEn: "", location: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المصنع؟")) {
      setFactories(factories.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المصانع</h1>
          <p className="text-slate-500 mt-1">Factories Management</p>
        </div>
        <Button onClick={() => { setEditingFactory(null); setFormData({ nameAr: "", nameEn: "", location: "" }); setShowModal(true); }} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مصنع
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث عن مصنع..." className="pr-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFactories.map(factory => (
            <div key={factory.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FactoryIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{factory.nameAr}</h3>
                    <p className="text-sm text-slate-500">{factory.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(factory)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(factory.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">{factory.nameEn}</p>
                <p className="text-xs text-slate-400 mt-1">{factory.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-900 text-white">
              <h3 className="text-lg font-bold">{editingFactory ? "تعديل المصنع" : "إضافة مصنع جديد"}</h3>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">الموقع</label>
                <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <Button variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
              <Button className="bg-blue-900 hover:bg-blue-800" onClick={editingFactory ? handleUpdate : handleAdd}>
                {editingFactory ? "حفظ التعديلات" : "إضافة المصنع"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}