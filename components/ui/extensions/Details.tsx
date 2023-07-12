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
        open,
      },
      [
        "button",
        {
          class: "details-button",
        },
      ],
      ["div", ["summary"], ["div", { class: "details-content" }, 0]],
    ];
  },
  addCommands() {
    return {
      toggleDetails:
        (attributes) =>
        ({ commands }) => {
          console.log("hello");
          return commands.toggleNode(this.name, "paragraph", attributes);
        },
    };
  },

  // addKeyboardShortcuts() {
  //   return {
  //     "Mod-Alt-c": () => this.editor.commands.toggleDetails(),

  //     // remove code block when at start of document or code block is empty
  //     Backspace: () => {
  //       const { empty, $anchor } = this.editor.state.selection;
  //       const isAtStart = $anchor.pos === 1;

  //       if (!empty || $anchor.parent.type.name !== this.name) {
  //         return false;
  //       }

  //       if (isAtStart || !$anchor.parent.textContent.length) {
  //         return this.editor.commands.clearNodes();
  //       }

  //       return false;
  //     },

  //     // exit node on triple enter
  //     Enter: ({ editor }) => {
  //       if (!this.options.exitOnTripleEnter) {
  //         return false;
  //       }

  //       const { state } = editor;
  //       const { selection } = state;
  //       const { $from, empty } = selection;

  //       if (!empty || $from.parent.type !== this.type) {
  //         return false;
  //       }

  //       const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
  //       const endsWithDoubleNewline = $from.parent.textContent.endsWith("\n\n");

  //       if (!isAtEnd || !endsWithDoubleNewline) {
  //         return false;
  //       }

  //       return editor
  //         .chain()
  //         .command(({ tr }) => {
  //           tr.delete($from.pos - 2, $from.pos);

  //           return true;
  //         })
  //         .exitCode()
  //         .run();
  //     },

  //     // exit node on arrow down
  //     ArrowDown: ({ editor }) => {
  //       if (!this.options.exitOnArrowDown) {
  //         return false;
  //       }

  //       const { state } = editor;
  //       const { selection, doc } = state;
  //       const { $from, empty } = selection;

  //       if (!empty || $from.parent.type !== this.type) {
  //         return false;
  //       }

  //       const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;

  //       if (!isAtEnd) {
  //         return false;
  //       }

  //       const after = $from.after();

  //       if (after === undefined) {
  //         return false;
  //       }

  //       const nodeAfter = doc.nodeAt(after);

  //       if (nodeAfter) {
  //         return false;
  //       }

  //       return editor.commands.exitCode();
  //     },
  //   };
  // },

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

  onToggle: (props) => {
    console.log("onToggle", props);
  },

  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new Plugin({
        key: new PluginKey("detailsButton"),
        props: {
          handleClick: (view, pos) => {
            console.log("handleClick", pos);
            const { dispatch, state } = view;
            const { $from } = state.selection;
            const node = $from.node($from.depth);
            console.log("🚀 => file: Details.tsx:195 => node:", node);
            // update the node attributes
            const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
              open: !node.attrs.open,
            });
            dispatch(transaction);
            return true;
          },
        },
      }),
    ];
  },
});
