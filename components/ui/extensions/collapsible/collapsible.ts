import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { findBlockNodes } from "prosemirror-utils";
import { Extension } from "@tiptap/core";

export interface CollapsibleOptions {
  className: string;
  mode: "all" | "deepest" | "shallowest";
}

export const Collapsible = Extension.create<CollapsibleOptions>({
  name: "folding",

  addOptions() {
    return {
      className: "is-collapsed",
      mode: "deepest",
    };
  },

  addProseMirrorPlugins() {
    let loaded = false;

    return [
      new Plugin({
        key: new PluginKey("collapse"),
        view: (view) => {
          view.dispatch(view.state.tr.setMeta("folding", { loaded: true }));
          return {};
        },
        appendTransaction: (transactions, oldState, newState) => {
          if (loaded) return;
          if (
            !transactions.some((transaction) => transaction.getMeta("folding"))
          ) {
            return;
          }

          let modified = false;
          const tr = newState.tr;
          const blocks = findBlockNodes(newState.doc);

          for (const block of blocks) {
            if (block.node.type.name === "heading") {
              const persistKey = "heading";
              const persistedState = localStorage?.getItem(persistKey);

              if (persistedState === "collapsed") {
                tr.setNodeMarkup(block.pos, undefined, {
                  ...block.node.attrs,
                  collapsed: true,
                });
                modified = true;
              }
            }
          }

          loaded = true;
          return modified ? tr : null;
        },
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            const blocks = findBlockNodes(doc);

            let withinCollapsedHeading;

            for (const block of blocks) {
              if (block.node.type.name === "heading") {
                if (
                  !withinCollapsedHeading ||
                  block.node.attrs.level <= withinCollapsedHeading
                ) {
                  if (block.node.attrs.collapsed) {
                    if (!withinCollapsedHeading) {
                      withinCollapsedHeading = block.node.attrs.level;
                    }
                  } else {
                    withinCollapsedHeading = undefined;
                  }
                  continue;
                }
              }

              if (withinCollapsedHeading) {
                decorations.push(
                  Decoration.node(block.pos, block.pos + block.node.nodeSize, {
                    class: "folded-content",
                  })
                );
              }
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
