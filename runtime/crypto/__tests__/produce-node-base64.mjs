import crypto from 'crypto';

import {random} from './random.mjs';

const NUM_FUZZS = parseInt(process.argv[2]);

const output = Array(NUM_FUZZS)
  .fill(0)
  .reduce((acc) => {
    const payload = crypto.randomBytes(random({min: 4, max: 128}));

    return acc.concat({
      hex: payload.toString('hex'),
      base64: payload.toString('base64'),
    });
  }, []);

console.log(JSON.stringify(output));
