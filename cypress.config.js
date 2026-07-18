const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  requestTimeout: 5000,
  responseTimeout: 30000,
  
  viewportWidth: 1920,
  viewportHeight: 1080,
  
  watchForFileChanges: false,
  chromeWebSecurity: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  video: false,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: 'https://front.serverest.dev',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
