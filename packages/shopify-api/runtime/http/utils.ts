export function splitN(
  str: string,
  sep: string,
  maxNumParts: number,
): string[] {
  const parts = str.split(sep);
  const maxParts = Math.min(Math.abs(maxNumParts), parts.length);

  return [...parts.slice(0, maxParts - 1), parts.slice(maxParts - 1).join(sep)];
}
