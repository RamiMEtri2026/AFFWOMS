import { useState } from "react";
import { Button } from "../components/ui/button";
import { Clock, Bell, Shield, Globe, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    workdayStart: "08:00",
    workdayEnd: "16:00",
    defaultShiftTemplate: "evening",
    timezone: "Africa/Cairo",
    allowManualHoursEdit: true,
    allowOverlapWarning: true,
    emailNotifications: true,
    pushNotifications: true,
    notifyOnNewRequest: true,
    notifyOnApproval: true,
    notifyOnRejection: true,
    notifyOnShiftStart: true,
    notifyOnShiftEnd: true,
  });

  const handleSave = () => {
    alert("تم حفظ الإعدادات بنجاح!");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الإعدادات</h1>
          <p className="text-slate-500 mt-1">System Settings</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-900 hover:bg-blue-800">
          <Save className="w-4 h-4 ml-2" />
          حفظ الإعدادات
        </Button>
      </div>

      {/* Workday Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
          <h2 className="text-lg font-bold text-slate-800">إعدادات يوم العمل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">بداية يوم العمل</label>
            <input
              type="time"
              value={settings.workdayStart}
              onChange={(e) => setSettings({ ...settings, workdayStart: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">نهاية يوم العمل</label>
            <input
              type="time"
              value={settings.workdayEnd}
              onChange={(e) => setSettings({ ...settings, workdayEnd: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">قالب الوردية الافتراضي</label>
            <select
              value={settings.defaultShiftTemplate}
              onChange={(e) => setSettings({ ...settings, defaultShiftTemplate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="evening">وردية مسائية (16:00 - 19:30)</option>
              <option value="night">وردية ليلية (18:00 - 00:00)</option>
              <option value="late">وردية متأخرة (20:00 - 02:00)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المنطقة الزمنية</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="Africa/Cairo">القاهرة (GMT+2)</option>
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overtime Rules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg"><Shield className="w-5 h-5 text-green-600" /></div>
          <h2 className="text-lg font-bold text-slate-800">قواعد السهرات</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-800">السماح بتعديل الساعات يدوياً</p>
              <p className="text-sm text-slate-500">السماح للمدير بتعديل ساعات العمل عند إنشاء الطلب</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowManualHoursEdit}
              onChange={(e) => setSettings({ ...settings, allowManualHoursEdit: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-800">تحذير تعارض الورديات</p>
              <p className="text-sm text-slate-500">إظهار تحذير عند وجود وردية أخرى لنفس العامل في نفس الفترة</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowOverlapWarning}
              onChange={(e) => setSettings({ ...settings, allowOverlapWarning: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg"><Bell className="w-5 h-5 text-amber-600" /></div>
          <h2 className="text-lg font-bold text-slate-800">إعدادات الإشعارات</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-800">إشعارات البريد الإلكتروني</p>
              <p className="text-sm text-slate-500">إرسال إشعارات عبر البريد الإلكتروني</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-800">إشعارات فورية</p>
              <p className="text-sm text-slate-500">إرسال إشعارات فورية داخل التطبيق</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>
          <div className="border-t border-slate-200 pt-4 mt-4">
            <p className="font-medium text-slate-800 mb-3">إشعارات الأحداث</p>
            <div className="space-y-2">
              {[
                { key: "notifyOnNewRequest", label: "طلب سهرات جديد" },
                { key: "notifyOnApproval", label: "موافقة على الطلب" },
                { key: "notifyOnRejection", label: "رفض الطلب" },
                { key: "notifyOnShiftStart", label: "بدء الوردية" },
                { key: "notifyOnShiftEnd", label: "انتهاء الوردية" },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-2 cursor-pointer">
                  <span className="text-slate-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}