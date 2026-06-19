import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { Recipe } from '../../model/nutrition.models';

@Component({
  selector: 'app-recipe-card',
  imports: [MatCardModule, MatChipsModule, TranslatePipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
}
