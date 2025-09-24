Title: Security Assessment and Remediation – Cleansy

1. Application Overview
- Tech stack: Node.js/Express, MongoDB (Mongoose), React
- Auth model: Cookie-based JWT for sessions; Google OAuth (OIDC) for SSO

2. Identified Vulnerabilities
- JWT/Token Handling
  - Tokens without expiry/issuer/audience
  - Cookie flags incomplete (no SameSite/Secure/maxAge)
  - Verification accepted only cookie; no alg/iss/aud checks
- CORS Misconfiguration
  - Permissive `cors()` allowed any origin by default
- Insufficient Logging & Monitoring
  - Use of console logs; limited context, no redaction guarantees

3. Fixes Implemented
- JWT Hardening
  - Added `expiresIn`, `issuer`, `audience`, algorithm `HS256` on sign
  - Middleware verifies token with alg/iss/aud and supports cookie or Bearer
  - Cookies: `httpOnly`, `secure` (prod), `sameSite` (configurable), `maxAge`
- CORS
  - Whitelist-based origins via `CORS_ORIGINS`, `credentials: true`
  - Allowed headers/methods; strict failure for unapproved origins
- Logging/Monitoring
  - Pino-based HTTP logging with per-request IDs, redact sensitive fields
  - Structured logs at key auth/DB events with severity


4. Files Changed (key)
- backend/controllers/auth.controller.js – JWT cookie options, Google OIDC verify
- backend/utils/verifyUser.js – strict verify with iss/aud/alg, Bearer support
- backend/server.js – strict CORS with credentials, trust proxy
- backend/dbConfig/dbConnection.js – structured logging

5. Configuration
- .env additions:
  - `CORS_ORIGINS`, `JWT_EXPIRES`, `JWT_MAX_AGE_MS`, `JWT_ISSUER`, `JWT_AUDIENCE`, `COOKIE_SAMESITE`, `GOOGLE_CLIENT_ID`, `LOG_LEVEL`, optional `LOG_PRETTY`, and `NODE_ENV`

6. Testing Procedure (abbrev)
- CORS preflight: OPTIONS with allowed vs disallowed origins
- JWT cookie flags: inspect Set-Cookie; verify HttpOnly/SameSite/Secure
- Protected routes: cookie and Bearer; 401 on tamper/expiry, 403 on authz



7. Individual Contributions
- <Member 1>: <details>
- <Member 2>: <details>
- <Member 3>: <details>
- <Member 4>: <details>

8. References
- OWASP ASVS, JWT Best Practices

