// utils/logHandler/errorHandler.js (ESM)
import logger from './logger.js';

export default function errorHandler(err, req, res, next) {
  const log = req?.log || logger;

  log.error(
    { err, event: 'request.error' },
    err.publicMessage ? err.publicMessage : err.message
  );

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: {
      message: err.publicMessage || 'Internal server error',
      requestId: req?.id
    }
  });
}

