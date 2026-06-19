import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../iam/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../iam/services/auth.service';
import { ClinicalSummaryComponent } from '../../components/clinical-summary/clinical-summary.component';
import { PatientListComponent } from '../../components/patient-list/patient-list.component';
import { PatientSummaryComponent } from '../../components/patient-summary/patient-summary.component';
import { ClinicalService } from '../../services/clinical.service';

@Component({
  selector: 'app-clinical-workspace',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    TranslatePipe,
    LanguageSwitcherComponent,
    ClinicalSummaryComponent,
    PatientListComponent,
    PatientSummaryComponent
  ],
  templateUrl: './clinical-workspace.page.html',
  styleUrl: './clinical-workspace.page.css'
})
export class ClinicalWorkspacePage {
  private readonly auth = inject(AuthService);
  readonly clinical = inject(ClinicalService);
  readonly user = this.auth.user;

  logout(): void {
    this.auth.logout();
  }
}
