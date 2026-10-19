import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoServer } from '../server.mjs';

const openServer = async () => {
  const server = createDemoServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
};

async function send(origin, endpoint, options={}) {
  const res = await fetch(`${origin}${endpoint}`, { ...options, headers: { 'Content-Type':'application/json', ...options.headers } });
  return { status: res.status, body: res.status === 204 ? null : await res.json() };
}

test('fake identity workflow: MFA, permissions, provisioning and session revocation', async t => {
  const { server, origin } = await openServer();
  t.after(() => new Promise(resolve => server.close(resolve)));
  const health = await send(origin, '/api/health');
  assert.equal(health.status, 200);

  const wrong = await send(origin, '/api/login', { method: 'POST', body: JSON.stringify({ email: 'analyst@demo.test', password: 'wrong' }) });
  assert.equal(wrong.status, 401);

  const analyst = await send(origin, '/api/login', { method: 'POST', body: JSON.stringify({ email: 'analyst@demo.test', password: 'SamplePass123!' }) });
  assert.equal(analyst.status, 200);
  assert.equal(analyst.body.role, 'analyst');
  const deny = await send(origin, '/api/admin/provision', { method: 'POST', headers: { Authorization: `Bearer ${analyst.body.token}` }, body: JSON.stringify({ email: 'demo.user@example.test', role: 'viewer' }) });
  assert.equal(deny.status, 403);

  const admin = await send(origin, '/api/login', { method: 'POST', body: JSON.stringify({ email: 'admin@demo.test', password: 'SamplePass123!' }) });
  assert.equal(admin.body.mfaRequired, true);
  const badOtp = await send(origin, '/api/mfa', { method: 'POST', body: JSON.stringify({ challengeId: admin.body.challengeId, code: '000000' }) });
  assert.equal(badOtp.status, 401);
  const otp = await send(origin, '/api/mfa', { method: 'POST', body: JSON.stringify({ challengeId: admin.body.challengeId, code: '123456' }) });
  assert.equal(otp.status, 200);
  const auth = { Authorization: `Bearer ${otp.body.token}` };
  const granted = await send(origin, '/api/admin/provision', { method: 'POST', headers: auth, body: JSON.stringify({ email: 'demo.user@example.test', role: 'viewer' }) });
  assert.equal(granted.status, 201);
  const rotated = await send(origin, '/api/admin/rotate', { method: 'POST', headers: auth });
  assert.equal(rotated.body.rotated, true);
  assert.equal('secret' in rotated.body, false);
  const ended = await send(origin, '/api/logout', { method: 'POST', headers: auth });
  assert.equal(ended.status, 204);
  const revoked = await send(origin, '/api/me', { headers: auth });
  assert.equal(revoked.status, 401);
});
