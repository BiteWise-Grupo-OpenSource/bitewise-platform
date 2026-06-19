export type PatientTone = 'patient' | 'protein' | 'carbs' | 'fat' | 'success' | 'info' | 'warning' | 'muted';

export interface PatientMetric {
  labelKey: string;
  value: string;
  helperKey: string;
  progress?: number;
  tone: PatientTone;
}

export interface PatientMacro {
  labelKey: string;
  value: string;
  progress: number;
  tone: PatientTone;
}

export interface PatientMeal {
  iconLabel: string;
  nameKey: string;
  detailKey: string;
  statusKey: string;
  tone: PatientTone;
}

export interface PatientQuickAction {
  route: string;
  iconLabel: string;
  labelKey: string;
  descriptionKey: string;
}

export interface PatientWeekPoint {
  dayKey: string;
  calories: number;
}

export interface PatientDashboard {
  metrics: PatientMetric[];
  macros: PatientMacro[];
  meals: PatientMeal[];
  quickActions: PatientQuickAction[];
  week: PatientWeekPoint[];
  waterCups: number;
  waterGoal: number;
}
