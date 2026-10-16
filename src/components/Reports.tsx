import { useState } from "react";
import { FileText, Download, Calendar, Factory, Users } from "lucide-react";
import Button from "./ui/button";

interface ReportsProps {
  userRole: string;
}

export default function Reports({ userRole }: ReportsProps) {
  const [reportType, setReportType] = useState("daily");
  const [selectedFactory, setSelectedFactory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleExport = (format: string) => {
    alert(`جاري تصدير التقرير بصيغة ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">التقارير</h1>
        <p className="text-slate-500">تصدير تقارير السهرات</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">معايير التقرير</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">نوع التقرير</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
            >
              <option value="daily">يومي</option>
              <option value="monthly">شهري</option>
              <option value="annual">سنوي</option>
              <option value="custom">مخصص</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">المصنع</label>
            <select
              value={selectedFactory}
              onChange={(e) => setSelectedFactory(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
            >
              <option value="">كل المصانع</option>
              <option value="F4">مصنع المنطقة الرابعة</option>
              <option value="F2">مصنع المنطقة الثانية</option>
              <option value="F3">مصنع المنطقة الثالثة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">تقرير يومي</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4">تقرير بطلبات السهرات لليوم الواحد</p>
          <div className="flex gap-2">
            <Button onClick={() => handleExport("pdf")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> PDF
            </Button>
            <Button onClick={() => handleExport("csv")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> CSV
            </Button>
            <Button onClick={() => handleExport("excel")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> Excel
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Factory className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">تقرير المصانع</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4">تقرير أداء المصانع وطلبات السهرات</p>
          <div className="flex gap-2">
            <Button onClick={() => handleExport("pdf")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> PDF
            </Button>
            <Button onClick={() => handleExport("csv")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> CSV
            </Button>
            <Button onClick={() => handleExport("excel")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> Excel
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">تقرير العمال</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4">تقرير ساعات العمل لكل عامل</p>
          <div className="flex gap-2">
            <Button onClick={() => handleExport("pdf")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> PDF
            </Button>
            <Button onClick={() => handleExport("csv")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> CSV
            </Button>
            <Button onClick={() => handleExport("excel")} variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 ml-1" /> Excel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}