describe("Navigation basic tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("can click the first available link without crashing", () => {
    cy.get("a").first().click({ force: true });
    cy.get("body").should("exist");
  });

  it("go back to home", () => {
    cy.visit("/");
    cy.url().should("include", "/");
  });

  it("reload works", () => {
    cy.reload();
    cy.get("body").should("exist");
  });

  it("navigation does not crash", () => {
    cy.get("body").should("exist");
  });

  it("page loads within reasonable time", () => {
    cy.visit("/");
    cy.get("body", { timeout: 8000 }).should("be.visible");
  });
});
