import {Socket} from 'net';

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export async function poll(
  func: () => Promise<boolean>,
  {interval = 100, timeout = 5000} = {},
) {
  const start = Date.now();
  while (true) {
    const elapsed = Date.now() - start;
    if (elapsed > timeout) {
      throw Error('Timeout');
    }

    try {
      const success = await func();
      if (success) return;
    } catch {
      /* lol empty */
    }
    await wait(interval);
  }
}

export function waitForData(socket: Socket): Promise<string> {
  return new Promise((resolve, reject) => {
    socket.on('data', () => resolve('data'));
    socket.on('error', (err) => reject(err));
    socket.on('close', () => resolve('no data'));
  });
}
