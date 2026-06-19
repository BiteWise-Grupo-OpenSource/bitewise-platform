import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { MealKind } from '../../model/nutrition.models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-patient-log-page',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './patient-log.page.html',
  styleUrl: './patient-log.page.css'
})
export class PatientLogPage {
  readonly nutrition = inject(NutritionService);
  readonly selectedFoodId = signal('food-greek-yogurt');
  readonly selectedMeal = signal<MealKind>('snack');
  readonly mealKinds: MealKind[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  addEntry(): void {
    this.nutrition.addLogEntry(this.selectedFoodId(), this.selectedMeal());
  }
}
