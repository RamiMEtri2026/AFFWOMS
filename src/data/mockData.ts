import { User, Factory, Department, Worker, Driver, ShiftTemplate, OvertimeRequest, Notification, AuditLog } from "../types";

export const defaultUsers: User[] = [
  { id: "1", name: "Peter Saidhom", email: "psaidhome@af-f.com", password: "AFF123456", role: "super_admin", jobTitle: "Administrator", status: "active" },
  { id: "2", name: "Maged Samir", email: "mhelmy@af-f.com", password: "AFF123456", role: "super_admin", jobTitle: "Factory General Manager", status: "active" },
  { id: "3", name: "شنودة عوض", email: "sfarag@af-f.com", password: "AFF12345678", role: "manager", jobTitle: "Warehouse Manager", factoryId: "F4", departmentId: "D1", status: "active" },
  { id: "4", name: "رأفت سعد", email: "rnashed@intlaromatics.com", password: "AFF12345678", role: "manager", jobTitle: "Spire Dryer Manager", factoryId: "F4", departmentId: "D2", status: "active" },
  { id: "5", name: "عماد لويس", email: "emikhail@intlaromatics.com", password: "AFF12345678", role: "manager", jobTitle: "Powder Manager", factoryId: "F4", departmentId: "D3", status: "active" },
  { id: "6", name: "احمد منتصر", email: "amontaser@af-f.com", password: "AFF12345678", role: "manager", jobTitle: "Quality Manager", factoryId: "F4", departmentId: "D4", status: "active" },
  { id: "7", name: "رفيق", email: "rfawzy@af-f.com", password: "AFF12345678", role: "manager", jobTitle: "Fragrance General Manager", factoryId: "F2", status: "active" },
  { id: "8", name: "فريد", email: "fabbs@intlaromatics.com", password: "AFF12345678", role: "manager", jobTitle: "Herb General Manager", factoryId: "F3", status: "active" },
];

export const defaultFactories: Factory[] = [
  { id: "F4", nameAr: "مصنع المنطقة الرابعة", nameEn: "Factory 4 - Spire Dryer, Liquid Flavor and Powder", location: "المنطقة الرابعة", createdAt: new Date() },
  { id: "F2", nameAr: "مصنع المنطقة الثانية", nameEn: "Factory 2 - Fragrance", location: "المنطقة الثانية", createdAt: new Date() },
  { id: "F3", nameAr: "مصنع المنطقة الثالثة", nameEn: "Factory 3 - Herbs", location: "المنطقة الثالثة", createdAt: new Date() },
];

export const defaultDepartments: Department[] = [
  { id: "D1", nameAr: "مراقبة الجودة", nameEn: "Quality Assurance & Control", factoryId: "F4", createdAt: new Date() },
  { id: "D2", nameAr: "الصيانة", nameEn: "Maintenance", factoryId: "F4", createdAt: new Date() },
  { id: "D3", nameAr: "المخازن", nameEn: "Warehouse & Stores", factoryId: "F4", createdAt: new Date() },
  { id: "D4", nameAr: "النظافة", nameEn: "Sanitation/Hygiene", factoryId: "F4", createdAt: new Date() },
  { id: "D5", nameAr: "تخطيط الإنتاج", nameEn: "Production Planning & Control", factoryId: "F4", createdAt: new Date() },
  { id: "D6", nameAr: "الصحة والسلامة", nameEn: "Environment, Health & Safety", factoryId: "F4", createdAt: new Date() },
  { id: "D7", nameAr: "الإدارة والدعم", nameEn: "Administration & Support", factoryId: "F4", createdAt: new Date() },
  { id: "D8", nameAr: "مراقبة الجودة", nameEn: "Quality Assurance & Control", factoryId: "F2", createdAt: new Date() },
  { id: "D9", nameAr: "الصيانة", nameEn: "Maintenance", factoryId: "F2", createdAt: new Date() },
  { id: "D10", nameAr: "مراقبة الجودة", nameEn: "Quality Assurance & Control", factoryId: "F3", createdAt: new Date() },
];

export const defaultWorkers: Worker[] = [
  { id: "W1", name: "أحمد محمد", employeeNumber: "EMP001", factoryId: "F4", departmentId: "D1", phone: "01234567890", jobTitle: "فني", status: "active", createdAt: new Date() },
  { id: "W2", name: "محمود علي", employeeNumber: "EMP002", factoryId: "F4", departmentId: "D1", phone: "01234567891", jobTitle: "فني", status: "active", createdAt: new Date() },
  { id: "W3", name: "سيد أحمد", employeeNumber: "EMP003", factoryId: "F4", departmentId: "D2", phone: "01234567892", jobTitle: "ميكانيكي", status: "active", createdAt: new Date() },
  { id: "W4", name: "كريم حسن", employeeNumber: "EMP004", factoryId: "F4", departmentId: "D3", phone: "01234567893", jobTitle: "مسؤول مخزن", status: "active", createdAt: new Date() },
  { id: "W5", name: "عبدالرحمن سعيد", employeeNumber: "EMP005", factoryId: "F2", departmentId: "D8", phone: "01234567894", jobTitle: "فني عطور", status: "active", createdAt: new Date() },
  { id: "W6", name: "يوسف إبراهيم", employeeNumber: "EMP006", factoryId: "F3", departmentId: "D10", phone: "01234567895", jobTitle: "فني أعشاب", status: "active", createdAt: new Date() },
];

export const defaultDrivers: Driver[] = [
  { id: "DR1", name: "محمد السائق", phone: "01012345678", vehicleNumber: "ABC-123", vehicleCapacity: "4 ركاب", status: "active", createdAt: new Date() },
  { id: "DR2", name: "أحمد السائق", phone: "01012345679", vehicleNumber: "DEF-456", vehicleCapacity: "6 ركاب", status: "active", createdAt: new Date() },
];

export const defaultShiftTemplates: ShiftTemplate[] = [
  { id: "ST1", name: "وردية مسائية قصيرة", startTime: "16:00", endTime: "19:30", totalHours: 3.5, createdBy: "1", createdAt: new Date() },
  { id: "ST2", name: "وردية مسائية متوسطة", startTime: "18:00", endTime: "00:00", totalHours: 6, createdBy: "1", createdAt: new Date() },
  { id: "ST3", name: "وردية مسائية طويلة", startTime: "20:00", endTime: "02:00", totalHours: 6, createdBy: "1", createdAt: new Date() },
];

export const defaultOvertimeRequests: OvertimeRequest[] = [
  {
    id: "OR1",
    requestNumber: "OT-2026-001",
    factoryId: "F4",
    createdBy: "3",
    createdAt: new Date(),
    status: "pending",
    shiftTemplateId: "ST1",
    shiftDate: new Date(),
    startDatetime: new Date(),
    endDatetime: new Date(),
    totalHours: 3.5,
    workers: [{ id: "OW1", overtimeRequestId: "OR1", workerId: "W1", assignedHours: 3.5 }],
  },
];

export const defaultNotifications: Notification[] = [
  { id: "N1", userId: "1", messageAr: "يوجد طلب سهرات جديد بانتظار الموافقة", isRead: false, createdAt: new Date(), type: "info", relatedEntityId: "OR1" },
];

export const defaultAuditLogs: AuditLog[] = [
  { id: "AL1", userId: "1", userName: "Peter Saidhom", action: "login", entity: "User", entityId: "1", details: "تسجيل دخول ناجح", createdAt: new Date() },
];