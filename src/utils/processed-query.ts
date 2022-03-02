import querystring, {ParsedUrlQueryInput} from 'querystring';

export default class ProcessedQuery {
  static stringify(keyValuePairs?: {[key: string]: any}): string {
    if (!keyValuePairs || Object.keys(keyValuePairs).length === 0) return '';

    return new ProcessedQuery().putAll(keyValuePairs).stringify();
  }

  processedQuery: {
    [key: string]: string | number | (string | number)[];
  };

  constructor() {
    this.processedQuery = {};
  }

  putAll(keyValuePairs: {[key: string]: any}): ProcessedQuery {
    Object.entries(keyValuePairs).forEach(([key, value]: [string, any]) =>
      this.put(key, value),
    );
    return this;
  }

  put(key: string, value: any): void {
    if (Array.isArray(value)) {
      this.putArray(key, value);
    } else if (value.constructor === Object) {
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
    return `?${querystring.stringify(
      this.processedQuery as ParsedUrlQueryInput,
    )}`;
  }
}
