import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationService);
  });

  it('lists seeded conversations with one preview each', () => {
    expect(service.conversations().length).toBeGreaterThan(0);
    expect(service.previews().length).toBe(service.conversations().length);
  });

  it('resolves a conversation by patient email (case-insensitive)', () => {
    const conversation = service.conversationForEmail('ANDREA@email.com');
    expect(conversation).not.toBeNull();
    expect(conversation?.patientEmail).toBe('andrea@email.com');
  });

  it('selects a conversation', () => {
    const target = service.conversations()[1];
    service.selectConversation(target.id);
    expect(service.selectedConversation()?.id).toBe(target.id);
  });

  it('appends a trimmed local mock message authored by the sender', () => {
    const target = service.conversations()[0];
    const before = target.messages.length;

    service.sendMessage(target.id, 'patient', '  Hello from the test  ');

    const updated = service.conversations().find((conversation) => conversation.id === target.id)!;
    expect(updated.messages.length).toBe(before + 1);

    const last = updated.messages.at(-1)!;
    expect(last.author).toBe('patient');
    expect(last.body).toBe('Hello from the test');
    expect(last.bodyKey).toBeUndefined();
  });

  it('ignores empty messages', () => {
    const target = service.conversations()[0];
    const before = target.messages.length;

    service.sendMessage(target.id, 'nutritionist', '   ');

    const updated = service.conversations().find((conversation) => conversation.id === target.id)!;
    expect(updated.messages.length).toBe(before);
  });

  it('flags conversations awaiting a reply by the last author', () => {
    const awaiting = service.previews().find((preview) => preview.id === 'c-003');
    expect(awaiting?.awaitingReply).toBe(true);
  });
});
