import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationService);
  });

  it('exposes patient and professional unread counts', () => {
    expect(service.patientConversation()?.id).toBe('conv-andrea');
    expect(service.unreadForPatient()).toBe(1);
    expect(service.unreadForNutritionist()).toBe(3);
  });

  it('selects a conversation and marks it read for the viewer role', () => {
    service.selectConversation('conv-marco', 'nutritionist');

    expect(service.selectedConversation()?.id).toBe('conv-marco');
    expect(service.unreadForNutritionist()).toBe(1);
  });

  it('appends local mock messages and increments the recipient unread count', () => {
    const conversationId = 'conv-andrea';
    const initialCount = service.patientConversation()?.messages.length ?? 0;
    const initialUnread = service.unreadForPatient();

    service.sendMessage(conversationId, 'nutritionist', 'Please keep breakfast as planned tomorrow.');

    const conversation = service.patientConversation();
    expect(conversation?.messages.length).toBe(initialCount + 1);
    expect(conversation?.messages.at(-1)?.body).toBe('Please keep breakfast as planned tomorrow.');
    expect(service.unreadForPatient()).toBe(initialUnread + 1);
  });
});
