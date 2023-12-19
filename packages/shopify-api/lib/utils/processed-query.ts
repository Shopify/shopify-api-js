export default class ProcessedQuery {
  static stringify(keyValuePairs?: Record<string, any>): string {
    if (!keyValuePairs || Object.keys(keyValuePairs).length === 0) return '';

    return new ProcessedQuery().putAll(keyValuePairs).stringify();
  }

  processedQuery: URLSearchParams;

  constructor() {
    this.processedQuery = new URLSearchParams();
  }

  putAll(keyValuePairs: Record<string, any>): ProcessedQuery {
    Object.entries(keyValuePairs).forEach(([key, value]: [string, any]) =>
      this.put(key, value),
    );
    return this;
  }

  put(key: string, value: any): void {
    if (Array.isArray(value)) {
      this.putArray(key, value);
    } else if (value?.constructor === Object) {
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

  stringify(omitQuestionMark = false): string {
    const queryString = this.processedQuery.toString();
    return omitQuestionMark ? queryString : `?${queryString}`;
  }
}
