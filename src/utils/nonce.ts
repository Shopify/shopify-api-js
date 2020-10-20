export default function nonce(): string {
  const length = 15;
  let n = '';

  for (let i = 0; i <= 3; i++) {
    n += Math.round(+new Date() * Math.random());
  }

  const s = n.substr(n.length - length);
  return s;
}
