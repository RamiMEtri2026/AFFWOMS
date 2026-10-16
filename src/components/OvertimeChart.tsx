import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const dailyData = [
  { day: "السبت", hours: 12 },
  { day: "الأحد", hours: 18 },
  { day: "الاثنين", hours: 15 },
  { day: "الثلاثاء", hours: 22 },
  { day: "الأربعاء", hours: 19 },
  { day: "الخميس", hours: 25 },
  { day: "الجمعة", hours: 8 },
];

const monthlyData = [
  { month: "يناير", requests: 45 },
  { month: "فبراير", requests: 52 },
  { month: "مارس", requests: 48 },
  { month: "أبريل", requests: 61 },
  { month: "مايو", requests: 55 },
  { month: "يونيو", requests: 67 },
];

export default function OvertimeChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">الساعات اليومية</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            <Line type="monotone" dataKey="hours" stroke="#1e3a5f" strokeWidth={2} dot={{ fill: "#1e3a5f", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-4 mt-8">الطلبات الشهرية</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            <Bar dataKey="requests" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}