import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
  env: {
    baseUrl: process.env.CYPRESS_baseUrl,
    apiPath: '/api/v1/hedgehog/',
  },
  screenshotOnRunFailure: false,
  video: false,
})
