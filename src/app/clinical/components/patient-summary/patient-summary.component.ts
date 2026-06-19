import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { ClinicalPatient } from '../../model/clinical.models';

@Component({
  selector: 'app-patient-summary',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './patient-summary.component.html',
  styleUrl: './patient-summary.component.css'
})
export class PatientSummaryComponent {
  readonly patient = input<ClinicalPatient | null>(null);
}
