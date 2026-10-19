import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { identityPage } from '../pages/identity.page.js';

Given('I open the fictional Identity Desk', async () => {
  await identityPage.open();
});

When(/^I sign in as an "(analyst|admin)"$/, async (persona: 'analyst' | 'admin') => {
  await identityPage.loginAs(persona);
});

When('I verify the demonstration MFA code', async () => {
  await identityPage.completeMfa();
});

Then(/^I should see the "(analyst|admin)" role$/, async (role: string) => {
  await expect(identityPage.role).toHaveText(role);
});

Then('I should not see the provisioning controls', async () => {
  await expect(identityPage.provisioning).not.toBeDisplayed();
});

Then('I should see the provisioning controls', async () => {
  await expect(identityPage.provisioning).toBeDisplayed();
});

When(/^I provision "([^"]+)" as a "([^"]+)"$/, async (email: string, role: string) => {
  await identityPage.provision(email, role);
});

Then(/^I should see a confirmation for "([^"]+)"$/, async (email: string) => {
  await expect(identityPage.provisionStatus).toHaveText(expect.stringContaining(`Provisioned ${email}`));
});
