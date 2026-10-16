import { useState } from "react";
import { User } from "../types";
import { Eye, EyeOff } from "lucide-react";
import Button from "./ui/button";

interface LoginProps {
  onLogin: (user: User) => void;
}

const defaultUsers: User[] = [
  { id: "1", name: "Peter Saidhom", email: "psaidhome@af-f.com", password: "AFF123456", role: "super_admin", jobTitle: "Administrator", status: "active" },
  { id: "2", name: "Maged Samir", email: "mhelmy@af-f.com", password: "AFF123456", role: "super_admin", jobTitle: "Factory General Manager", status: "active" },
  { id: "3", name: "شنودة عوض", email: "sfarag@af-f.com", password: "AFF12345678", role: "manager", jobTitle: "Warehouse Manager", factoryId: "F4", status: "active" },
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = defaultUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="https://af-f.com/aff-logo-colored.png" alt="AFF Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">نظام إدارة سهرات العمال</h1>
          <p className="text-slate-500 mt-2">AFF Workers Overtime Management System 2026</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="example@af-f.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-600">تذكرني</span>
            </label>
            <button type="button" className="text-sm text-blue-600 hover:underline">
              نسيت كلمة المرور؟
            </button>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-2">بيانات تجريبية:</p>
          <p className="text-xs text-slate-600">المدير العام: psaidhome@af-f.com / AFF123456</p>
          <p className="text-xs text-slate-600">مدير مصنع: sfarag@af-f.com / AFF12345678</p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          © 2026 Aromatic Flavours & Fragrances. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}