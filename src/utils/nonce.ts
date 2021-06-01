
export default function nonce(): string {
  const length = 15;
  const bytes = crypto.getRandomValues(Buffer.allocUnsafe(length));

  const nonce = bytes
    .map((byte) => {
      return byte % 10;
    })
    .join('');

  return nonce;
}
