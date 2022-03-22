import type {QueryParams} from '../types';

export default class ProcessedQuery {
  static stringify(keyValuePairs: {[key: string]: QueryParams} = {}): string {
    const processedQuery = new ProcessedQuery();
    processedQuery.putAll(keyValuePairs);
    return processedQuery.stringify();
  }

  processedQuery: {
    [key: string]: string | number | (string | number)[];
  };

  constructor() {
    this.processedQuery = {};
  }

  putAll(keyValuePairs: {[key: string]: QueryParams}): ProcessedQuery {
    for (const [key, value] of Object.entries(keyValuePairs)) {
      this.put(key, value);
    }
    return this;
  }

  put(key: string, value: QueryParams): void {
    if (Array.isArray(value)) {
      this.putArray(key, value);
    } else if (typeof value === 'object') {
      this.putObject(key, value);
    } else {
      this.putSimple(key, value);
    }
  }

  putArray(key: string, value: (string | number)[]): void {
    this.processedQuery[`${key}[]`] = value;
  }

  putObject(key: string, value: object): void {
    Object.entries(value).forEach(
      ([entry, entryValue]: [string, string | number]) => {
        this.processedQuery[`${key}[${entry}]`] = entryValue;
      },
    );
  }

  putSimple(key: string, value: string | number): void {
    this.processedQuery[key] = value;
  }

  stringify(): string {
    const entries = Object.entries(this.processedQuery).flatMap<
      [string, number | string]
      // Using `any` because I’m not sure what TypeScript is on about here.
    >(([key, value]: any): any => {
      if (Array.isArray(value)) {
        return value.map((value) => [key, value]);
      }
      return [[key, value]];
    });
    return new URLSearchParams(entries as any).toString();
  }
}
