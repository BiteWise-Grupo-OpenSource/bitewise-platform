import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import {
  Conversation,
  ConversationMessage,
  ConversationPreview,
  MessageAuthor
} from '../model/communication.models';

interface BackendPatient {
  id: number;
  name: string;
  email: string;
}

interface BackendMessage {
  id: number;
  patient: BackendPatient;
  sender?: string;
  content: string;
  sentAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private static readonly NUTRITIONIST = 'Dr. Carlos Medina';
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);
  private sequence = 0;

  private readonly conversationsData = signal<Conversation[]>([
    {
      id: 'c-001',
      patientId: 'p-001',
      patientName: 'Andrea Flores',
      patientEmail: 'andrea@email.com',
      nutritionistName: CommunicationService.NUTRITIONIST,
      messages: [
        { id: 'c001-m1', author: 'nutritionist', sentAt: '2026-06-15T09:00:00', bodyKey: 'communication.samples.welcome' },
        { id: 'c001-m2', author: 'patient', sentAt: '2026-06-17T10:15:00', bodyKey: 'communication.samples.planQuestion' },
        { id: 'c001-m3', author: 'nutritionist', sentAt: '2026-06-17T10:20:00', bodyKey: 'communication.samples.planAnswer' },
        { id: 'c001-m4', author: 'patient', sentAt: '2026-06-18T08:30:00', bodyKey: 'communication.samples.snackSwap' }
      ]
    },
    {
      id: 'c-002',
      patientId: 'p-002',
      patientName: 'Marco Rios',
      patientEmail: 'marco@email.com',
      nutritionistName: CommunicationService.NUTRITIONIST,
      messages: [
        { id: 'c002-m1', author: 'nutritionist', sentAt: '2026-06-16T11:00:00', bodyKey: 'communication.samples.checkIn' },
        { id: 'c002-m2', author: 'patient', sentAt: '2026-06-16T18:45:00', bodyKey: 'communication.samples.progressUpdate' },
        { id: 'c002-m3', author: 'nutritionist', sentAt: '2026-06-17T09:10:00', bodyKey: 'communication.samples.labReminder' }
      ]
    },
    {
      id: 'c-003',
      patientId: 'p-003',
      patientName: 'Lucia Mendez',
      patientEmail: 'lucia@email.com',
      nutritionistName: CommunicationService.NUTRITIONIST,
      messages: [
        { id: 'c003-m1', author: 'patient', sentAt: '2026-06-18T07:50:00', bodyKey: 'communication.samples.scheduleAsk' }
      ]
    },
    {
      id: 'c-004',
      patientId: 'p-004',
      patientName: 'Diego Salas',
      patientEmail: 'diego@email.com',
      nutritionistName: CommunicationService.NUTRITIONIST,
      messages: [
        { id: 'c004-m1', author: 'nutritionist', sentAt: '2026-06-10T09:00:00', bodyKey: 'communication.samples.welcome' },
        { id: 'c004-m2', author: 'patient', sentAt: '2026-06-12T12:00:00', bodyKey: 'communication.samples.thanks' },
        { id: 'c004-m3', author: 'nutritionist', sentAt: '2026-06-17T15:00:00', bodyKey: 'communication.samples.checkIn' }
      ]
    }
  ]);

  private readonly selectedId = signal<string | null>('c-001');

  readonly conversations = this.conversationsData.asReadonly();
  readonly selectedConversationId = this.selectedId.asReadonly();

  readonly selectedConversation = computed<Conversation | null>(() => {
    const id = this.selectedId();
    return this.conversationsData().find((conversation) => conversation.id === id) ?? null;
  });

  readonly previews = computed<ConversationPreview[]>(() =>
    this.conversationsData().map((conversation) => {
      const lastMessage = conversation.messages.at(-1) ?? null;
      return {
        id: conversation.id,
        patientName: conversation.patientName,
        lastMessage,
        awaitingReply: lastMessage?.author === 'patient'
      };
    })
  );

  readonly awaitingCount = computed(() => this.previews().filter((preview) => preview.awaitingReply).length);

  constructor() {
    this.loadBackendMessages();
  }

  selectConversation(conversationId: string): void {
    this.selectedId.set(conversationId);
  }

  /** Resolves the conversation that belongs to a given patient email (patient view). */
  conversationForEmail(email: string): Conversation | null {
    const normalized = email.trim().toLowerCase();
    return this.conversationsData().find((conversation) => conversation.patientEmail.toLowerCase() === normalized) ?? null;
  }

  /** Appends a locally typed (mock) message to a conversation. */
  sendMessage(conversationId: string, author: MessageAuthor, body: string): void {
    const text = body.trim();
    if (!text) {
      return;
    }

    const message: ConversationMessage = {
      id: `local-${++this.sequence}`,
      author,
      sentAt: new Date().toISOString(),
      body: text
    };

    this.conversationsData.update((conversations) =>
      conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: [...conversation.messages, message] }
          : conversation
      )
    );
  }

  private loadBackendMessages(): void {
    this.http
      .get<BackendMessage[]>(this.apiUrl.endpoint('messages'))
      .pipe(catchError(() => of<BackendMessage[]>([])))
      .subscribe((messages) => {
        if (!messages.length) {
          return;
        }

        const conversations = new Map<string, Conversation>();

        for (const message of messages) {
          const patientId = String(message.patient.id);
          const conversation = conversations.get(patientId) ?? {
            id: `patient-${patientId}`,
            patientId,
            patientName: message.patient.name,
            patientEmail: message.patient.email,
            nutritionistName: CommunicationService.NUTRITIONIST,
            messages: []
          };

          conversation.messages.push({
            id: String(message.id),
            author: message.sender === 'nutritionist' ? 'nutritionist' : 'patient',
            sentAt: message.sentAt ?? new Date().toISOString(),
            body: message.content
          });

          conversations.set(patientId, conversation);
        }

        const mapped = Array.from(conversations.values()).map((conversation) => ({
          ...conversation,
          messages: conversation.messages.sort((left, right) => left.sentAt.localeCompare(right.sentAt))
        }));

        this.conversationsData.set(mapped);
        this.selectedId.set(mapped[0]?.id ?? null);
      });
  }
}
