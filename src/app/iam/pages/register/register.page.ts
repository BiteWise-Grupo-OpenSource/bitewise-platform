import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { RoleSelectorComponent } from '../../components/role-selector/role-selector.component';
import { UserRole } from '../../model/auth.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    AuthShellComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RoleSelectorComponent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css'
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly role = signal<UserRole>('patient');
  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorKey.set(null);

    this.auth
      .register({
        ...this.form.getRawValue(),
        role: this.role()
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (session) => void this.router.navigateByUrl(this.auth.nextRouteFor(session)),
        error: (error: Error) => {
          this.errorKey.set(error.message === 'emailExists' ? 'iam.register.emailExists' : 'iam.register.failed');
        }
      });
  }
}
