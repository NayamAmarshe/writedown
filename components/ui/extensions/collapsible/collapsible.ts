import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";

export interface CollapsibleOptions {
  className: string;
  mode: "all" | "deepest" | "shallowest";
}

export const Collapsible = Extension.create<CollapsibleOptions>({
  name: "collapse",

  addOptions() {
    return {
      className: "is-collapsed",
      mode: "deepest",
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("collapse"),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor;
            const { anchor } = selection;

            const decorations: Decoration[] = [];

            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, []);
            }

            doc.descendants((node, pos) => {
              // Check if node is heading
              const headingSchema = this.editor.schema.nodes.heading;
              const isHeading = headingSchema === node.type;
              if (!isHeading) {
                return;
              }
              // Find heading level
              const currentLevel = node.attrs.level;

              // Check the next node with the same level
              let nextNode: Node | null = node;

              let nextPos = pos;
              while (nextNode && nextNode.attrs.level >= currentLevel) {
                nextPos += nextNode.nodeSize;
                if (nextPos >= doc.content.size) {
                  break;
                }
                const newNode = doc.nodeAt(nextPos);
                if (newNode && newNode.type === headingSchema) {
                  nextNode = newNode;
                }
              }

              if (!nextNode) {
                return true;
              }
              console.log(
                "🚀 => file: collapsible.ts:48 => nextNode:",
                nextNode
              );

              const isCurrent =
                anchor >= pos && anchor <= nextPos + nextNode.nodeSize - 1;

              if (!isCurrent) {
                return false;
              }

              decorations.push(
                Decoration.node(pos, nextPos + node.nodeSize, {
                  class: this.options.className,
                })
              );
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
