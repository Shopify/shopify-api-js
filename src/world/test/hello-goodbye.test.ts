const hg = require('../hello-goodbye');

test('response from hello', () => {
  expect(hg.sayHello('test')).toMatch('Hello, test');
});

test('response from goodbye', () => {
  expect(hg.sayGoodbye('test')).toMatch('Goodbye, test');
});
