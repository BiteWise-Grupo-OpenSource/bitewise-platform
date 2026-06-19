import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ConversationPreview } from '../../model/communication.models';

@Component({
  selector: 'app-conversation-list',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.css'
})
export class ConversationListComponent {
  readonly conversations = input.required<ConversationPreview[]>();
  readonly selectedId = input<string | null>(null);
  readonly select = output<string>();

  choose(conversationId: string): void {
    this.select.emit(conversationId);
  }
}
