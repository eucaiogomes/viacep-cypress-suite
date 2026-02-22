const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://viacep.com.br/ws',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      BASE_URL: 'https://viacep.com.br/ws'
    },
    video: false,
    screenshotOnRunFailure: true
  },
});
