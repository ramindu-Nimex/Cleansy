// utils/logHandler/requestContext.js  (ESM)
import { AsyncLocalStorage } from 'node:async_hooks';

const als = new AsyncLocalStorage();

export function withRequestContext(ctx, fn) {
  return als.run(ctx, fn);
}

export function getRequestContext() {
  return als.getStore() ?? {};
}

// optional default if you ever want `import ctx from ...`
export default { withRequestContext, getRequestContext };

