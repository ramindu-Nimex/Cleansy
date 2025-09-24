import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

const JWT_ISSUER = process.env.JWT_ISSUER || 'cleansy-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'cleansy-client';

export const verifyToken = (req, res, next) => {
  // Prefer cookie, but allow Authorization: Bearer
  let token = req.cookies?.access_token;
  if (!token) {
    const auth = req.headers['authorization'] || '';
    if (auth.toLowerCase().startsWith('bearer ')) {
      token = auth.substring(7).trim();
    }
  }

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ['HS256'], issuer: JWT_ISSUER, audience: JWT_AUDIENCE },
    (err, user) => {
      if (err) {
        return next(errorHandler(401, "Unauthorized"));
      }
      req.user = user;
      next();
    }
  );
}
