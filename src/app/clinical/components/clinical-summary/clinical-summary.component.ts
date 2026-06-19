import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { ClinicalKpis, NutritionistProfile } from '../../model/clinical.models';

@Component({
  selector: 'app-clinical-summary',
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './clinical-summary.component.html',
  styleUrl: './clinical-summary.component.css'
})
export class ClinicalSummaryComponent {
  readonly profile = input.required<NutritionistProfile>();
  readonly kpis = input.required<ClinicalKpis>();
}
