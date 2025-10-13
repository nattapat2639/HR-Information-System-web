export interface EmployeeSummary {
  id: string;
  employeeNumber: string;
  fullName: string;
  department: string;
  position: string;
  status: string;
}

export interface EmployeeProfile {
  employeeNumber: string;
  fullName: string;
  personal: EmployeeProfileField[];
  job: EmployeeProfileField[];
  contact: EmployeeProfileField[];
  timeline: EmployeeTimelineEvent[];
  documents: EmployeeDocument[];
}

export interface EmployeeProfileField {
  label: string;
  value: string;
}

export interface EmployeeTimelineEvent {
  date: string;
  category: string;
  tone: string;
  title: string;
  description: string;
  icon: string;
}

export interface EmployeeDocument {
  name: string;
  updatedAt: string;
}

export interface EmployeeSearchInsights {
  status: DistributionItem[];
  topDepartments: DistributionItem[];
}

export interface DistributionItem {
  label: string;
  count: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
