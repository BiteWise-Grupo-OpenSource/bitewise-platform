import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { UserRole } from '../../model/auth.models';

@Component({
  selector: 'app-role-selector',
  imports: [MatButtonModule, TranslatePipe],
  templateUrl: './role-selector.component.html',
  styleUrl: './role-selector.component.css'
})
export class RoleSelectorComponent {
  @Input({ required: true }) value!: UserRole;
  @Input({ required: true }) labelKey!: string;
  @Output() valueChange = new EventEmitter<UserRole>();

  readonly roles: Array<{
    value: UserRole;
    titleKey: string;
    hintKey: string;
    className: string;
  }> = [
    {
      value: 'patient',
      titleKey: 'iam.roles.patient',
      hintKey: 'iam.roles.patientHint',
      className: 'patient'
    },
    {
      value: 'nutritionist',
      titleKey: 'iam.roles.nutritionist',
      hintKey: 'iam.roles.nutritionistHint',
      className: 'nutritionist'
    }
  ];

  selectRole(role: UserRole): void {
    this.valueChange.emit(role);
  }
}
