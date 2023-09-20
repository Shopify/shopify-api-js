import {execSync} from 'child_process';

import {createSHA256HMAC, asBase64} from '..';
import {ShopifyError} from '../../../lib/error';
import {HashFormat} from '../types';
import {hashString} from '../utils';

const NUM_FUZZS = 100;
describe('Wrapper to create HMACs', () => {
  it('gives the same results as Node’s crypto API', async () => {
    const stdout = execSync(
      `node ./runtime/crypto/__tests__/produce-node-hmac.mjs ${NUM_FUZZS}`,
    );
    const output = JSON.parse(stdout.toString());

    for (let i = 0; i < NUM_FUZZS; i++) {
      const hmac = await createSHA256HMAC(output[i].secret, output[i].payload);

      expect(hmac).toEqual(output[i].hmac);
    }
  });
});

describe('Base64 encoder', () => {
  it('gives the same results as Node', async () => {
    const stdout = execSync(
      `node ./runtime/crypto/__tests__/produce-node-base64.mjs ${NUM_FUZZS}`,
    );
    const output = JSON.parse(stdout.toString());

    for (let i = 0; i < NUM_FUZZS; i++) {
      const b64Encoding = asBase64(
        new Uint8Array(
          output[i].hex
            .match(/../g)
            .map((hexChar: string) => parseInt(hexChar, 16)),
        ).buffer,
      );

      expect(b64Encoding).toEqual(output[i].base64);
    }
  });
});

describe('hashString', () => {
  it('can convert to base64', () => {
    const testString = 'this is my test string';
    expect(hashString(testString, HashFormat.Base64)).toEqual(
      'dGhpcyBpcyBteSB0ZXN0IHN0cmluZw==',
    );
  });

  it('can convert to hex', () => {
    const testString = 'this is my test string';
    expect(hashString(testString, HashFormat.Hex)).toEqual(
      '74686973206973206d79207465737420737472696e67',
    );
  });

  it('throws on unexpected format', () => {
    const testString = 'this is my test string';
    expect(() => hashString(testString, 'not-a-format' as any)).toThrowError(
      ShopifyError,
    );
  });
});
