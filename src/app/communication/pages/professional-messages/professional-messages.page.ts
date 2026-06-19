import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { ConversationThreadComponent } from '../../components/conversation-thread/conversation-thread.component';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-professional-messages-page',
  imports: [
    ConversationThreadComponent,
    DatePipe,
    FormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './professional-messages.page.html',
  styleUrl: './professional-messages.page.css'
})
export class ProfessionalMessagesPage {
  readonly communication = inject(CommunicationService);
  readonly draft = signal('');

  send(conversationId: string): void {
    this.communication.sendMessage(conversationId, 'nutritionist', this.draft());
    this.draft.set('');
  }
}
