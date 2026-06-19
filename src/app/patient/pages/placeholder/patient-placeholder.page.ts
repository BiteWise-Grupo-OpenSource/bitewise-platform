import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

interface PatientPlaceholderData {
  eyebrowKey: string;
  titleKey: string;
  subtitleKey: string;
  primaryKey: string;
}

const FALLBACK_DATA: PatientPlaceholderData = {
  eyebrowKey: 'patient.placeholder.eyebrow',
  titleKey: 'patient.placeholder.title',
  subtitleKey: 'patient.placeholder.subtitle',
  primaryKey: 'patient.placeholder.primary'
};

@Component({
  selector: 'app-patient-placeholder-page',
  imports: [MatButtonModule, MatCardModule, RouterLink, TranslatePipe],
  templateUrl: './patient-placeholder.page.html',
  styleUrl: './patient-placeholder.page.css'
})
export class PatientPlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(map((data) => (data['patientPage'] ?? FALLBACK_DATA) as PatientPlaceholderData)),
    { initialValue: FALLBACK_DATA }
  );

  readonly page = computed(() => this.routeData());
}
