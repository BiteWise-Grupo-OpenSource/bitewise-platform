import { TestBed } from '@angular/core/testing';
import { ClinicalService } from './clinical.service';

describe('ClinicalService', () => {
  let service: ClinicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicalService);
  });

  it('exposes mock patients with a default selection', () => {
    expect(service.patients().length).toBeGreaterThan(0);
    expect(service.selectedPatient()).not.toBeNull();
    expect(service.selectedPatient()?.id).toBe(service.selectedPatientId());
  });

  it('derives KPIs from the underlying data', () => {
    const kpis = service.kpis();
    const activeCount = service.patients().filter((patient) => patient.status === 'active').length;
    const unreadCount = service.messages().filter((message) => message.unread).length;

    expect(kpis.activePatients).toBe(activeCount);
    expect(kpis.pendingReviews).toBe(service.pendingReviews().length);
    expect(kpis.unreadMessages).toBe(unreadCount);
    expect(kpis.averageAdherence).toBeGreaterThan(0);
    expect(kpis.averageAdherence).toBeLessThanOrEqual(100);
  });

  it('updates the selected patient', () => {
    const target = service.patients()[2];
    service.selectPatient(target.id);
    expect(service.selectedPatient()?.id).toBe(target.id);
  });
});
