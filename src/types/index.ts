export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "manager" | "supervisor" | "viewer";
  jobTitle?: string;
  factoryId?: string;
  departmentId?: string;
  status: "active" | "inactive";
  createdAt?: Date;
}

export interface Factory {
  id: string;
  nameAr: string;
  nameEn: string;
  location: string;
  createdAt: Date;
}

export interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  factoryId: string;
  createdAt: Date;
}

export interface Worker {
  id: string;
  name: string;
  employeeNumber: string;
  factoryId: string;
  departmentId: string;
  phone?: string;
  jobTitle?: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleCapacity: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  createdBy: string;
  createdAt: Date;
}

export interface OvertimeRequest {
  id: string;
  requestNumber: string;
  factoryId: string;
  createdBy: string;
  createdAt: Date;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  approvedBy?: string;
  approvedAt?: Date;
  driverId?: string;
  vehicleNumber?: string;
  notes?: string;
  shiftTemplateId: string;
  shiftDate: Date;
  startDatetime: Date;
  endDatetime: Date;
  totalHours: number;
  workers: OvertimeRequestWorker[];
}

export interface OvertimeRequestWorker {
  id: string;
  overtimeRequestId: string;
  workerId: string;
  assignedHours: number;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  messageAr: string;
  isRead: boolean;
  createdAt: Date;
  type: "info" | "warning" | "success" | "error";
  relatedEntityId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  createdAt: Date;
}