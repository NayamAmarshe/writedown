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

  renderHTML({ node, HTMLAttributes }) {
    return [
      "details",
      {
        class: "details",
        "data-type": "details",
      },
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
          handleClick: (view, pos) => {},
        },
      }),
    ];
  },
});
