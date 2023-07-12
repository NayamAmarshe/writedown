import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";

export interface DetailsOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Details<ReturnType> {
    details: {
      /**
       * Set a code block
       */
      setDetails: (attributes?: { language: string }) => ReturnType;
      /**
       * Toggle a code block
       */
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType;
    };
  }
}

export const backtickInputRegex = /^==([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^===([a-z]+)?[\s\n]$/;

export const Details = Node.create<DetailsOptions>({
  name: "details",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "text*",

  group: "block",

  // addAttributes() {
  //   return {};
  // },

  parseHTML() {
    return [
      {
        tag: "details",
      },
    ];
  },

  addGlobalAttributes() {
    return [
      {
        types: ["details"],
        attributes: {
          open: {
            default: false,
            parseHTML: (element) => ({
              open: element.hasAttribute("open"),
            }),
            renderHTML: (attributes) => {
              if (attributes.open) {
                return {
                  open: false,
                };
              }
              return {};
            },
          },
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "details",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "details",
        "data-type": "details",
      }),
      [
        "button",
        {
          class: "details-button",
        },
      ],
      [
        "div",
        [
          "summary",
          {
            class: "details-summary",
          },
          "adsasdasd",
        ],
        ["div", { class: "details-content" }, 0],
      ],
    ];
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          language: match[1],
        }),
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("detailsButton"),
        props: {
          handleClick: (view, pos) => {
            // Find the node that was clicked based on the position
            const node = view.state.doc.nodeAt(pos);
            // Check if the node is a details node
            if (node?.type.name === "details") {
              console.log("node", node);
              // Toggle the open attribute
              const open = !node.attrs.open;
              // Create a transaction
              const transaction = view.state.tr;
              // Set the new open attribute
              transaction.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                open,
              });

              // Set the selection to the content of the details node
              transaction.setSelection(
                TextSelection.create(
                  transaction.doc,
                  pos + 1,
                  pos + 1 + node.content.size
                )
              );
              // Dispatch the transaction
              view.dispatch(transaction);
              // Return true to signal ProseMirror the click has been handled
              return true;
            }
            // Return false to signal ProseMirror the click has not been handled
            return false;
          },
        },
      }),
    ];
  },
});
