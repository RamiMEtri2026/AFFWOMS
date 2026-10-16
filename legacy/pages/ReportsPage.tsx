import { useState } from "react";
import { FileText, Download, Printer, Calendar, Users, Truck, MapPin, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { Button } from "../components/ui/button";
import { overtimeRequests, workers, drivers, zones, factories } from "../data/mockData";
import KPICard from "../components/KPICard";

type ReportType = "daily" | "monthly" | "yearly" | "market";
type ExportFormat = "pdf" | "csv" | "image" | "print";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("daily");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Calculate statistics
  const todayRequests = overtimeRequests.filter(r => r.shiftDate === selectedDate);
  const completedToday = todayRequests.filter(r => r.status === "completed" || r.status === "active");
  
  const totalWorkersToday = completedToday.reduce((sum, r) => sum + r.workers.length, 0);
  const totalTripsToday = completedToday.length;
  
  // Monthly stats
  const monthlyRequests = overtimeRequests.filter(r => r.shiftDate.startsWith(selectedMonth));
  const totalWorkersMonthly = monthlyRequests.reduce((sum, r) => sum + r.workers.length, 0);
  const totalTripsMonthly = monthlyRequests.length;

  // Yearly stats
  const yearlyRequests = overtimeRequests.filter(r => r.shiftDate.startsWith(selectedYear));
  const totalWorkersYearly = yearlyRequests.reduce((sum, r) => sum + r.workers.length, 0);
  const totalTripsYearly = yearlyRequests.length;

  // Zone statistics
  const zoneStats = zones.map(zone => {
    const zoneRequests = overtimeRequests.filter(r => 
      r.workers.some(w => w.zoneId === zone.id)
    );
    return {
      ...zone,
      trips: zoneRequests.length,
      workers: zoneRequests.reduce((sum, r) => sum + r.workers.filter(w => w.zoneId === zone.id).length, 0)
    };
  }).sort((a, b) => b.workers - a.workers);

  // Driver statistics
  const driverStats = drivers.map(driver => {
    const driverRequests = overtimeRequests.filter(r => 
      r.workers.some(w => w.driverId === driver.id)
    );
    return {
      ...driver,
      trips: driverRequests.length,
      workersTransported: driverRequests.reduce((sum, r) => sum + r.workers.filter(w => w.driverId === driver.id).length, 0)
    };
  }).sort((a, b) => b.trips - a.trips);

  // Vehicle occupancy
  const vehicleOccupancy = drivers.map(driver => ({
    ...driver,
    occupancyRate: Math.round((driver.trips / 30) * 100) // Simulated rate
  }));

  const handleExport = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        alert("جاري تصدير التقرير بصيغة PDF...");
        break;
      case "csv":
        exportToCSV();
        break;
      case "image":
        alert("جاري تصدير التقرير كصورة...");
        break;
      case "print":
        window.print();
        break;
    }
  };

  const exportToCSV = () => {
    let csvContent = "";
    
    if (activeReport === "daily") {
      csvContent = "رقم الطلب,التاريخ,المصنع,عدد العمال,السائق,المركبة,الجهة,الحالة\n";
      todayRequests.forEach(r => {
        const driver = r.workers[0]?.driverName || "-";
        const vehicle = r.workers[0]?.vehicleNumber || "-";
        const zone = r.workers[0]?.zoneName || "-";
        csvContent += `${r.requestNumber},${r.shiftDate},${factories.find(f => f.id === r.factoryId)?.nameAr},${r.workers.length},${driver},${vehicle},${zone},${r.status}\n`;
      });
    } else if (activeReport === "monthly") {
      csvContent = "رقم الطلب,التاريخ,المصنع,عدد العمال,السائق,المركبة,الحالة\n";
      monthlyRequests.forEach(r => {
        const driver = r.workers[0]?.driverName || "-";
        const vehicle = r.workers[0]?.vehicleNumber || "-";
        csvContent += `${r.requestNumber},${r.shiftDate},${factories.find(f => f.id === r.factoryId)?.nameAr},${r.workers.length},${driver},${vehicle},${r.status}\n`;
      });
    }

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `تقرير_${activeReport}_${selectedDate || selectedMonth || selectedYear}.csv`;
    link.click();
  };

  const reportTabs = [
    { id: "daily", label: "التقرير اليومي", icon: Calendar },
    { id: "monthly", label: "التقرير الشهري", icon: BarChart3 },
    { id: "yearly", label: "التقرير السنوي", icon: TrendingUp },
    { id: "market", label: "تقرير السوق اليومي", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة التقارير</h1>
          <p className="text-slate-500 mt-1">تقارير شاملة للورديات والرحلات والعمال</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport("pdf")} className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <FileText className="w-4 h-4" />
            PDF
          </Button>
          <Button onClick={() => handleExport("csv")} className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button onClick={() => handleExport("image")} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <PieChart className="w-4 h-4" />
            صورة
          </Button>
          <Button onClick={() => handleExport("print")} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            طباعة
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
        <div className="flex gap-2">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as ReportType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeReport === tab.id
                  ? "bg-blue-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          {activeReport === "daily" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">اختر التاريخ:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {activeReport === "monthly" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">اختر الشهر:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {activeReport === "yearly" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">اختر السنة:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          )}
          {activeReport === "market" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">تاريخ السوق:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Daily Report */}
      {activeReport === "daily" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="عدد الرحلات اليوم" value={totalTripsToday} icon={Truck} color="blue" />
            <KPICard title="عدد العمال المنقولين" value={totalWorkersToday} icon={Users} color="green" />
            <KPICard title="السائقين النشطين" value={driverStats.filter(d => d.status === "active").length} icon={Truck} color="amber" />
            <KPICard title="الجهات الم Covered" value={zoneStats.filter(z => z.trips > 0).length} icon={MapPin} color="purple" />
          </div>

          {/* Daily Trips Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">تفاصيل الرحلات اليومية</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">رقم الطلب</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المصنع</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">العمال</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">السائق</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المركبة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الجهة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todayRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        لا توجد رحلات في هذا التاريخ
                      </td>
                    </tr>
                  ) : (
                    todayRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{request.requestNumber}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {factories.find(f => f.id === request.factoryId)?.nameAr}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {request.workers.slice(0, 3).map((w, i) => (
                              <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">
                                {w.workerName}
                              </span>
                            ))}
                            {request.workers.length > 3 && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                +{request.workers.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {request.workers[0]?.driverName || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {request.workers[0]?.vehicleNumber || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {request.workers[0]?.zoneName || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === "completed" ? "bg-green-100 text-green-700" :
                            request.status === "active" ? "bg-blue-100 text-blue-700" :
                            request.status === "approved" ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {request.status === "completed" ? "مكتمل" :
                             request.status === "active" ? "نشط" :
                             request.status === "approved" ? "معتمد" :
                             request.status === "pending" ? "قيد الانتظار" : "مرفوض"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workers List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">قائمة العمال المنقولين</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {todayRequests.flatMap(r => r.workers).map((worker, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{worker.workerName}</p>
                      <p className="text-xs text-slate-500">{worker.departmentName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Report */}
      {activeReport === "monthly" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="إجمالي الرحلات الشهرية" value={totalTripsMonthly} icon={Truck} color="blue" />
            <KPICard title="إجمالي العمال المنقولين" value={totalWorkersMonthly} icon={Users} color="green" />
            <KPICard title="متوسط العمال يومياً" value={Math.round(totalWorkersMonthly / 30)} icon={Users} color="amber" />
            <KPICard title="السائقين النشطين" value={driverStats.filter(d => d.trips > 0).length} icon={Truck} color="purple" />
          </div>

          {/* Weekly Comparison Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">مقارنة الأداء الأسبوعي</h2>
            <div className="h-64 flex items-end justify-around gap-2">
              {["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"].map((week, i) => {
                const height = Math.random() * 60 + 40;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-600">{week}</span>
                    <span className="text-sm font-medium text-slate-800">{Math.round(height / 10)} رحلة</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Driver Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">إحصائيات السائقين والمركبات</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">السائق</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المركبة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">عدد الرحلات</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">العمال المنقولين</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">نسبة الإشغال</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {driverStats.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{driver.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{driver.vehicleNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{driver.trips}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{driver.workersTransported}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${Math.min(driver.trips * 5, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{Math.min(driver.trips * 5, 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workers List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">أسماء العمال المنقولين خلال الشهر</h2>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {monthlyRequests.flatMap(r => r.workers.map(w => w.workerName)).filter((v, i, a) => a.indexOf(v) === i).map((name, i) => (
                  <div key={i} className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yearly Report */}
      {activeReport === "yearly" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="إجمالي العمليات السنوية" value={totalTripsYearly} icon={Truck} color="blue" />
            <KPICard title="إجمالي العمال" value={totalWorkersYearly} icon={Users} color="green" />
            <KPICard title="نمو العمليات" value={15} icon={TrendingUp} color="amber" unit="%" />
            <KPICard title="الجهات المخدممة" value={zones.length} icon={MapPin} color="purple" />
          </div>

          {/* Yearly Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">إحصائيات النمو السنوية</h2>
            <div className="h-64 flex items-end justify-around gap-4">
              {["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"].map((month, i) => {
                const height = Math.random() * 70 + 30;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-600 rotate-45">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Zones */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">أكثر الجهات استخداماً للخدمة</h2>
            </div>
            <div className="p-4 space-y-4">
              {zoneStats.slice(0, 5).map((zone, i) => (
                <div key={zone.id} className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">{zone.name}</span>
                      <span className="text-sm text-slate-600">{zone.trips} رحلة</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(zone.trips / Math.max(...zoneStats.map(z => z.trips))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Drivers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">أكثر السائقين والمركبات نشاطاً</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {driverStats.filter(d => d.trips > 0).slice(0, 3).map((driver, i) => (
                <div key={driver.id} className={`p-4 rounded-xl ${i === 0 ? "bg-amber-50 border-2 border-amber-200" : i === 1 ? "bg-slate-100" : "bg-orange-50"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-amber-200 text-amber-700" : i === 1 ? "bg-slate-300 text-slate-700" : "bg-orange-200 text-orange-700"
                    }`}>
                      <span className="text-xl font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{driver.name}</p>
                      <p className="text-sm text-slate-500">{driver.vehicleNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-2xl font-bold text-blue-600">{driver.trips}</p>
                      <p className="text-xs text-slate-500">رحلة</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-2xl font-bold text-green-600">{driver.workersTransported}</p>
                      <p className="text-xs text-slate-500">عامل</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Daily Report */}
      {activeReport === "market" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="عدد الأسواق/الجهات" value={zoneStats.filter(z => z.trips > 0).length} icon={MapPin} color="blue" />
            <KPICard title="إجمالي العمال" value={totalWorkersToday} icon={Users} color="green" />
            <KPICard title="الرحلات المنفذة" value={totalTripsToday} icon={Truck} color="amber" />
            <KPICard title="نسبة الإشغال" value={75} icon={TrendingUp} color="purple" unit="%" />
          </div>

          {/* Market Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">تفاصيل السوق اليومي</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {zoneStats.filter(z => z.trips > 0).map((zone) => {
                const zoneRequests = todayRequests.filter(r => r.workers.some(w => w.zoneId === zone.id));
                const zoneWorkers = zoneRequests.flatMap(r => r.workers.filter(w => w.zoneId === zone.id));
                
                return (
                  <div key={zone.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{zone.name}</h3>
                          <p className="text-sm text-slate-500">{zone.trips} رحلة • {zone.workers} عامل</p>
                        </div>
                      </div>
                    </div>

                    {/* Workers in this zone */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-slate-700 mb-2">العمال المنقولين:</p>
                      <div className="flex flex-wrap gap-2">
                        {zoneWorkers.map((worker, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                            {worker.workerName} ({worker.departmentName})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Driver and Vehicle Info */}
                    {zoneWorkers[0]?.driverName && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-slate-500 mb-1">السائق</p>
                          <p className="font-medium text-slate-800">{zoneWorkers[0].driverName}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-slate-500 mb-1">المركبة</p>
                          <p className="font-medium text-slate-800">{zoneWorkers[0].vehicleNumber}</p>
                        </div>
                      </div>
                    )}

                    {/* Time Info */}
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">وقت الذهاب</p>
                        <p className="font-medium text-slate-800">
                          {zoneRequests[0]?.startTime || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">وقت العودة</p>
                        <p className="font-medium text-slate-800">
                          {zoneRequests[0]?.endTime || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {zoneStats.filter(z => z.trips > 0).length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  لا توجد رحلات في هذا التاريخ
                </div>
              )}
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">ملخص العمال لكل جهة</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">الجهة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">عدد العمال</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">السائق</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المركبة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">المشروع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {zoneStats.filter(z => z.trips > 0).map((zone) => {
                    const zoneRequests = todayRequests.filter(r => r.workers.some(w => w.zoneId === zone.id));
                    const zoneWorkers = zoneRequests.flatMap(r => r.workers.filter(w => w.zoneId === zone.id));
                    const factory = factories.find(f => f.id === zoneRequests[0]?.factoryId);
                    
                    return (
                      <tr key={zone.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{zone.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{zone.workers}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{zoneWorkers[0]?.driverName || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{zoneWorkers[0]?.vehicleNumber || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{factory?.nameAr || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Occupancy Dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">نسبة إشغال المركبات</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drivers.map((driver) => {
            const occupancy = Math.round(Math.random() * 50 + 50);
            return (
              <div key={driver.id} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-800">{driver.name}</p>
                    <p className="text-sm text-slate-500">{driver.vehicleNumber}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    occupancy >= 80 ? "bg-green-100 text-green-600" :
                    occupancy >= 50 ? "bg-amber-100 text-amber-600" :
                    "bg-red-100 text-red-600"
                  }`}>
                    <span className="font-bold">{occupancy}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancy >= 80 ? "bg-green-500" :
                      occupancy >= 50 ? "bg-amber-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  السعة: {driver.vehicleCapacity} عامل
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}