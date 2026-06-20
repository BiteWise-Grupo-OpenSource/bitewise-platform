import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import {
  ClinicalKpis,
  ClinicalMessage,
  ClinicalPatient,
  NutritionistProfile,
  PendingReview
} from '../model/clinical.models';

interface BackendPatient {
  id: number;
  name: string;
  email: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  goal?: string;
}

interface BackendMessage {
  id: number;
  patient: BackendPatient;
  sender?: string;
  content: string;
  sentAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ClinicalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  private readonly profileData = signal<NutritionistProfile>({
    id: 'nutritionist-demo',
    displayName: 'Dr. Carlos Medina',
    titleKey: 'clinical.profile.titleClinical',
    license: 'CNP-20458',
    specialtyKeys: [
      'clinical.profile.specialties.metabolic',
      'clinical.profile.specialties.sports',
      'clinical.profile.specialties.clinical'
    ]
  });

  private readonly patientsData = signal<ClinicalPatient[]>([
    {
      id: 'p-001',
      fullName: 'Andrea Flores',
      age: 32,
      status: 'active',
      goal: 'weightLoss',
      planKey: 'mediterranean1800',
      adherence: 86,
      lastVisit: '2026-06-05',
      nextVisit: '2026-06-26',
      heightCm: 165,
      weightKg: 68,
      bmi: 25.0,
      conditions: ['highCholesterol'],
      noteKey: 'adjustCarbs'
    },
    {
      id: 'p-002',
      fullName: 'Marco Rios',
      age: 45,
      status: 'review',
      goal: 'clinicalNutrition',
      planKey: 'lowCarb1600',
      adherence: 64,
      lastVisit: '2026-05-28',
      nextVisit: '2026-06-20',
      heightCm: 178,
      weightKg: 92,
      bmi: 29.0,
      conditions: ['hypertension', 'type2Diabetes'],
      noteKey: 'reviewLabs'
    },
    {
      id: 'p-003',
      fullName: 'Lucia Mendez',
      age: 27,
      status: 'active',
      goal: 'muscleGain',
      planKey: 'highProtein2100',
      adherence: 91,
      lastVisit: '2026-06-10',
      nextVisit: '2026-07-01',
      heightCm: 170,
      weightKg: 63,
      bmi: 21.8,
      conditions: ['none'],
      noteKey: 'increaseProtein'
    },
    {
      id: 'p-004',
      fullName: 'Diego Salas',
      age: 38,
      status: 'review',
      goal: 'sportsNutrition',
      planKey: 'balanced2000',
      adherence: 73,
      lastVisit: '2026-06-02',
      nextVisit: '2026-06-19',
      heightCm: 182,
      weightKg: 80,
      bmi: 24.2,
      conditions: ['none'],
      noteKey: 'hydration'
    },
    {
      id: 'p-005',
      fullName: 'Sofia Paredes',
      age: 52,
      status: 'inactive',
      goal: 'clinicalNutrition',
      planKey: 'mediterranean1800',
      adherence: 48,
      lastVisit: '2026-04-30',
      nextVisit: '2026-06-30',
      heightCm: 160,
      weightKg: 74,
      bmi: 28.9,
      conditions: ['hypothyroidism', 'hypertension'],
      noteKey: 'maintainPlan'
    },
    {
      id: 'p-006',
      fullName: 'Tomas Vega',
      age: 19,
      status: 'active',
      goal: 'weightLoss',
      planKey: 'lowCarb1600',
      adherence: 80,
      lastVisit: '2026-06-12',
      nextVisit: '2026-07-03',
      heightCm: 175,
      weightKg: 88,
      bmi: 28.7,
      conditions: ['celiac'],
      noteKey: 'adjustCarbs'
    }
  ]);

  private readonly reviewsData = signal<PendingReview[]>([
    { id: 'r-01', patientId: 'p-002', patientName: 'Marco Rios', type: 'lab', priority: 'high', dueDate: '2026-06-20' },
    { id: 'r-02', patientId: 'p-004', patientName: 'Diego Salas', type: 'progress', priority: 'medium', dueDate: '2026-06-19' },
    { id: 'r-03', patientId: 'p-001', patientName: 'Andrea Flores', type: 'mealPlan', priority: 'low', dueDate: '2026-06-26' },
    { id: 'r-04', patientId: 'p-005', patientName: 'Sofia Paredes', type: 'progress', priority: 'high', dueDate: '2026-06-22' }
  ]);

  private readonly messagesData = signal<ClinicalMessage[]>([
    { id: 'm-01', patientId: 'p-002', patientName: 'Marco Rios', previewKey: 'reschedule', sentAt: '2026-06-18T09:15:00', unread: true },
    { id: 'm-02', patientId: 'p-003', patientName: 'Lucia Mendez', previewKey: 'question1', sentAt: '2026-06-18T08:02:00', unread: true },
    { id: 'm-03', patientId: 'p-001', patientName: 'Andrea Flores', previewKey: 'thanks', sentAt: '2026-06-17T17:40:00', unread: false },
    { id: 'm-04', patientId: 'p-006', patientName: 'Tomas Vega', previewKey: 'question2', sentAt: '2026-06-17T12:20:00', unread: true },
    { id: 'm-05', patientId: 'p-004', patientName: 'Diego Salas', previewKey: 'update', sentAt: '2026-06-16T10:05:00', unread: false }
  ]);

  private readonly selectedId = signal<string | null>('p-001');

  readonly profile = this.profileData.asReadonly();
  readonly patients = this.patientsData.asReadonly();
  readonly pendingReviews = this.reviewsData.asReadonly();
  readonly messages = this.messagesData.asReadonly();

  readonly unreadMessages = computed(() => this.messagesData().filter((message) => message.unread));
  readonly selectedPatientId = this.selectedId.asReadonly();
  readonly selectedPatient = computed<ClinicalPatient | null>(() => {
    const id = this.selectedId();
    return this.patientsData().find((patient) => patient.id === id) ?? null;
  });

  readonly kpis = computed<ClinicalKpis>(() => {
    const patients = this.patientsData();
    const adherence = patients.map((patient) => patient.adherence);
    const averageAdherence = adherence.length
      ? Math.round(adherence.reduce((total, value) => total + value, 0) / adherence.length)
      : 0;

    return {
      activePatients: patients.filter((patient) => patient.status === 'active').length,
      pendingReviews: this.reviewsData().length,
      unreadMessages: this.unreadMessages().length,
      averageAdherence
    };
  });

  constructor() {
    this.loadBackendData();
  }

  selectPatient(patientId: string): void {
    this.selectedId.set(patientId);
  }

  private loadBackendData(): void {
    this.http
      .get<BackendPatient[]>(this.apiUrl.endpoint('patients'))
      .pipe(catchError(() => of<BackendPatient[]>([])))
      .subscribe((patients) => {
        if (!patients.length) {
          return;
        }

        const mapped = patients.map((patient) => this.mapPatient(patient));
        this.patientsData.set(mapped);
        this.selectedId.set(mapped[0]?.id ?? null);
        this.reviewsData.set([]);
      });

    this.http
      .get<BackendMessage[]>(this.apiUrl.endpoint('messages'))
      .pipe(catchError(() => of<BackendMessage[]>([])))
      .subscribe((messages) => {
        if (!messages.length) {
          return;
        }

        this.messagesData.set(messages.map((message) => this.mapMessage(message)));
      });
  }

  private mapPatient(patient: BackendPatient): ClinicalPatient {
    const heightM = patient.heightCm ? Number(patient.heightCm) / 100 : 0;
    const bmi = heightM > 0 && patient.weightKg ? Number(patient.weightKg) / (heightM * heightM) : 0;

    return {
      id: String(patient.id),
      fullName: patient.name,
      age: patient.age ?? 0,
      status: 'active',
      goal: this.toPatientGoal(patient.goal),
      planKey: 'balanced2000',
      adherence: 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      nextVisit: new Date().toISOString().slice(0, 10),
      heightCm: Number(patient.heightCm ?? 0),
      weightKg: Number(patient.weightKg ?? 0),
      bmi: Number(bmi.toFixed(1)),
      conditions: ['none'],
      noteKey: 'maintainPlan'
    };
  }

  private mapMessage(message: BackendMessage): ClinicalMessage {
    return {
      id: String(message.id),
      patientId: String(message.patient.id),
      patientName: message.patient.name,
      previewKey: 'update',
      sentAt: message.sentAt ?? new Date().toISOString(),
      unread: message.sender === 'patient'
    };
  }

  private toPatientGoal(value: string | undefined): ClinicalPatient['goal'] {
    const normalized = value?.trim().toLowerCase() ?? '';

    if (normalized.includes('muscle')) {
      return 'muscleGain';
    }

    if (normalized.includes('sport')) {
      return 'sportsNutrition';
    }

    if (normalized.includes('clinical') || normalized.includes('diabetes') || normalized.includes('hypertension')) {
      return 'clinicalNutrition';
    }

    if (normalized.includes('weight') || normalized.includes('loss')) {
      return 'weightLoss';
    }

    return 'energy';
  }
}
