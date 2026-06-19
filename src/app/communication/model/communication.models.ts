export type MessageAuthorRole = 'patient' | 'nutritionist';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ConversationParticipant {
  id: string;
  displayName: string;
  role: MessageAuthorRole;
}

export interface Message {
  id: string;
  authorId: string;
  authorRole: MessageAuthorRole;
  bodyKey?: string;
  body?: string;
  sentAt: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  patientId: string;
  nutritionistId: string;
  participants: ConversationParticipant[];
  subjectKey: string;
  unreadByPatient: number;
  unreadByNutritionist: number;
  messages: Message[];
}
