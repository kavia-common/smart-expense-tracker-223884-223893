# Operations & Deployment

## Logging

- Frontend logs errors to the browser console with careful omission of PII.
- All data errors and authentication issues are surfaced via user-friendly toast notifications.
- For deeper monitoring, connect remote logging (e.g., Sentry) at the app boundary.

## Monitoring

- Health checks: App returns 200 OK at root and `/health` endpoint (if implemented).
- Future: integrate APM tools or service worker for bad network detection.

## Deployment

### Build

```sh
npm run build      # outputs static bundle to build/
```

### Preview

- Developers can launch with `npm start` (port 3000, controlled by env variable).

### Hosting

- Can be deployed to Vercel, Netlify, AWS Amplify, or any static host.
- Env vars must be configured securely for each environment.
- For non-public storage, a backend proxy is needed for file SPAs.

### CI/CD

- Add to workflow (GitHub Actions, etc):
  - Lint: `npm run lint` or ESLint.
  - Test: `npm test`
  - Build: `npm run build`

### Health Metrics

- Validate deployment by checking key screens (dashboard, auth, expenses page).
- Monitor bundle size and load time via web performance profiling.

## Preview Notes

- Live preview: [https://vscode-internal-23422-beta.beta01.cloud.kavia.ai:3000](https://vscode-internal-23422-beta.beta01.cloud.kavia.ai:3000)
- For storage, ensure bucket `receipts` is public OR build endpoint for signed access.

---
Sources:  
- package.json, src/index.js, README, app shell.
