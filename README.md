# Neha R. — SDET & QA Automation Portfolio

[![Quality](https://img.shields.io/badge/Focus-Quality%20Engineering-43d8a8)](#projects) [![Playwright](https://img.shields.io/badge/Playwright-TypeScript-5fe5c0)](examples/playwright-identity-workflows/) [![BDD](https://img.shields.io/badge/BDD-WebdriverIO-aaa1ff)](examples/wdio-cucumber-bdd/)

**Senior SDET / QA Automation Lead** with **10+ years** in test automation and quality engineering across enterprise banking and healthcare applications.

**Highlights:** WebdriverIO · TypeScript · Selenium · Playwright · Cucumber BDD · API testing · Postman · Karate · Jenkins · GitHub · security-conscious test design · CI/CD.

This repository contains a recruiter-friendly **portfolio website** and two fictional, original automation examples. Its content is designed to demonstrate engineering style and test design without revealing proprietary client implementation details.

## Projects

| Project | Technologies | What a reviewer can see |
|---|---|---|
| [Identity & Access Testing Lab](examples/playwright-identity-workflows/) | Playwright, TypeScript, REST APIs | MFA, RBAC `403`/`401`, provisioning, token revocation, UI checks |
| [Reusable BDD Test Framework](examples/wdio-cucumber-bdd/) | WebdriverIO, Cucumber, TypeScript, Page Objects | Gherkin scenarios, reusable locators, role-based UI expectations |

Both examples use the same [fictional demo Identity Desk](demo-app/), which has **synthetic users only**. A CI workflow runs basic Node smoke checks and Playwright checks. The WebdriverIO example is also provided with local run instructions.

## Preview the portfolio

Open [`index.html`](index.html) in a browser. The portfolio is a static webpage built with HTML, CSS and JavaScript; it works without a build step.

## How to publish

Follow **[PUBLISHING.md](PUBLISHING.md)**. It covers creating your first GitHub repository, uploading this project, enabling GitHub Pages, and personalizing GitHub / LinkedIn / email links.

Once published using the recommended repository name, your public links will follow these formats:

- GitHub: `https://github.com/YOUR_GITHUB_USERNAME/neha-sdet-portfolio`
- Portfolio: `https://YOUR_GITHUB_USERNAME.github.io/neha-sdet-portfolio/`

## Verify the example application

Requirements: Node.js 20+.

```bash
node --test demo-app/tests/*.test.mjs
node demo-app/server.mjs
# Open http://127.0.0.1:4173
```

To run the browser automation, see each project's README for installation and run commands.

## Recruiter note

The portfolio intentionally showcases **original demonstration code**, not code copied from current or former employers. Prior team accomplishments, employer/client work, certifications, and production integrations should be verified separately rather than inferred from the sample project.

## Public profile customization

Edit `PUBLIC_PROFILE` near the bottom of `index.html` after publication: fill in your GitHub username, LinkedIn profile URL and preferred public-facing email address. The email can be left blank if you don't want to publish it online.
