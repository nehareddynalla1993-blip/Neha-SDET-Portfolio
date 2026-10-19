# Fictional Identity Desk

A tiny, local-only identity and access management application used by the portfolio's automation examples. Built with the **Node.js standard library** and accessible HTML.

```bash
node demo-app/server.mjs
# Visit http://127.0.0.1:4173
```

Synthetic personas (not real accounts):

| User | Password | Role | MFA |
|---|---|---|---|
| `analyst@demo.test` | `SamplePass123!` | analyst | no |
| `admin@demo.test` | `SamplePass123!` | admin | yes, fixed code `123456` |

Endpoints: `/api/health`, `/api/login`, `/api/mfa`, `/api/me`, `/api/admin/users`, `/api/admin/provision`, `/api/admin/rotate`, and `/api/logout`.

**Security note:** Intentionally simplified. In-memory fake tokens, cleartext test passwords, static MFA codes and demo session handling are **not suitable for production use**. They exist only to make the test scenarios repeatable and safe. No real Okta integration, customer data, secrets, or client source is included.
