import {Socket} from 'net';

export function connect(port: number, host: string): Promise<Socket> {
  const socket = new Socket();
  return new Promise((resolve, reject) => {
    socket.connect(port, host);
    socket.on('connect', () => resolve(socket));
    socket.on('error', (err) => reject(err));
  });
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export async function pollTCPSocketForAResponse(
  port: number,
  addr: string,
  {interval = 100, timeout = 5000} = {},
): Promise<void> {
  const start = Date.now();
  while (true) {
    const elapsed = Date.now() - start;
    if (elapsed > timeout) {
      throw Error('Timeout');
    }

    let socket;
    try {
      socket = await connect(port, addr);
      // Closing the socket without sending anything should
      // prompt the server (if it is listening!) to send an error message.
      socket.end();
      await waitForData(socket);
      return;
    } catch {
      await wait(interval);
    } finally {
      socket?.destroy();
    }
  }
}

export function waitForData(socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.on('data', () => resolve());
    socket.on('error', (err) => reject(err));
    socket.on('close', () => reject(Error('Closed prematurely')));
  });
}
