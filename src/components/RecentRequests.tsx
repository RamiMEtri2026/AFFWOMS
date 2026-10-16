import { OvertimeRequest } from "../types";
import { factories } from "../data/mockData";
import { Clock, CheckCircle, XCircle, Play, Check } from "lucide-react";

interface RecentRequestsProps {
  requests: OvertimeRequest[];
}

const statusConfig = {
  pending: { label: "قيد الانتظار", icon: Clock, color: "bg-amber-100 text-amber-700" },
  approved: { label: "موافق عليه", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  rejected: { label: "مرفوض", icon: XCircle, color: "bg-red-100 text-red-700" },
  active: { label: "نشط", icon: Play, color: "bg-blue-100 text-blue-700" },
  completed: { label: "مكتمل", icon: Check, color: "bg-slate-100 text-slate-700" },
};

export default function RecentRequests({ requests }: RecentRequestsProps) {
  const getFactoryName = (factoryId: string) => {
    return factories.find((f) => f.id === factoryId)?.nameAr || factoryId;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">طلبات السهرات الأخيرة</h2>
      
      <div className="space-y-3">
        {requests.slice(0, 5).map((request) => {
          const status = statusConfig[request.status];
          const StatusIcon = status.icon;
          
          return (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{request.requestNumber}</p>
                  <p className="text-sm text-slate-500">{getFactoryName(request.factoryId)}</p>
                </div>
              </div>
              
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">{request.totalHours} ساعات</p>
                <p className="text-xs text-slate-500">
                  {new Date(request.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {requests.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          لا توجد طلبات حالياً
        </div>
      )}
    </div>
  );
}