describe("Smoke test", () => {
  it("loads the home page", () => {
    cy.visit("/");
    cy.get("body").should("be.visible"); // pasa siempre
  });
});
