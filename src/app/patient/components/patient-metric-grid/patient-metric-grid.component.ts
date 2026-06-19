import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { PatientMetric } from '../../model/patient-dashboard.models';

@Component({
  selector: 'app-patient-metric-grid',
  imports: [MatCardModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './patient-metric-grid.component.html',
  styleUrl: './patient-metric-grid.component.css'
})
export class PatientMetricGridComponent {
  @Input({ required: true }) metrics: PatientMetric[] = [];
}
