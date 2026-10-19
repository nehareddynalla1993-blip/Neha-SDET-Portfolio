import { test, expect } from '@playwright/test';

const pass = 'SamplePass123!'; // Synthetic demo credential.

test.describe('Identity Desk browser flows', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('analyst sees their role but cannot see provisioning controls', async ({ page }) => {
    await page.getByLabel('Email', { exact: true }).fill('analyst@demo.test');
    await page.getByLabel('Password').fill(pass);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.locator('#role')).toHaveText('analyst');
    await expect(page.locator('#admin-controls')).toBeHidden();
    await expect(page.locator('#access')).toContainText('restricted');
  });

  test('admin completes MFA and provisions a demo user', async ({ page }) => {
    await page.getByLabel('Email', { exact: true }).fill('admin@demo.test');
    await page.getByLabel('Password').fill(pass);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Verify MFA' })).toBeVisible();
    await page.getByLabel('One-time code').fill('123456');
    await page.getByRole('button', { name: 'Verify code' }).click();
    await expect(page.locator('#role')).toHaveText('admin');
    await expect(page.getByRole('heading', { name: 'User provisioning' })).toBeVisible();
    const email = `web-${Date.now()}@demo.test`;
    await page.getByLabel("New user's email").fill(email);
    await page.getByRole('button', { name: 'Provision user' }).click();
    await expect(page.locator('#provision-status')).toContainText(`Provisioned ${email}`);
  });

  test('invalid login does not open authenticated page', async ({ page }) => {
    await page.getByLabel('Email', { exact: true }).fill('analyst@demo.test');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.locator('#login-status')).toHaveText('Invalid credentials');
    await expect(page.locator('#home-panel')).toBeHidden();
  });
});
