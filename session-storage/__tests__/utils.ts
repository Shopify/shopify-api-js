import {Socket, SocketConnectOpts} from 'net';

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
    function data() {
      resolve('data');
      cleanup();
    }
    function error(err: any) {
      reject(err);
      cleanup();
    }
    function close() {
      resolve('no data');
      cleanup();
    }
    function cleanup() {
      socket.off('data', data);
      socket.off('error', error);
      socket.off('close', close);
    }
    socket.on('data', data);
    socket.on('error', error);
    socket.on('close', close);
  });
}

export function connectSocket(
  socket: Socket,
  opts: SocketConnectOpts,
): Promise<void> {
  return new Promise((resolve, reject) => {
    function error(err: any) {
      reject(err);
      cleanup();
    }
    function cleanup() {
      socket.off('error', error);
    }
    socket.on('error', error);
    socket.connect(opts, () => {
      resolve();
      cleanup();
    });
  });
}
