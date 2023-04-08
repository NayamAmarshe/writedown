/// <reference types="cypress" />

describe("login checks", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/dashboard");
    cy.get("div").should("have.class", "hydrated");
  });

  it("login check", () => {
    cy.location("pathname").should("eq", "/login");
    cy.get('button:contains("Sign in with Google")').click();
    cy.wait(20000);
  });
});
