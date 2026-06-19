import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-message-composer',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  templateUrl: './message-composer.component.html',
  styleUrl: './message-composer.component.css'
})
export class MessageComposerComponent {
  readonly disabled = input<boolean>(false);
  readonly send = output<string>();

  readonly draft = signal('');

  updateDraft(value: string): void {
    this.draft.set(value);
  }

  submit(): void {
    const text = this.draft().trim();
    if (!text || this.disabled()) {
      return;
    }

    this.send.emit(text);
    this.draft.set('');
  }
}
