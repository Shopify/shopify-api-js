/* global process */
// import http from 'http';
const http = require('http');

// eslint-disable-next-line no-process-env
const port = process.env.PORT || 3000;
const errorStatusText = 'Did not work';
const requestId = 'Request id header';
const responses = {
  200: {
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  },
  custom: {
    statusCode: 200,
    statusText: 'OK',
    headers: {'X-Not-A-Real-Header': 'some_value'},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  },
  lowercaseua: {
    statusCode: 200,
    statusText: 'OK',
    headers: {'user-agent': 'My lowercase agent'},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  },
  uppercaseua: {
    statusCode: 200,
    statusText: 'OK',
    headers: {'User-Agent': 'My agent'},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  },
  contextua: {
    statusCode: 200,
    statusText: 'OK',
    headers: {'User-Agent': 'Context Agent'},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  },
  contextandheadersua: {
    statusCode: 200,
    statusText: 'OK',
    headers: {'User-Agent': 'Headers Agent | Context Agent'},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  },
  deprecatedget: {
    statusCode: 200,
    statusText: 'OK',
    headers: {
      'X-Shopify-API-Deprecated-Reason':
        'This API endpoint has been deprecated',
    },
    body: JSON.stringify({message: 'Some deprecated request'}),
  },
  deprecatedpost: {
    statusCode: 200,
    statusText: 'OK',
    headers: {
      'X-Shopify-API-Deprecated-Reason':
        'This API endpoint has been deprecated',
    },
    body: JSON.stringify({
      message: 'Some deprecated post request',
      body: {
        query: 'some query',
      },
    }),
  },
  403: {
    statusCode: 403,
    statusText: errorStatusText,
    headers: {'x-request-id': requestId},
    body: JSON.stringify({errors: 'Something went wrong!'}),
  },
  404: {
    statusCode: 404,
    statusText: errorStatusText,
    headers: {},
    body: JSON.stringify({}),
  },
  429: {
    statusCode: 429,
    statusText: errorStatusText,
    headers: {'x-request-id': requestId},
    body: JSON.stringify({errors: 'Something went wrong!'}),
  },
  wait: {
    statusCode: 429,
    statusText: errorStatusText,
    headers: {'Retry-After': (0.05).toString()},
    body: JSON.stringify({errors: 'Something went wrong!'}),
  },
  500: {
    statusCode: 500,
    statusText: errorStatusText,
    headers: {'x-request-id': requestId},
    body: JSON.stringify({}),
  },
  error: {
    statusCode: 500,
    statusText: errorStatusText,
    headers: {},
    body: JSON.stringify({errors: 'Something went wrong'}),
  },
  detailederror: {
    statusCode: 500,
    statusText: errorStatusText,
    headers: {},
    body: JSON.stringify({
      errors: {title: 'Invalid title', description: 'Invalid description'},
    }),
  },
};

let retryCount = 0;

const server = http.createServer((req, res) => {
  // console.log(req.method, req.url, req.headers);
  const lookup = req.url.match(/^\/url\/path\/([a-z0-9]*)$/);
  const code = lookup ? lookup[1] : '200';
  let response = responses[code] || responses['200'];
  if (code === 'retries' && retryCount < 2) {
    // console.log(`retries: retryCount = ${retryCount}`);
    response = responses['429'];
    retryCount += 1;
  }
  if (code === 'retrythenfail') {
    if (retryCount === 0) {
      response = responses['500'];
      retryCount = 1;
    } else {
      response = responses['403'];
      // this is the end of the test, reset the counter
      retryCount = 0;
    }
  }
  if (code === 'retrythensuccess') {
    if (retryCount === 0) {
      response = responses.wait;
      retryCount = 1;
    } else {
      // this is the end of the test, reset the counter; response already defaults to success
      retryCount = 0;
    }
  }
  if (code === 'maxretries') {
    response = responses['500'];
  }
  // console.log(response);
  res.writeHead(response.statusCode, response.statusText, response.headers);
  res.end(response.body);

  // reset counters
  if (code !== 'retries' && retryCount === 2) {
    retryCount = 0;
  }

  if (code === 'endtest') {
    handle(0);
  }
});

// eslint-disable-next-line no-unused-vars
function handle(_signal) {
  process.exit(0);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

// eslint-disable-next-line no-empty-function
server.listen(port, () => {});
