import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { PatientQuickAction } from '../../model/patient-dashboard.models';

@Component({
  selector: 'app-patient-quick-actions',
  imports: [MatButtonModule, RouterLink, TranslatePipe],
  templateUrl: './patient-quick-actions.component.html',
  styleUrl: './patient-quick-actions.component.css'
})
export class PatientQuickActionsComponent {
  @Input({ required: true }) actions: PatientQuickAction[] = [];
}
