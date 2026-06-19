export type PatientStatus = 'active' | 'review' | 'inactive';
export type ReviewPriority = 'high' | 'medium' | 'low';
export type ReviewType = 'mealPlan' | 'progress' | 'lab';
export type PatientGoal = 'weightLoss' | 'muscleGain' | 'clinicalNutrition' | 'sportsNutrition' | 'energy';
export type PatientCondition =
  | 'none'
  | 'hypertension'
  | 'type2Diabetes'
  | 'hypothyroidism'
  | 'celiac'
  | 'highCholesterol';
export type PlanKey = 'mediterranean1800' | 'lowCarb1600' | 'highProtein2100' | 'balanced2000';
export type NoteKey = 'adjustCarbs' | 'increaseProtein' | 'reviewLabs' | 'maintainPlan' | 'hydration';
export type MessageSampleKey = 'question1' | 'question2' | 'thanks' | 'reschedule' | 'update';

/** Professional profile shown in the clinical workspace header. */
export interface NutritionistProfile {
  id: string;
  displayName: string;
  /** i18n key for the professional title, e.g. `clinical.profile.titleClinical`. */
  titleKey: string;
  /** Mock license/registration code (replaceable demo data). */
  license: string;
  /** Full i18n keys for each specialty chip. */
  specialtyKeys: string[];
}

/** Aggregated indicators derived from the workspace data. */
export interface ClinicalKpis {
  activePatients: number;
  pendingReviews: number;
  unreadMessages: number;
  /** Average plan adherence across the patient list (0-100). */
  averageAdherence: number;
}

/** A clinical task awaiting the professional's review. */
export interface PendingReview {
  id: string;
  patientId: string;
  patientName: string;
  type: ReviewType;
  priority: ReviewPriority;
  /** ISO date string. */
  dueDate: string;
}

/** An inbound message from a patient. */
export interface ClinicalMessage {
  id: string;
  patientId: string;
  patientName: string;
  /** i18n sample key under `clinical.messages.samples.*`. */
  previewKey: MessageSampleKey;
  /** ISO date-time string. */
  sentAt: string;
  unread: boolean;
}

/** Summarised patient record powering the master/detail experience. */
export interface ClinicalPatient {
  id: string;
  fullName: string;
  age: number;
  status: PatientStatus;
  goal: PatientGoal;
  planKey: PlanKey;
  /** Plan adherence percentage (0-100). */
  adherence: number;
  /** ISO date string. */
  lastVisit: string;
  /** ISO date string. */
  nextVisit: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  conditions: PatientCondition[];
  noteKey: NoteKey;
}
