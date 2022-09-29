import {ChildProcess} from 'child_process';

export interface E2eTestEnvironment {
  name: string;
  domain: string;
  dummyServerPort: string;
  process: ChildProcess;
  testable: boolean;
  ready: boolean;
}
