//This code checks that the dashboard page is displayed with the correct elements.
//It also checks that the textarea elements are working as expected.
//The test checks that the "Untitled" text is present in the noteTitle element, then types "This is a test" into the element.
//It then checks that the element has the value "UntitledThis is a test".

/// <reference types="cypress" />

describe("dashboard checks", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/dashboard");
    cy.get("div").should("have.class", "hydrated");
  });

  it("sidebar toggle check", () => {
    cy.get("#sidebarToggle").click();
    cy.get("#sidebarToggle").click();
  });

  it("TextArea check", () => {
    cy.get("#noteTitle")
      .should("have.value", "Untitled")
      .type("This is a test")
      .should("have.value", "UntitledThis is a test");
    cy.get("#save").click();
    cy.get("#del").click();
  });

  it("New note check", () => {
    cy.get('button:contains("Create New Post")').click();
    cy.get("#noteTitle")
      .should("have.value", "Untitled")
      .type("This is a test")
      .should("have.value", "UntitledThis is a test");
    cy.get("#save").click();
    cy.get("#del").click();
  });
});
