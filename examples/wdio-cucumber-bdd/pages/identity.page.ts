/** Centralized selectors and user intent. UI changes should be localized here. */
class IdentityPage {
  get email() { return $('#email'); }
  get password() { return $('#password'); }
  get signIn() { return $('button[type="submit"]'); }
  get mfaPanel() { return $('#mfa-panel'); }
  get mfaCode() { return $('#mfa-code'); }
  get verifyCode() { return $('#mfa-form button[type="submit"]'); }
  get role() { return $('#role'); }
  get provisioning() { return $('#admin-controls'); }
  get newEmail() { return $('#new-email'); }
  get newRole() { return $('#new-role'); }
  get provisionButton() { return $('#provision-form button[type="submit"]'); }
  get provisionStatus() { return $('#provision-status'); }

  async open() { await browser.url('/'); }
  async loginAs(persona: 'analyst' | 'admin') {
    await this.email.setValue(`${persona}@demo.test`);
    await this.password.setValue('SamplePass123!'); // Only the fictional demo password.
    await this.signIn.click();
  }
  async completeMfa() {
    await this.mfaCode.waitForDisplayed();
    await this.mfaCode.setValue('123456'); // Synthetic demo OTP.
    await this.verifyCode.click();
  }
  async provision(email: string, role: string) {
    await this.newEmail.setValue(email);
    await this.newRole.selectByAttribute('value', role);
    await this.provisionButton.click();
  }
}
export const identityPage = new IdentityPage();
