import { useState } from "react";
import { Settings as SettingsIcon, Clock, Bell, Shield } from "lucide-react";
import Button from "./ui/button";

export default function Settings() {
  const [settings, setSettings] = useState({
    defaultShiftStart: "16:00",
    defaultShiftEnd: "19:30",
    allowManualHoursEdit: true,
    allowOverlapWarning: true,
    notifyOnNewRequest: true,
    notifyOnApproval: true,
    notifyOnRejection: true
  });

  const handleSave = () => {
    alert("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">الإعدادات</h1>
        <p className="text-slate-500">إعدادات النظام العامة</p>
      </div>

      {/* Work Hours Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">إعدادات ساعات العمل</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">وقت البداية الافتراضي</label>
            <input
              type="time"
              value={settings.defaultShiftStart}
              onChange={(e) => setSettings({ ...settings, defaultShiftStart: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">وقت النهاية الافتراضي</label>
            <input
              type="time"
              value={settings.defaultShiftEnd}
              onChange={(e) => setSettings({ ...settings, defaultShiftEnd: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowManualHoursEdit}
              onChange={(e) => setSettings({ ...settings, allowManualHoursEdit: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-slate-700">السماح بتعديل الساعات يدوياً عند إنشاء الطلب</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowOverlapWarning}
              onChange={(e) => setSettings({ ...settings, allowOverlapWarning: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-slate-700">إظهار تحذير عند تعارض الورديات (قابل للتجاوز)</span>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">إعدادات الإشعارات</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifyOnNewRequest}
              onChange={(e) => setSettings({ ...settings, notifyOnNewRequest: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-slate-700">إشعار عند طلب سهرات جديد</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifyOnApproval}
              onChange={(e) => setSettings({ ...settings, notifyOnApproval: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-slate-700">إشعار عند الموافقة على الطلب</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifyOnRejection}
              onChange={(e) => setSettings({ ...settings, notifyOnRejection: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-slate-700">إشعار عند رفض الطلب</span>
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">الأمان</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">تغيير كلمة المرور</p>
              <p className="text-sm text-slate-500">تحديث كلمة مرور الحساب</p>
            </div>
            <Button variant="outline">تغيير</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">التحقق بخطوتين</p>
              <p className="text-sm text-slate-500">تفعيل المصادقة الثنائية</p>
            </div>
            <Button variant="outline">تفعيل</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">حفظ الإعدادات</Button>
      </div>
    </div>
  );
}