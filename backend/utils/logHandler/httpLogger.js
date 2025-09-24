// utils/logHandler/httpLogger.js (ESM)
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import logger from './logger.js';
import { withRequestContext } from './requestContext.js';

export const httpLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const incoming = req.headers['x-request-id'];
    const id = typeof incoming === 'string' && incoming.trim() ? incoming : randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },
  autoLogging: { ignore: (req) => req.url === '/health' },
  serializers: {
    req(req) {
      const bodyPreview = safeBody(req.raw?.body ?? req.body);
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.socket?.remoteAddress,
        headers: pickHeaders(req.headers),
        body: bodyPreview
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    }
  },
  customLogLevel(res, err) {
    if (err) return 'error';
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(res) {
    return `completed ${res.statusCode}`;
  },
  customErrorMessage(err, res) {
    return `failed ${res?.statusCode || 500}: ${err.message}`;
  }
});

export function contextMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  const ctx = { requestId: req.id };

  withRequestContext(ctx, () => {
    req.log.info({ event: 'request.start' }, `incoming ${req.method} ${req.url}`);

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
      req.log.info(
        { event: 'request.finish', durationMs: Math.round(durationMs) },
        `done ${req.method} ${req.url} in ${Math.round(durationMs)}ms`
      );
    });

    next();
  });
}

function pickHeaders(h = {}) {
  const keep = ['user-agent', 'x-forwarded-for', 'x-request-id', 'content-type'];
  const out = {};
  for (const k of keep) if (h[k]) out[k] = h[k];
  return out;
}

function safeBody(body) {
  if (!body) return undefined;
  const str = typeof body === 'string' ? body : JSON.stringify(body);
  if (str.length > 1000) return '[truncated]';
  // shallow redaction
  if (typeof body === 'object' && body !== null) {
    const clone = { ...body };
    for (const k of Object.keys(clone)) {
      const lower = k.toLowerCase();
      if (['password', 'passcode', 'token', 'authorization'].includes(lower)) clone[k] = '[redacted]';
    }
    return clone;
  }
  return body;
}

export default { httpLogger, contextMiddleware };
