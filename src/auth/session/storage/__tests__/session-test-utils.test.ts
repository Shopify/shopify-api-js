import {Session} from '../../session';

import {sessionArraysEqual} from './session-test-utils';

describe('test sessionArraysEqual', () => {
  it('returns true for two identically ordered arrays', () => {
    const sessionsExpected = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', true),
    ];
    const sessionsToCompare = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', true),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(true);
  });

  it('returns true for two arrays with same content but out of order', () => {
    const sessionsExpected = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', true),
    ];
    const sessionsToCompare = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', true),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(true);
  });

  it('returns false for two arrays not the same size', () => {
    const sessionsExpected = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
    ];
    const sessionsToCompare = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', true),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);
  });

  it('returns false for two arrays of the same size but different content', () => {
    const sessionsExpected = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', true),
    ];
    let sessionsToCompare = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_5', 'shop3-sessions', 'state', true),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);

    sessionsToCompare = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_4', 'shop4-sessions', 'state', true),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);

    sessionsToCompare = [
      new Session('test_sessions_1', 'shop1-sessions', 'state', true),
      new Session('test_sessions_3', 'shop1-sessions', 'state', true),
      new Session('test_sessions_2', 'shop2-sessions', 'state', true),
      new Session('test_sessions_4', 'shop3-sessions', 'state', false),
    ];

    expect(sessionArraysEqual(sessionsToCompare, sessionsExpected)).toBe(false);
  });
});
