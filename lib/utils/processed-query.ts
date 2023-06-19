<<<<<<< HEAD:lib/utils/processed-query.ts
=======
import type {QueryParams} from '../types';

>>>>>>> origin/isomorphic/main:src/utils/processed-query.ts
export default class ProcessedQuery {
  static stringify(keyValuePairs: {[key: string]: QueryParams} = {}): string {
    const processedQuery = new ProcessedQuery();
    processedQuery.putAll(keyValuePairs);
    return processedQuery.stringify();
  }

  processedQuery: URLSearchParams;

  constructor() {
    this.processedQuery = new URLSearchParams();
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
<<<<<<< HEAD:lib/utils/processed-query.ts
    } else if (value?.constructor === Object) {
=======
    } else if (typeof value === 'object') {
>>>>>>> origin/isomorphic/main:src/utils/processed-query.ts
      this.putObject(key, value);
    } else {
      this.putSimple(key, value);
    }
  }

  putArray(key: string, value: (string | number)[]): void {
    value.forEach((arrayValue) =>
      this.processedQuery.append(`${key}[]`, `${arrayValue}`),
    );
  }

  putObject(key: string, value: object): void {
    Object.entries(value).forEach(
      ([entry, entryValue]: [string, string | number]) => {
        this.processedQuery.append(`${key}[${entry}]`, `${entryValue}`);
      },
    );
  }

  putSimple(key: string, value: string | number): void {
    this.processedQuery.append(key, `${value}`);
  }

<<<<<<< HEAD:lib/utils/processed-query.ts
  stringify(omitQuestionMark = false): string {
    const queryString = this.processedQuery.toString();
    return omitQuestionMark ? queryString : `?${queryString}`;
=======
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
>>>>>>> origin/isomorphic/main:src/utils/processed-query.ts
  }
}
