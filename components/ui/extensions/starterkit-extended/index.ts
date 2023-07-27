import Heading from "@tiptap/extension-heading";

export const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      heading: {
        collapsed: undefined,
      },
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      collapsed: {
        default: undefined,
        parseHTML: (element) => {
          return {
            collapsed: element.getAttribute("data-collapsed"),
          };
        },
        renderHTML: (attributes) => {
          return {
            "data-collapsed": attributes.collapsed,
          };
        },
      },
    };
  },
  extendNodeSchema: (node) => {
    if (!this) return;

    const anchor = document.createElement("button");
    anchor.innerText = "#";
    anchor.type = "button";
    anchor.className = "heading-anchor";
    anchor.contentEditable = "false";
    // anchor.addEventListener("click", (event) => this.handleCopyLink(event));

    const fold = document.createElement("button");
    fold.innerText = "";
    fold.innerHTML =
      '<svg fill="currentColor" width="12" height="24" viewBox="6 0 12 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.23823905,10.6097108 L11.207376,14.4695888 L11.207376,14.4695888 C11.54411,14.907343 12.1719566,14.989236 12.6097108,14.652502 C12.6783439,14.5997073 12.7398293,14.538222 12.792624,14.4695888 L15.761761,10.6097108 L15.761761,10.6097108 C16.0984949,10.1719566 16.0166019,9.54410997 15.5788477,9.20737601 C15.4040391,9.07290785 15.1896811,9 14.969137,9 L9.03086304,9 L9.03086304,9 C8.47857829,9 8.03086304,9.44771525 8.03086304,10 C8.03086304,10.2205442 8.10377089,10.4349022 8.23823905,10.6097108 Z" /></svg>';
    fold.type = "button";
    fold.className = `heading-fold ${node.attrs.collapsed ? "collapsed" : ""}`;
    fold.contentEditable = "false";
    fold.addEventListener("click", (event) => this.handleFoldContent(event));

    return [
      `h${node.attrs.level + (this.options.offset || 0)}`,
      [
        "span",
        {
          class: `heading-actions ${node.attrs.collapsed ? "collapsed" : ""}`,
        },
        anchor,
        fold,
      ],
      [
        "span",
        {
          class: "heading-content",
        },
        0,
      ],
    ];
  },
});

const handleFoldContent = (event: any) => {
  event.preventDefault();

  const { view } = this.editor;
  const { tr } = view.state;
  const { top, left } = event.target.getBoundingClientRect();
  const result = view.posAtCoords({ top, left });

  if (result) {
    const node = view.state.doc.nodeAt(result.inside);

    if (node) {
      const collapsed = !node.attrs.collapsed;
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        ...node.attrs,
        collapsed,
      });

      const persistKey = headingToPersistenceKey(node, this.editor.props.id);

      if (collapsed) {
        localStorage?.setItem(persistKey, "collapsed");
      } else {
        localStorage?.removeItem(persistKey);
      }

      view.dispatch(transaction);
    }
  }
};
