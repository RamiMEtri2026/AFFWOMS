import { useState, useRef, useEffect } from "react";
import { User } from "../types";
import { Bell, Menu, LogOut, Settings, User as UserIcon, Check, X } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import Button from "./ui/button";

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onNavigate?: (page: string) => void;
}

export default function Header({ user, onLogout, onToggleSidebar, onNavigate }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return "✅";
      case "warning": return "⚠️";
      case "error": return "❌";
      default: return "ℹ️";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    return "الآن";
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 relative z-50">
      <div className="flex items-center justify-between">
        {/* Right Side - Menu & User Info */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">مرحباً، {user.name}</h1>
            <p className="text-sm text-slate-500">{user.jobTitle}</p>
          </div>
        </div>

        {/* Left Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2.5 rounded-lg transition-all ${
                unreadCount > 0 
                  ? "bg-amber-50 hover:bg-amber-100 ring-2 ring-amber-300" 
                  : "hover:bg-slate-100"
              }`}
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-amber-600 animate-bounce" : "text-slate-600"}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-l from-blue-900 to-blue-800">
                  <div className="flex items-center gap-2 text-white">
                    <Bell className="w-5 h-5" />
                    <h3 className="font-bold">الإشعارات</h3>
                    {unreadCount > 0 && (
                      <span className="bg-white text-blue-900 text-xs px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} جديد
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-blue-200 hover:text-white transition-colors"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500">لا توجد إشعارات</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          !notification.isRead ? "bg-amber-50 border-r-4 border-r-amber-400" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm text-slate-800 ${!notification.isRead ? "font-medium" : ""}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                title="تعليم كمقروء"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                              title="حذف"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate?.("notifications");
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    عرض جميع الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => onNavigate?.("settings")}
            className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors group"
            title="الإعدادات"
          >
            <Settings className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "super_admin" ? "bg-purple-100 text-purple-700" :
                    user.role === "manager" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {user.role === "super_admin" ? "مدير عام" : 
                     user.role === "manager" ? "مدير" : 
                     user.role === "supervisor" ? "مشرف" : "عرض فقط"}
                  </span>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate?.("settings");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>الإعدادات</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}