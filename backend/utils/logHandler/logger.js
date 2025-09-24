// utils/logHandler/logger.js (ESM)
import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';
const baseOptions = {
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.passcode',
      'req.body.token',
      'res.headers["set-cookie"]'
    ],
    remove: true
  },
  base: { service: process.env.SERVICE_NAME || 'api-service' },
  timestamp: pino.stdTimeFunctions.isoTime
};

let logger;

if (!isProd && process.env.LOG_PRETTY === 'true') {
  logger = pino({
    ...baseOptions,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        colorize: true,
        // add an extra blank line between logs
        messageFormat: '{msg}\n'
      }
    }
  });
} else {
  // Default: JSON logs. In dev, add a blank line between entries.
  const destination = isProd
    ? pino.destination(1) // stdout
    : {
        write: (msg) => {
          // ensure each entry has an extra newline for readability in dev
          const out = msg.endsWith('\n') ? `${msg}\n` : `${msg}\n\n`;
          process.stdout.write(out);
        }
      };

  logger = pino(baseOptions, destination);
}

export default logger;


