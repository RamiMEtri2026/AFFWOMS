import { useState } from "react";
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, XCircle, Clock, Filter, CheckCheck } from "lucide-react";
import { notifications as initialNotifications } from "../data/mockData";
import { Notification } from "../types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "error": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-100";
      case "warning": return "bg-amber-100";
      case "error": return "bg-red-100";
      default: return "bg-blue-100";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">مركز الإشعارات</h1>
          <p className="text-slate-500 mt-1">Notifications Center</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {unreadCount} إشعار غير مقروء
            </span>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <CheckCheck className="w-5 h-5" />
            تحديد الكل كمقروء
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            filter === "all" 
              ? "bg-blue-900 text-white shadow-md" 
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-5 h-5" />
          جميع الإشعارات ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            filter === "unread" 
              ? "bg-amber-500 text-white shadow-md" 
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-5 h-5" />
          غير مقروء ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 text-lg">لا توجد إشعارات</p>
            <p className="text-slate-400 text-sm mt-1">ستظهر الإشعارات الجديدة هنا</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl border transition-all hover:shadow-md ${
                !notification.isRead 
                  ? "border-r-4 border-r-blue-500 shadow-sm" 
                  : "border-slate-200"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${getBgColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-slate-800 leading-relaxed ${
                          !notification.isRead ? "font-semibold" : ""
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(notification.createdAt)}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {!notification.isRead && (
                        <span className="flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          جديد
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعليم كمقروء"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف الإشعار"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      {filteredNotifications.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            عرض {filteredNotifications.length} من {notifications.length} إشعار
          </p>
          {unreadCount > 0 && (
            <p className="text-sm text-blue-600 font-medium">
              {unreadCount} إشعار بانتظار القراءة
            </p>
          )}
        </div>
      )}
    </div>
  );
}