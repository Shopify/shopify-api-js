import {Context} from "../context"

beforeEach(() => {
  // We ignore Typescript errors below because these are private components that we're overriding.
  // It is not the cleanest solution but it ensures that every test starts with a clean Context
  // without having to expose a potentially app-breaking method.

  // @ts-ignore
  Context.initialized = false;
  // @ts-ignore
  delete Context.instance;
});
