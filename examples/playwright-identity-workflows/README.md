# Identity & Access Testing Lab — Playwright / TypeScript

**Portfolio demonstration, not client work.** A runnable Playwright test suite exercising a fictional local identity platform (see [`../../demo-app`](../../demo-app)). Its tests intentionally cover both the happy path **and denied access paths**.

### What it tests
- Valid and invalid login
- Admin MFA challenge, wrong code, success, and replay prevention
- Role-based authorization, including HTTP `401` and `403`
- User provisioning and simulated credential rotation
- Session revocation after logout
- Accessible browser interactions and hidden privileged UI controls

### Run on your computer
Requirements: Node.js 20+; npm; internet access for initial install.

```bash
cd examples/playwright-identity-workflows
npm install
npx playwright install chromium
npm test
```

The test configuration **automatically starts** the local demo service on port 4173. A GitHub Actions workflow runs the same suite on every push / pull request. After running, optional results are in `playwright-report` and `test-results` (not committed).

### Design choices
- Playwright's `request` fixture for API-level checks (faster than unnecessary UI navigation)
- Chromium browser checks for end-to-end coverage
- Role-focused scenarios and explicit assertions for negative tests
- Local fake identities; **no live IdP, Okta credentials, real account identifiers, or client data**

**Limitations:** For educational purposes, the test server uses fixed demo passwords, fixed MFA codes and in-memory fake sessions. Do not deploy it as a production identity platform.
