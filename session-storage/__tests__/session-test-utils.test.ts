import {Session} from '../../lib/session/session';

import {sessionArraysEqual} from './session-test-utils';

describe('test sessionArraysEqual', () => {
  it('returns true for two identically ordered arrays', () => {
    const sessionsExpected = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];
    const sessionsToCompare = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(true);
  });

  it('returns true for two arrays with same content but out of order', () => {
    const sessionsExpected = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];
    const sessionsToCompare = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(true);
  });

  it('returns false for two arrays not the same size', () => {
    const sessionsExpected = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];
    const sessionsToCompare = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);
  });

  it('returns false for two arrays of the same size but different content', () => {
    const sessionsExpected = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];
    let sessionsToCompare = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_5',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);

    sessionsToCompare = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop4-sessions',
        state: 'state',
        isOnline: true,
      }),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);

    sessionsToCompare = [
      new Session({
        id: 'test_sessions_1',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_3',
        shop: 'shop1-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_2',
        shop: 'shop2-sessions',
        state: 'state',
        isOnline: true,
      }),
      new Session({
        id: 'test_sessions_4',
        shop: 'shop3-sessions',
        state: 'state',
        isOnline: false,
      }),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);
  });
});
