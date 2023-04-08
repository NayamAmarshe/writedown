import TextArea from "./index";
import React from "react";

describe("<TextArea />", () => {
  it("Renders", () => {
    cy.mount(
      <TextArea
        user={null}
        shiftRight={false}
        setShiftRight={() => {
          console.log("hello");
        }}
      />
    );

    cy.contains("Delete Post");
    cy.contains("Saved");
  });
});
