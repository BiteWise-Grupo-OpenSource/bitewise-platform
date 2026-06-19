import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../iam/services/auth.service';
import { ConversationThreadComponent } from '../../components/conversation-thread/conversation-thread.component';
import { MessageComposerComponent } from '../../components/message-composer/message-composer.component';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-patient-messages-page',
  imports: [MatCardModule, TranslatePipe, ConversationThreadComponent, MessageComposerComponent],
  templateUrl: './patient-messages.page.html',
  styleUrl: './patient-messages.page.css'
})
export class PatientMessagesPage {
  private readonly auth = inject(AuthService);
  private readonly communication = inject(CommunicationService);

  readonly conversation = computed(() => {
    const email = this.auth.user()?.email;
    return email ? this.communication.conversationForEmail(email) : null;
  });

  readonly messages = computed(() => this.conversation()?.messages ?? []);

  send(text: string): void {
    const conversation = this.conversation();
    if (conversation) {
      this.communication.sendMessage(conversation.id, 'patient', text);
    }
  }
}
