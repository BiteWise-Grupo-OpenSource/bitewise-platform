import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-onboarding-page',
  imports: [
    LanguageSwitcherComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.css'
})
export class OnboardingPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    goal: ['', [Validators.required]],
    activityLevel: ['', [Validators.required]],
    notes: ['']
  });

  ngOnInit(): void {
    const user = this.auth.user();
    if (!user || user.role !== 'patient' || user.onboardingCompleted) {
      void this.router.navigateByUrl(this.auth.nextRouteFor());
    }
  }

  complete(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorKey.set(null);

    this.auth
      .completeOnboarding()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/session'),
        error: () => this.errorKey.set('iam.onboarding.failed')
      });
  }
}
