import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ConversationThreadComponent } from '../../components/conversation-thread/conversation-thread.component';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-patient-messages-page',
  imports: [
    ConversationThreadComponent,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './patient-messages.page.html',
  styleUrl: './patient-messages.page.css'
})
export class PatientMessagesPage {
  readonly communication = inject(CommunicationService);
  readonly draft = signal('');

  constructor() {
    const conversation = this.communication.patientConversation();
    if (conversation) {
      this.communication.selectConversation(conversation.id, 'patient');
    }
  }

  send(conversationId: string): void {
    this.communication.sendMessage(conversationId, 'patient', this.draft());
    this.draft.set('');
  }
}
