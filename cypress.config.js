const { defineConfig } = require("cypress");
const dotenv = require('dotenv').config()

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
    expose: {
      apiUrl: process.env.API_URL
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here

      config.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL
      config.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

      return config
    },
  },
});
