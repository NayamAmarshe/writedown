import PostRow from "./PostRow";
import React from "react";

describe("<PostRow />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PostRow />);
  });
});
