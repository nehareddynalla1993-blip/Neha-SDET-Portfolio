import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  maxInstances: 1,
  capabilities: [{ browserName: 'chrome', 'goog:chromeOptions': { args: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'] } }],
  logLevel: 'error',
  baseUrl: 'http://127.0.0.1:4173',
  waitforTimeout: 8000,
  connectionRetryTimeout: 30_000,
  connectionRetryCount: 1,
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: [],
    import: ['./step-definitions/**/*.ts'],
    timeout: 30_000,
    backtrace: false
  }
};
