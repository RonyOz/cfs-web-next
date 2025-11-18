declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Helper to select elements via data-cy attribute.
       */
      dataCy(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('dataCy', (selector: string) => {
  return cy.get(`[data-cy="${selector}"]`);
});

export {};
