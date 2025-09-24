// utils/logHandler/contextLogger.js (ESM)
import logger from './logger.js';
import { getRequestContext } from './requestContext.js';

export function getLogger(bindings = {}) {
  const { requestId } = getRequestContext();
  return logger.child({ requestId, ...bindings });
}

export default { getLogger };

