import { defineConfig } from 'cypress';

const baseUrl = process.env.CYPRESS_BASE_URL || 'http://localhost:3010';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cfs-api.onrender.com/api/v1';
const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://cfs-api.onrender.com/graphql';

export default defineConfig({
  e2e: {
    baseUrl,
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx,js,jsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    env: {
      apiUrl,
      graphqlUrl,
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
