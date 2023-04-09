/// <reference types="cypress" />

describe("login checks", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("login check", () => {
    cy.location("pathname").should("eq", "/login");
    cy.findByTestId("google-login").click();
    cy.wait(20000);
    cy.location("pathname").should("eq", "/dashboard");
  });
});
