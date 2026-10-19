/**
 * FAKE IDENTITY SERVICE FOR PORTFOLIO TESTING.
 * Not intended for production: credentials, users, sessions and OTP are synthetic.
 * No third-party services or real personal information are used.
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const people = {
  'analyst@demo.test': { password: 'SamplePass123!', role: 'analyst' },
  'admin@demo.test': { password: 'SamplePass123!', role: 'admin' }
};

export function createDemoServer() {
  // State belongs to one server instance, so tests can isolate it by starting a fresh one.
  const sessions = new Map();
  const challenges = new Map();
  let sequence = 0;
  let rotation = 1;
  const provisioned = [];
  const result = (res, status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(body));
  };
  const parseJson = async req => {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 10000) throw new Error('Payload too large');
    }
    return raw ? JSON.parse(raw) : {};
  };
  const identity = req => {
    const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1];
    return token && sessions.get(token);
  };
  const requireUser = (req, res, role) => {
    const user = identity(req);
    if (!user) { result(res, 401, { error: 'Authentication required' }); return null; }
    if (role && user.role !== role) { result(res, 403, { error: 'Insufficient permissions' }); return null; }
    return user;
  };
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');
    const route = url.pathname;
    try {
      if (req.method === 'GET' && route === '/api/health') return result(res, 200, { status: 'ready', demo: true });
      if (req.method === 'POST' && route === '/api/login') {
        const { email, password } = await parseJson(req);
        const person = people[email];
        if (!person || person.password !== password) return result(res, 401, { error: 'Invalid credentials' });
        if (person.role === 'admin') {
          const challengeId = `challenge-${++sequence}`;
          challenges.set(challengeId, email);
          return result(res, 200, { mfaRequired: true, challengeId });
        }
        const token = `fake-session-${++sequence}`;
        sessions.set(token, { email, role: person.role });
        return result(res, 200, { mfaRequired: false, token, role: person.role });
      }
      if (req.method === 'POST' && route === '/api/mfa') {
        const { challengeId, code } = await parseJson(req);
        const email = challenges.get(challengeId);
        // A fixed OTP is ONLY appropriate for this synthetic demo.
        if (!email || code !== '123456') return result(res, 401, { error: 'Invalid MFA challenge' });
        challenges.delete(challengeId);
        const token = `fake-session-${++sequence}`;
        sessions.set(token, { email, role: people[email].role });
        return result(res, 200, { token, role: people[email].role });
      }
      if (req.method === 'GET' && route === '/api/me') {
        const user = requireUser(req, res); if (!user) return;
        return result(res, 200, { email: user.email, role: user.role });
      }
      if (req.method === 'GET' && route === '/api/admin/users') {
        const user = requireUser(req, res, 'admin'); if (!user) return;
        return result(res, 200, { users: provisioned });
      }
      if (req.method === 'POST' && route === '/api/admin/provision') {
        const user = requireUser(req, res, 'admin'); if (!user) return;
        const { email, role } = await parseJson(req);
        if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['analyst', 'viewer'].includes(role)) {
          return result(res, 400, { error: 'Valid email and supported role required' });
        }
        if (provisioned.some(item => item.email === email)) return result(res, 409, { error: 'Already provisioned' });
        const member = { email, role, status: 'active' };
        provisioned.push(member);
        return result(res, 201, { user: member });
      }
      if (req.method === 'POST' && route === '/api/admin/rotate') {
        const user = requireUser(req, res, 'admin'); if (!user) return;
        rotation++;
        // Model a successful rotation without displaying or persisting any secret.
        return result(res, 200, { rotated: true, version: rotation });
      }
      if (req.method === 'POST' && route === '/api/logout') {
        const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1];
        if (!token || !sessions.has(token)) return result(res, 401, { error: 'Authentication required' });
        sessions.delete(token);
        return result(res, 204, null);
      }
      if (req.method === 'GET' && (route === '/' || route === '/index.html')) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
        return res.end(await fs.readFile(path.join(here, 'index.html')));
      }
      return result(res, 404, { error: 'Not found' });
    } catch (err) {
      return result(res, err instanceof SyntaxError ? 400 : 413, { error: 'Invalid request body' });
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createDemoServer().listen(port, '127.0.0.1', () => {
    console.log(`Synthetic identity demo ready at http://127.0.0.1:${port}`);
  });
}
