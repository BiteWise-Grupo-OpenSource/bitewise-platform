import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { NutritionDayCardComponent } from '../../components/nutrition-day-card/nutrition-day-card.component';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-professional-plans-page',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatProgressBarModule,
    NutritionDayCardComponent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './professional-plans.page.html',
  styleUrl: './professional-plans.page.css'
})
export class ProfessionalPlansPage {
  readonly nutrition = inject(NutritionService);
}
