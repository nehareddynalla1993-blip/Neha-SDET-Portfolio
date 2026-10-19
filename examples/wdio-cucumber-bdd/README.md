# Reusable BDD Framework — WebdriverIO / Cucumber / TypeScript

**Portfolio demonstration**, created for a **fictional** identity UI. This project illustrates a maintainable WebdriverIO + Cucumber BDD approach.

### What's included
- Plain-English Gherkin feature scenarios in `features/`
- Reusable browser actions and selectors in `pages/identity.page.ts`
- Business-readable Cucumber step definitions in `step-definitions/`
- Negative access-control checks (analyst cannot see provisioning)
- Admin MFA and account provisioning flow
- Local test service automatically started and stopped by `run.mjs`

### Run
Requires Node.js 20+, Google Chrome / Chromium available to WebdriverIO, npm, and internet access for first install.

```bash
cd examples/wdio-cucumber-bdd
npm install
npm test
```

WebdriverIO may download or locate the Chrome browser/driver depending on your OS and installation. Test reports print to the terminal. Demo application runs on `http://127.0.0.1:4173`.

### Framework organization

```text
features/          # Business behavior written in Gherkin
pages/             # Reusable locators + interaction methods
step-definitions/  # Cucumber test glue
wdio.conf.ts       # Browser, reporter, timeout config
run.mjs            # Demo service lifecycle + test runner
```

**Note:** Only synthetic credentials and data are used. This does not contain any employer source code, production IdP integration, or live user data.
