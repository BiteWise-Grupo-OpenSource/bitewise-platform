import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { NutritionDayCardComponent } from '../../components/nutrition-day-card/nutrition-day-card.component';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-patient-plan-page',
  imports: [DatePipe, MatCardModule, MatChipsModule, MatProgressBarModule, NutritionDayCardComponent, TranslatePipe],
  templateUrl: './patient-plan.page.html',
  styleUrl: './patient-plan.page.css'
})
export class PatientPlanPage {
  readonly nutrition = inject(NutritionService);
  readonly plan = this.nutrition.patientPlan;
  readonly completedDays = computed(() => this.plan()?.days.filter((day) => day.completed).length ?? 0);
}
