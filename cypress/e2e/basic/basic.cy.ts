describe("Basic passing tests", () => {
  it("checks the page title exists", () => {
    cy.visit("/");
    cy.title().should("exist");
  });

  it("body is visible", () => {
    cy.visit("/");
    cy.get("body").should("be.visible");
  });

  it("has at least one element in DOM", () => {
    cy.visit("/");
    cy.get("*").should("have.length.greaterThan", 0);
  });

  it("URL includes localhost", () => {
    cy.visit("/");
    cy.url().should("include", "localhost");
  });

  it("viewport loads correctly", () => {
    cy.viewport(1280, 800);
    cy.visit("/");
    cy.get("html").should("be.visible");
  });
});
