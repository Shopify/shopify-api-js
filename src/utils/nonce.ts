export default function nonce(): string {
  const length = 15;
  let nonce = '';

  for (let i = 0; i <= 3; i++) {
    nonce += Math.round(Number(new Date()) * Math.random());
  }

  const str = nonce.substr(nonce.length - length);
  return str;
}
