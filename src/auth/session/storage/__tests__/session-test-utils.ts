import {sessionEqual} from '../../session-utils';
import {SessionInterface} from '../../types';

// compare two arrays of sessions that should contain
// the same sessions but may be in a different order
export function sessionArraysEqual(
  sessionArray1: SessionInterface[],
  sessionArray2: SessionInterface[],
): boolean {
  if (sessionArray1.length !== sessionArray2.length) {
    return false;
  }

  for (const session1 of sessionArray1) {
    let found = false;
    for (const session2 of sessionArray2) {
      if (sessionEqual(session1, session2)) {
        found = true;
        continue;
      }
    }
    if (!found) return false;
  }
  return true;
}
