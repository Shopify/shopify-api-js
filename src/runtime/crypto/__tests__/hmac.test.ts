import {crypto} from '../crypto';
import {createSHA256HMAC, asBase64} from '..';

const NUM_FUZZS = 100;
describe('Wrapper to create HMACs', () => {
  it('gives the same results as Node’s crypto API', async () => {
    for (let i = 0; i < NUM_FUZZS; i++) {
      const secret = (crypto as any)
        .randomBytes(random({min: 4, max: 32}))
        .toString('hex');
      const payload = (crypto as any)
        .randomBytes(random({min: 4, max: 128}))
        .toString('hex');
      const hmac = await createSHA256HMAC(secret, payload);
      const nodeHmac = (crypto as any)
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('base64');

      expect(hmac).toEqual(nodeHmac);
    }
  });
});

describe('Base64 encoder', () => {
  it('gives the same results as Node', async () => {
    for (let i = 0; i < NUM_FUZZS; i++) {
      const payload = (crypto as any).randomBytes(random({min: 4, max: 128}));
      const b64Encoding = asBase64(payload.buffer);
      const b64EncodingNode = payload.toString('base64');

      expect(b64Encoding).toEqual(b64EncodingNode);
    }
  });
});

function random({min = 0, max = 1, floor = true} = {}): number {
  let value = Math.random() * (max - min) + min;
  if (floor) {
    value = Math.floor(value);
  }
  return value;
}
