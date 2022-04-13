const headers = {
  'header 1': 'Value for header one',
  'header 2': 'Value for header two',
  'content-type': 'text/plain',
};

const expectedHeaders = [
  {
    'Header 2': 'Value for header two',
    'Content-Type': 'text/plain',
  },
  {
    Header2: 'Value for header two',
    'Content-Type': 'text/plain',
  },
  {},
  {
    'Content-Type': 'text/plain',
    Accept: 'application/json',
  },
  {
    'content-type': 'application/json',
    'Header 2': 'Value for header two',
  },
];

expectedHeaders.forEach((expectedHeader) => {
  let expectedHeadersCorrect = true;
  let output = '';
  if (Object.keys(expectedHeader).length > 0) {
    output += `expectedHeader = ${JSON.stringify(expectedHeader)}\n--> `;
    for (const key in expectedHeader) {
      output += `header to compare = ${key.toLowerCase()} | `;
      if (key.toLowerCase() in headers) {
        output += 'key found in headers\n    ';
        expectedHeadersCorrect =
          expectedHeadersCorrect &&
          (headers[key.toLowerCase()] === expectedHeader[key]);
      } else {
        output += 'key NOT found in headers | ';
        expectedHeadersCorrect = false;
      }
      if (!expectedHeadersCorrect) break;
    }
    output += `expectedHeadersCorrect = ${expectedHeadersCorrect}`;
  } else {
    output += 'Nothing to compare';
  }
  console.log(`${output}\n`);
});

expectedHeaders.forEach((expectedHeader) => {
  let expectedHeadersCorrect = true;
  if (Object.keys(expectedHeader).length > 0) {
    // eslint-disable-next-line guard-for-in
    for (const key in expectedHeader) {
      expectedHeadersCorrect =
        expectedHeadersCorrect &&
        key.toLowerCase() in headers &&
        headers[key.toLowerCase()] === expectedHeader[key];
      if (!expectedHeadersCorrect) break;
    }
  }
  console.log(
    `result for ${JSON.stringify(expectedHeader)} = ${expectedHeadersCorrect}\n`,
  );
});

function canonicalizeValue(value) {
  if (typeof value === 'number') return value.toString();
  return value;
}

function canonicalizeHeaderName(hdr) {
  return hdr.replace(
    /(^|-)(\w+)/g,
    (_fullMatch, start, letters) =>
      start +
      letters.slice(0, 1).toUpperCase() +
      letters.slice(1).toLowerCase(),
  );
}

function canonicalizeHeaders(hdr) {
  for (const [key, values] of Object.entries(hdr)) {
    const canonKey = canonicalizeHeaderName(key);
    if (!hdr[canonKey]) hdr[canonKey] = [];
    if (!Array.isArray(hdr[canonKey]))
      hdr[canonKey] = [canonicalizeValue(hdr[canonKey])];
    if (key === canonKey) continue;
    delete hdr[key];
    hdr[canonKey].push(
      ...[values].flat().map((value) => canonicalizeValue(value)),
    );
  }
  return hdr;
}
console.log(`${JSON.stringify(headers, undefined, 2)}`);
console.log(`${JSON.stringify(canonicalizeHeaders(headers), undefined, 2)}`);
