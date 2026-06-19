import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { MealPlanDay } from '../../model/nutrition.models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-nutrition-day-card',
  imports: [DatePipe, MatCardModule, MatChipsModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './nutrition-day-card.component.html',
  styleUrl: './nutrition-day-card.component.css'
})
export class NutritionDayCardComponent {
  private readonly nutrition = inject(NutritionService);

  readonly day = input.required<MealPlanDay>();
  readonly totals = computed(() => this.nutrition.dayTotals(this.day()));
  readonly calorieProgress = computed(() =>
    this.nutrition.targetProgress(this.totals().calories, this.day().target.calories)
  );
}
