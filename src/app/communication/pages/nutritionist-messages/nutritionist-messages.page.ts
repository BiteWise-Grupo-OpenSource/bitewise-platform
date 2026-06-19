import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../iam/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../iam/services/auth.service';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ConversationThreadComponent } from '../../components/conversation-thread/conversation-thread.component';
import { MessageComposerComponent } from '../../components/message-composer/message-composer.component';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-nutritionist-messages-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    TranslatePipe,
    LanguageSwitcherComponent,
    ConversationListComponent,
    ConversationThreadComponent,
    MessageComposerComponent
  ],
  templateUrl: './nutritionist-messages.page.html',
  styleUrl: './nutritionist-messages.page.css'
})
export class NutritionistMessagesPage {
  private readonly auth = inject(AuthService);
  readonly communication = inject(CommunicationService);

  readonly selected = this.communication.selectedConversation;
  readonly messages = computed(() => this.selected()?.messages ?? []);

  select(conversationId: string): void {
    this.communication.selectConversation(conversationId);
  }

  send(text: string): void {
    const conversation = this.selected();
    if (conversation) {
      this.communication.sendMessage(conversation.id, 'nutritionist', text);
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
