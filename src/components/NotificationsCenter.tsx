import { useNotifications } from "../context/NotificationContext";
import { Bell, Check, Trash2, BellOff } from "lucide-react";
import Button from "./ui/button";

export default function NotificationsCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">مركز الإشعارات</h1>
          <p className="text-slate-500">جميع الإشعارات والتنبيهات</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">إجمالي الإشعارات</p>
              <p className="text-2xl font-bold text-slate-800">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">غير مقروءة</p>
              <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">مقروءة</p>
              <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <BellOff className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex items-start gap-4 ${!notification.isRead ? "bg-blue-50" : ""}`}
              >
                <div className={`p-2 rounded-lg ${!notification.isRead ? "bg-blue-100" : "bg-slate-100"}`}>
                  <Bell className={`w-5 h-5 ${!notification.isRead ? "text-blue-600" : "text-slate-400"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-slate-800 ${!notification.isRead ? "font-medium" : ""}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{formatDate(notification.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearNotification(notification.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}