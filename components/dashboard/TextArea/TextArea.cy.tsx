/// <reference types="cypress" />

import TextArea from "./index";
import React from "react";

describe("<TextArea />", () => {
  it("Renders", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);

    cy.contains("Delete Post");
    cy.contains("Saved");
  });

  it("Shows our typed title", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);

    cy.get("[data-testid='noteTitle']")
      .type("Hello World")
      .should("have.value", "Hello World");
  });

  it("Shows our typed body", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);

    // Type plain text
    cy.get(".ProseMirror").type("Plain text");
    cy.get(".ProseMirror > p").contains("Plain text");
    cy.get(".ProseMirror").type("{selectall}{del}");

    // Type bold text
    cy.get(".ProseMirror").type("Bold text{selectall}");
    cy.get(".ProseMirror").type("{ctrl}b");
    cy.get(".ProseMirror > p > strong").contains("Bold text");
    cy.get(".ProseMirror").type("{selectall}{del}");

    // Type italic text
    cy.get(".ProseMirror").type("Italic text{selectall}");
    cy.get(".ProseMirror").type("{ctrl}i");
    cy.get(".ProseMirror > p > em").contains("Italic text");
    cy.get(".ProseMirror").type("{selectall}{del}");

    // Type code text
    cy.get(".ProseMirror").type("```{enter}Code Text{ctrl}{enter}");
    cy.get(".ProseMirror > pre > code").contains("Code Text");
    cy.get(".ProseMirror").type("{ctrl}{enter}{selectall}{del}");
  });
});
