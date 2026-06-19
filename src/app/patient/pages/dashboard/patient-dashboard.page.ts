import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { PatientMetricGridComponent } from '../../components/patient-metric-grid/patient-metric-grid.component';
import { PatientQuickActionsComponent } from '../../components/patient-quick-actions/patient-quick-actions.component';
import { PatientDashboardService } from '../../services/patient-dashboard.service';

@Component({
  selector: 'app-patient-dashboard-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    PatientMetricGridComponent,
    PatientQuickActionsComponent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './patient-dashboard.page.html',
  styleUrl: './patient-dashboard.page.css'
})
export class PatientDashboardPage {
  private readonly dashboardService = inject(PatientDashboardService);

  readonly dashboard = this.dashboardService.dashboard;
  readonly firstName = this.dashboardService.firstName;
  readonly waterLabel = computed(() => {
    const dashboard = this.dashboard();
    return `${dashboard.waterCups} / ${dashboard.waterGoal}`;
  });
  readonly cupSlots = computed(() => Array.from({ length: this.dashboard().waterGoal }));

  barHeight(calories: number): number {
    if (calories <= 0) {
      return 10;
    }

    return Math.max(22, Math.round((calories / 2100) * 100));
  }
}
