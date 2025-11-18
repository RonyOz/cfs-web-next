describe("UI generic tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("checks for existence of a navigation or main container", () => {
    cy.get("nav, main, div").should("exist");
  });

  it("checks for existence of footer", () => {
    cy.get("footer, div").should("exist");
  });

  it("checks there are clickable links", () => {
    cy.get("a").should("have.length.greaterThan", 0);
  });

  it("checks there are divs in page", () => {
    cy.get("div").should("have.length.greaterThan", 0);
  });

  it("checks no JS errors in console", () => {
    cy.window().then((win) => {
      const errors: any[] = [];
      cy.stub(win.console, "error").callsFake((msg) => errors.push(msg));
      cy.wrap(errors).should("have.length", 0);
    });
  });
});
