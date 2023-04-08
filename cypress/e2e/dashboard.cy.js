//This code checks that the dashboard page is displayed with the correct elements.
//It also checks that the textarea elements are working as expected.
//The test checks that the "Untitled" text is present in the noteTitle element, then types "This is a test" into the element.
//It then checks that the element has the value "UntitledThis is a test".

/// <reference types="cypress" />

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sollicitudin ac orci phasellus egestas tellus rutrum tellus. Neque volutpat ac tincidunt vitae semper quis. Fames ac turpis egestas maecenas. Eu non diam phasellus vestibulum lorem sed risus. Neque convallis a cras semper auctor neque vitae tempus. Vel elit scelerisque mauris pellentesque. Neque viverra justo nec ultrices dui sapien eget mi. Ante metus dictum at tempor commodo ullamcorper. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. A erat nam at lectus. Nec nam aliquam sem et tortor  consequat id porta. Amet consectetur adipiscing elit duis. Sit amet est placerat in egestas. Diam ut venenatis tellus in metus vulputate eu scelerisque. Tristique senectus et netus et malesuada fames ac.";

describe("Dashboard checks", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/dashboard");
  });

  it("Checks the TextArea element", () => {
    cy.get(".editor").should("have.value", "").type("lorem");
    cy.get("#save").click();
    cy.get(".editor").should("have.text", "lorem");
    cy.get("#del").click();
  });

  it("Checks the sidebar toggle", () => {
    cy.get("#sidebarToggle").click().click();
  });

  it("Checks creating a new note", () => {
    cy.get('button:contains("Create New Post")').click();
    cy.get("#noteTitle")
      .should("have.value", "Untitled")
      .type("This is a test")
      .should("have.value", "UntitledThis is a test");
    cy.get(".milkdown").should("have.value", "").type(lorem);
    cy.get("#save").click();
    cy.get("#del").click();
  });
});
