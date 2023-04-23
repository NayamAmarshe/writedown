/// <reference types="cypress" />

import TextArea from "./index";
import React from "react";

describe("<TextArea />", () => {
  afterEach(() => {
    cy.get(".ProseMirror").type("{selectall}{del}");
  });

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

  it("Adds Regular Text", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);
    cy.get(".ProseMirror").type("Plain text");
    cy.get(".ProseMirror > p").contains("Plain text");
    cy.get(".ProseMirror").type("{selectall}{del}");
  });

  it("Adds Bold Text", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);
    cy.get(".ProseMirror").type("Bold text{selectall}");
    cy.get(".ProseMirror").type("{ctrl}b");
    cy.get(".ProseMirror > p > strong").contains("Bold text");
    cy.get(".ProseMirror").type("{selectall}{del}");
  });

  it("Adds Italic Text", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);
    cy.get(".ProseMirror").type("Italic text{selectall}");
    cy.get(".ProseMirror").type("{ctrl}i");
    cy.get(".ProseMirror > p > em").contains("Italic text");
    cy.get(".ProseMirror").type("{selectall}{del}");
  });

  it("Adds code block and is able to delete it", () => {
    cy.mount(<TextArea shiftRight={false} setShiftRight={cy.stub()} />);

    cy.get(".ProseMirror").type("```{enter}Code Text{ctrl}{enter}");
    cy.get(".ProseMirror > pre > code").contains("Code Text");
    cy.get(".ProseMirror").type("{ctrl}{enter}{selectall}{del}");
    cy.get(".ProseMirror").type("{backspace}{backspace}");
    cy.get(".ProseMirror > p").should("have.value", "");
  });
});
