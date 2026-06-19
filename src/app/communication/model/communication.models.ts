export type MessageAuthor = 'patient' | 'nutritionist';

/** A single message inside a conversation. */
export interface ConversationMessage {
  id: string;
  author: MessageAuthor;
  /** ISO date-time string. */
  sentAt: string;
  /** i18n key for seeded sample messages (`communication.samples.*`). */
  bodyKey?: string;
  /** Literal text for user-sent (local mock) messages. */
  body?: string;
}

/** A patient <-> nutritionist conversation thread. */
export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  nutritionistName: string;
  messages: ConversationMessage[];
}

/** Derived inbox row for the professional view. */
export interface ConversationPreview {
  id: string;
  patientName: string;
  lastMessage: ConversationMessage | null;
  /** True when the last message was authored by the patient (awaiting reply). */
  awaitingReply: boolean;
}
