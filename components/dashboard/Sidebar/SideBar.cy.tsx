import Sidebar from "./index";
import React from "react";

describe("<Sidebar />", () => {
  it("Renders", () => {
    cy.mount(<Sidebar showSidebar={true} setShowSidebar={cy.stub()} />);

    cy.contains("Posts");
  });
});
