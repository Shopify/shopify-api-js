export function splitN(str: string, sep: string, maxNumParts: number): string[] {
  const parts = str.split(sep);
  return [
    ...parts.slice(0, maxNumParts - 1),
    parts.slice(maxNumParts - 1).join(sep),
  ];
}