import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../iam/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../iam/services/auth.service';

interface PatientNavItem {
  route: string;
  labelKey: string;
  iconLabel: string;
}

@Component({
  selector: 'app-patient-shell-page',
  imports: [
    LanguageSwitcherComponent,
    MatButtonModule,
    MatChipsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslatePipe
  ],
  templateUrl: './patient-shell.page.html',
  styleUrl: './patient-shell.page.css'
})
export class PatientShellPage {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;
  readonly initials = computed(() => {
    const name = this.user()?.displayName ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  });

  readonly navItems: PatientNavItem[] = [
    { route: '/patient', labelKey: 'patient.nav.dashboard', iconLabel: 'IN' },
    { route: '/patient/plan', labelKey: 'patient.nav.plan', iconLabel: 'PL' },
    { route: '/patient/log', labelKey: 'patient.nav.log', iconLabel: '+' },
    { route: '/patient/recipes', labelKey: 'patient.nav.recipes', iconLabel: 'RC' },
    { route: '/patient/progress', labelKey: 'patient.nav.progress', iconLabel: '%' },
    { route: '/patient/messages', labelKey: 'patient.nav.messages', iconLabel: 'CM' },
    { route: '/patient/settings', labelKey: 'patient.nav.settings', iconLabel: 'CF' }
  ];

  logout(): void {
    this.auth.logout();
  }
}
