import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ConversationMessage, MessageAuthor } from '../../model/communication.models';

@Component({
  selector: 'app-conversation-thread',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './conversation-thread.component.html',
  styleUrl: './conversation-thread.component.css'
})
export class ConversationThreadComponent {
  readonly messages = input.required<ConversationMessage[]>();
  /** Role looking at the thread; its own messages render as "mine". */
  readonly viewer = input.required<MessageAuthor>();
  readonly emptyKey = input<string>('communication.thread.empty');
}
