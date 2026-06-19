import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { NutritionGoal } from '../../model/nutrition.models';
import { NutritionService } from '../../services/nutrition.service';

type RecipeFilter = NutritionGoal | 'all';

@Component({
  selector: 'app-patient-recipes-page',
  imports: [MatButtonToggleModule, RecipeCardComponent, TranslatePipe],
  templateUrl: './patient-recipes.page.html',
  styleUrl: './patient-recipes.page.css'
})
export class PatientRecipesPage {
  readonly nutrition = inject(NutritionService);
  readonly filters: RecipeFilter[] = ['all', 'weightLoss', 'muscleGain', 'clinicalNutrition', 'energy'];

  applyFilter(filter: RecipeFilter): void {
    this.nutrition.filterRecipes(filter);
  }
}
