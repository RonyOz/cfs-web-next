import './commands';

// Ignore ResizeObserver errors that are harmless and come from third-party libs during tests
Cypress.on('uncaught:exception', (err) => {
  if (err.message?.includes('ResizeObserver')) {
    return false;
  }
});
