import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { Conversation, MessageAuthorRole } from '../../model/communication.models';

@Component({
  selector: 'app-conversation-thread',
  imports: [DatePipe, MatChipsModule, TranslatePipe],
  templateUrl: './conversation-thread.component.html',
  styleUrl: './conversation-thread.component.css'
})
export class ConversationThreadComponent {
  readonly conversation = input.required<Conversation>();
  readonly viewerRole = input.required<MessageAuthorRole>();

  messageClass(authorRole: MessageAuthorRole): string {
    return authorRole === this.viewerRole() ? 'own' : 'other';
  }
}
