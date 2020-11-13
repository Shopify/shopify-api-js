import { Context } from "../context"

beforeEach(() => {
  // We want to reset the Context object on every run so that tests start with a consistent state
  Context.initialize({
    API_KEY: 'test_key',
    API_SECRET_KEY: 'test_secret_key',
    SCOPES: ['test_scope'],
    HOST_NAME: 'test_host_name',
  });
});
