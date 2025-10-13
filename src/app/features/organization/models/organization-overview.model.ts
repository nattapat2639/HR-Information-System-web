export interface OrganizationOverview {
  lastSyncedAtUtc: string | null;
  totalHeadcount: number;
  totalOpenRoles: number;
  departmentCount: number;
  totalApprovedHeadcount: number;
  attritionBreakdown: AttritionBreakdown[];
  departmentPlans: DepartmentPlanSummary[];
  focusAreas: FocusAreaSummary[];
}

export interface AttritionBreakdown {
  riskLevel: string;
  count: number;
}

export interface DepartmentPlanSummary {
  department: string;
  lead: string;
  focus: string;
  currentHeadcount: number;
  approvedHeadcount: number;
  openRoles: number;
  attritionRisk: string;
}

export interface FocusAreaSummary {
  focusArea: string;
  departmentCount: number;
}
