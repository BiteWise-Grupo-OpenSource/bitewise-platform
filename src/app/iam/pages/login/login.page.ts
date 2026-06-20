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
import { BackendAuthService } from '../../services/backend-auth.service';

@Component({
  selector: 'app-login-page',
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
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly backendAuth = inject(BackendAuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly role = signal<UserRole>('patient');
  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['ana@example.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]]
  });

  setRole(role: UserRole): void {
    this.role.set(role);
    this.form.controls.email.setValue(role === 'patient' ? 'ana@example.com' : 'dr.carlos@email.com');
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorKey.set(null);

    const formValue = this.form.getRawValue();

    if (this.role() === 'patient') {
      this.backendAuth
        .loginPatient(formValue.email, formValue.password)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (user) => {
            const session = this.auth['createAndStoreSession'](user);
            void this.router.navigateByUrl(this.auth.nextRouteFor(session));
          },
          error: () => this.errorKey.set('iam.login.invalidCredentials')
        });
    } else {
      this.backendAuth
        .loginNutritionist(formValue.email, formValue.password)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (user) => {
            const session = this.auth['createAndStoreSession'](user);
            void this.router.navigateByUrl(this.auth.nextRouteFor(session));
          },
          error: () => this.errorKey.set('iam.login.invalidCredentials')
        });
    }
  }
}
