export type EmployeeFieldDataType = 'text' | 'number' | 'date' | 'email' | 'select' | 'multi_select';

export interface EmployeeFieldOption {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface EmployeeFieldDefinition {
  id: string;
  fieldKey: string;
  displayName: string;
  dataType: EmployeeFieldDataType | string;
  isRequired: boolean;
  category: string;
  sortOrder: number;
  isActive: boolean;
  description?: string | null;
  options: EmployeeFieldOption[];
}

export interface EmployeeFieldDefinitionRequest {
  fieldKey: string;
  displayName: string;
  dataType: EmployeeFieldDataType | string;
  isRequired: boolean;
  category: string;
  sortOrder: number;
  isActive: boolean;
  description?: string | null;
  options: Array<{
    label: string;
    value?: string | null;
    sortOrder: number;
  }>;
}

export interface EmployeeFieldWithValue extends EmployeeFieldDefinition {
  value?: string | null;
  updatedAtUtc?: string | null;
  updatedBy?: string | null;
}

export interface EmployeeFieldValueSet {
  employeeId: string;
  employeeNumber: string;
  fields: EmployeeFieldWithValue[];
}

export interface EmployeeFieldValueUpdateItem {
  fieldKey: string;
  value?: string | null;
  values?: string[] | null;
}

export interface EmployeeFieldValueUpdateCommand {
  updatedBy: string;
  fields: EmployeeFieldValueUpdateItem[];
}
