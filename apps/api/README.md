# NestJS API

First, run the development server:

```bash
pnpm turbo dev
```

### Logger

Key things the logger should achieve:

- be idiomatic NestJS logger
- log in structured format (pino)
- log every request/response automatically (pino-http)
- automatically bind request data to the logs from any service on any application layer without passing request context (AsyncLocalStorage)
- easy transporting to third parties, namely Sentry

Pino (and pino-http) does this pretty well so far.


### Security (Todo)
 
Key things to achieve:

- All sensitive data is encrypted or hashed
- Secure JWT signing + appropriate expiration
- Rate limiting to protect against brute force attacks
- All inputs are validated before processing
- Security headers must be properly set
- No sensitive information in logs/error messages
- Parameterised queries to prevent SQL injection