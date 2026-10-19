import { test, expect, type APIRequestContext } from '@playwright/test';

const password = 'SamplePass123!'; // Only for the local fictional test service.

async function login(request: APIRequestContext, email: 'analyst@demo.test' | 'admin@demo.test') {
  return request.post('/api/login', { data: { email, password } });
}

async function adminToken(request: APIRequestContext): Promise<string> {
  const loginResponse = await login(request, 'admin@demo.test');
  expect(loginResponse.ok()).toBeTruthy();
  const challenge = await loginResponse.json();
  expect(challenge.mfaRequired).toBe(true);

  const mfaResponse = await request.post('/api/mfa', {
    data: { challengeId: challenge.challengeId, code: '123456' }
  });
  expect(mfaResponse.status()).toBe(200);
  return (await mfaResponse.json()).token;
}

test.describe('Authentication and authorization API', () => {
  test('blocks invalid credentials without creating a session', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { email: 'analyst@demo.test', password: 'incorrect' }
    });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'Invalid credentials' });
  });

  test('returns 401 for missing bearer authorization', async ({ request }) => {
    const response = await request.get('/api/me');
    expect(response.status()).toBe(401);
  });

  test('prevents an analyst from accessing admin-only provisioning', async ({ request }) => {
    const response = await login(request, 'analyst@demo.test');
    expect(response.status()).toBe(200);
    const { token, role } = await response.json();
    expect(role).toBe('analyst');

    const denied = await request.post('/api/admin/provision', {
      headers: { Authorization: `Bearer ${token}` },
      data: { email: 'new.employee@demo.test', role: 'viewer' }
    });
    expect(denied.status()).toBe(403);
    expect(await denied.json()).toEqual({ error: 'Insufficient permissions' });
  });

  test('requires a valid MFA challenge for an admin', async ({ request }) => {
    const loginResponse = await login(request, 'admin@demo.test');
    const { challengeId, mfaRequired } = await loginResponse.json();
    expect(mfaRequired).toBe(true);
    const invalid = await request.post('/api/mfa', { data: { challengeId, code: '000000' } });
    expect(invalid.status()).toBe(401);
    const valid = await request.post('/api/mfa', { data: { challengeId, code: '123456' } });
    expect(valid.status()).toBe(200);
    const replay = await request.post('/api/mfa', { data: { challengeId, code: '123456' } });
    expect(replay.status()).toBe(401);
  });

  test('allows an admin to provision valid accounts and rotate demo credentials', async ({ request }) => {
    const token = await adminToken(request);
    const headers = { Authorization: `Bearer ${token}` };
    const response = await request.post('/api/admin/provision', {
      headers,
      data: { email: `sample-${Date.now()}@demo.test`, role: 'viewer' }
    });
    expect(response.status()).toBe(201);
    expect((await response.json()).user.status).toBe('active');

    const rotate = await request.post('/api/admin/rotate', { headers });
    expect(rotate.status()).toBe(200);
    const rotationResult = await rotate.json();
    expect(rotationResult.rotated).toBe(true);
    expect(typeof rotationResult.version).toBe('number');
    expect(rotationResult).not.toHaveProperty('secret');
  });

  test('revokes a token after logout', async ({ request }) => {
    const loginResponse = await login(request, 'analyst@demo.test');
    const { token } = await loginResponse.json();
    const headers = { Authorization: `Bearer ${token}` };
    expect((await request.get('/api/me', { headers })).status()).toBe(200);
    expect((await request.post('/api/logout', { headers })).status()).toBe(204);
    expect((await request.get('/api/me', { headers })).status()).toBe(401);
  });
});
