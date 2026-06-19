import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-session-page',
  imports: [LanguageSwitcherComponent, MatButtonModule, MatCardModule, MatChipsModule, TranslatePipe],
  templateUrl: './session.page.html',
  styleUrl: './session.page.css'
})
export class SessionPage {
  private readonly auth = inject(AuthService);

  readonly session = this.auth.session;
  readonly initials = computed(() => {
    const user = this.session()?.user;
    if (!user) {
      return '';
    }

    return user.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  });

  readonly roleLabelKey = computed(() => {
    return this.session()?.user.role === 'nutritionist' ? 'iam.roles.nutritionist' : 'iam.roles.patient';
  });

  logout(): void {
    this.auth.logout();
  }
}
