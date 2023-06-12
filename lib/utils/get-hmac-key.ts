export function getHMACKey(key: string): Uint8Array {
  const arrayBuffer = new Uint8Array(key.length);
  for (let i = 0, keyLen = key.length; i < keyLen; i++) {
    arrayBuffer[i] = key.charCodeAt(i);
  }

  return arrayBuffer;
}
