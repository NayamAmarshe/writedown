import PostRow from "./PostRow";
import React from "react";

describe("<PostRow />", () => {
  it("Renders", () => {
    cy.mount(
      <PostRow
        content="content"
        noteId="123123"
        title="Post Title"
        userId="23123"
      />
    );

    cy.contains("Post Title");
    cy.contains("content");
  });
});
