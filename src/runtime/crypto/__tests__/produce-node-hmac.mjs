import crypto from 'crypto';

import {random} from './random.mjs';

const NUM_FUZZS = parseInt(process.argv[2]);

const output = Array(NUM_FUZZS)
  .fill(0)
  .reduce((acc) => {
    const secret = crypto
      .randomBytes(random({min: 4, max: 32}))
      .toString('hex');
    const payload = crypto
      .randomBytes(random({min: 4, max: 128}))
      .toString('hex');

    return acc.concat({
      secret,
      payload,
      hmac: crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('base64'),
    });
  }, []);

console.log(JSON.stringify(output));
