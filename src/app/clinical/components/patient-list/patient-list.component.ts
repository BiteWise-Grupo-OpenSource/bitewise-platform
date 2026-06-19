import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ClinicalPatient } from '../../model/clinical.models';

@Component({
  selector: 'app-patient-list',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent {
  readonly patients = input.required<ClinicalPatient[]>();
  readonly selectedId = input<string | null>(null);
  readonly select = output<string>();

  readonly query = signal('');
  readonly filtered = computed(() => {
    const term = this.query().trim().toLowerCase();
    const list = this.patients();
    return term ? list.filter((patient) => patient.fullName.toLowerCase().includes(term)) : list;
  });

  updateQuery(value: string): void {
    this.query.set(value);
  }

  choose(patientId: string): void {
    this.select.emit(patientId);
  }
}
