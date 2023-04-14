/// <reference types="cypress" />

// this code will check if the logout button is working
// it will visit the dashboard page and then click the logout button
// and then it will check if it is redirected to the login page and if the google button is visible

describe("logout checks", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/dashboard");
  });

  it("Logout check", () => {
    cy.findByTestId("logout").click();
    cy.location("pathname").should("eq", "/login");
    cy.findByTestId("google-login");
  });
});
