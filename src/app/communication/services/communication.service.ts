import { computed, Injectable, signal } from '@angular/core';
import { Conversation, Message, MessageAuthorRole } from '../model/communication.models';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private readonly conversationsData = signal<Conversation[]>([
    {
      id: 'conv-andrea',
      patientId: 'p-001',
      nutritionistId: 'nutritionist-demo',
      subjectKey: 'communication.subjects.weekPlan',
      unreadByPatient: 1,
      unreadByNutritionist: 0,
      participants: [
        { id: 'p-001', displayName: 'Andrea Flores', role: 'patient' },
        { id: 'nutritionist-demo', displayName: 'Dr. Carlos Medina', role: 'nutritionist' }
      ],
      messages: [
        {
          id: 'msg-001',
          authorId: 'p-001',
          authorRole: 'patient',
          bodyKey: 'communication.samples.andreaQuestion',
          sentAt: '2026-06-18T09:20:00',
          status: 'read'
        },
        {
          id: 'msg-002',
          authorId: 'nutritionist-demo',
          authorRole: 'nutritionist',
          bodyKey: 'communication.samples.carlosAnswer',
          sentAt: '2026-06-18T10:05:00',
          status: 'delivered'
        },
        {
          id: 'msg-003',
          authorId: 'nutritionist-demo',
          authorRole: 'nutritionist',
          bodyKey: 'communication.samples.carlosReminder',
          sentAt: '2026-06-19T08:30:00',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'conv-marco',
      patientId: 'p-002',
      nutritionistId: 'nutritionist-demo',
      subjectKey: 'communication.subjects.appointment',
      unreadByPatient: 0,
      unreadByNutritionist: 2,
      participants: [
        { id: 'p-002', displayName: 'Marco Rios', role: 'patient' },
        { id: 'nutritionist-demo', displayName: 'Dr. Carlos Medina', role: 'nutritionist' }
      ],
      messages: [
        {
          id: 'msg-004',
          authorId: 'p-002',
          authorRole: 'patient',
          bodyKey: 'communication.samples.marcoReschedule',
          sentAt: '2026-06-18T11:12:00',
          status: 'delivered'
        },
        {
          id: 'msg-005',
          authorId: 'p-002',
          authorRole: 'patient',
          bodyKey: 'communication.samples.marcoFollowup',
          sentAt: '2026-06-18T16:40:00',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'conv-lucia',
      patientId: 'p-003',
      nutritionistId: 'nutritionist-demo',
      subjectKey: 'communication.subjects.training',
      unreadByPatient: 0,
      unreadByNutritionist: 1,
      participants: [
        { id: 'p-003', displayName: 'Lucia Mendez', role: 'patient' },
        { id: 'nutritionist-demo', displayName: 'Dr. Carlos Medina', role: 'nutritionist' }
      ],
      messages: [
        {
          id: 'msg-006',
          authorId: 'p-003',
          authorRole: 'patient',
          bodyKey: 'communication.samples.luciaSnack',
          sentAt: '2026-06-19T07:58:00',
          status: 'delivered'
        }
      ]
    }
  ]);
  private readonly selectedId = signal('conv-andrea');

  readonly conversations = this.conversationsData.asReadonly();
  readonly selectedConversationId = this.selectedId.asReadonly();
  readonly patientConversation = computed(() =>
    this.conversationsData().find((conversation) => conversation.patientId === 'p-001') ?? null
  );
  readonly selectedConversation = computed(() => {
    const selectedId = this.selectedId();
    return this.conversationsData().find((conversation) => conversation.id === selectedId) ?? this.conversationsData()[0] ?? null;
  });
  readonly unreadForPatient = computed(() =>
    this.conversationsData().reduce((total, conversation) => total + conversation.unreadByPatient, 0)
  );
  readonly unreadForNutritionist = computed(() =>
    this.conversationsData().reduce((total, conversation) => total + conversation.unreadByNutritionist, 0)
  );

  selectConversation(conversationId: string, viewerRole: MessageAuthorRole): void {
    this.selectedId.set(conversationId);
    this.markRead(conversationId, viewerRole);
  }

  sendMessage(conversationId: string, authorRole: MessageAuthorRole, body: string): void {
    const trimmed = body.trim();

    if (!trimmed) {
      return;
    }

    this.conversationsData.update((conversations) =>
      conversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const author = conversation.participants.find((participant) => participant.role === authorRole);
        const message: Message = {
          id: `msg-${Date.now()}`,
          authorId: author?.id ?? authorRole,
          authorRole,
          body: trimmed,
          sentAt: new Date().toISOString(),
          status: 'sent'
        };

        return {
          ...conversation,
          unreadByPatient: authorRole === 'nutritionist' ? conversation.unreadByPatient + 1 : conversation.unreadByPatient,
          unreadByNutritionist: authorRole === 'patient' ? conversation.unreadByNutritionist + 1 : conversation.unreadByNutritionist,
          messages: [...conversation.messages, message]
        };
      })
    );
  }

  participantName(conversation: Conversation, role: MessageAuthorRole): string {
    return conversation.participants.find((participant) => participant.role === role)?.displayName ?? '';
  }

  preview(conversation: Conversation): Message | null {
    return conversation.messages.at(-1) ?? null;
  }

  private markRead(conversationId: string, viewerRole: MessageAuthorRole): void {
    this.conversationsData.update((conversations) =>
      conversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          unreadByPatient: viewerRole === 'patient' ? 0 : conversation.unreadByPatient,
          unreadByNutritionist: viewerRole === 'nutritionist' ? 0 : conversation.unreadByNutritionist
        };
      })
    );
  }
}
