import { describe, it, expect, beforeEach } from 'vitest';
import { MatchmakingService } from '../src/services/matchmaking.service';
import { UserSession } from '@anonchat/types';

describe('MatchmakingService Priority Algorithm', () => {
  let matchmakingService: MatchmakingService;

  beforeEach(() => {
    matchmakingService = new MatchmakingService(null);
  });

  it('should match two users in the same queue with matching language and interests', async () => {
    const user1: UserSession = {
      sessionId: 'sess-1',
      socketId: 'sock-1',
      mode: 'text',
      language: 'hi',
      interests: ['coding', 'music'],
      joinedAt: Date.now(),
    };

    const user2: UserSession = {
      sessionId: 'sess-2',
      socketId: 'sock-2',
      mode: 'text',
      language: 'hi',
      interests: ['coding', 'gaming'],
      joinedAt: Date.now(),
    };

    const res1 = await matchmakingService.addUserToQueue(user1);
    expect(res1).toBeNull(); // User 1 waiting

    const res2 = await matchmakingService.addUserToQueue(user2);
    expect(res2).not.toBeNull();
    expect(res2?.userA.socketId).toBe('sock-2');
    expect(res2?.userB.socketId).toBe('sock-1');
    expect(res2?.sharedInterests).toEqual(['coding']);
  });

  it('should remove user from queue cleanly', async () => {
    const user1: UserSession = {
      sessionId: 'sess-1',
      socketId: 'sock-1',
      mode: 'voice',
      language: 'ta',
      interests: [],
      joinedAt: Date.now(),
    };

    await matchmakingService.addUserToQueue(user1);
    await matchmakingService.removeUserFromQueue('sock-1', 'voice');

    const user2: UserSession = {
      sessionId: 'sess-2',
      socketId: 'sock-2',
      mode: 'voice',
      language: 'ta',
      interests: [],
      joinedAt: Date.now(),
    };

    const res = await matchmakingService.addUserToQueue(user2);
    expect(res).toBeNull(); // No match because user 1 was removed
  });
});
