import Heading from "@tiptap/extension-heading";
import { EditorView } from "@tiptap/pm/view";
import { Plugin } from "@tiptap/pm/state";
import { Schema } from "@tiptap/pm/model";

export const CustomHeading = Heading.extend({
  extendMarkSchema(extension) {
    return {
      ...this.parent?.(extension),
      collapsed: {},
    };
  },
  addOptions() {
    return {
      ...this.parent?.(),
      collapsed: false,
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      collapsed: {
        default: false,
        rendered: false,
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "h" + node.attrs.level,
      [
        "button",
        {
          "data-collapsed": node.attrs.collapsed ? "collapsed" : "uncollapsed",
        },
      ],
      [
        "span",
        {
          "data-collapsed": node.attrs.collapsed ? "collapsed" : "uncollapsed",
        },
        ,
        0,
      ],
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            // Check if the click was on the button
            if (event.target instanceof HTMLButtonElement) {
              toggleCollapse(
                view,
                pos,
                view.state.doc.nodeAt(pos)?.attrs.level
              );
              return true;
            }
          },
        },
      }),
    ];
  },
});

function toggleCollapse(view: EditorView, pos: number, level: number) {
  const { state, dispatch } = view;
  const { doc } = state;
  if (!doc || !state) return;

  // Find the position of the next heading of the same level
  let nextPos = pos + 1;
  while (
    nextPos < doc.content.size &&
    doc.nodeAt(nextPos)?.attrs.level > level
  ) {
    nextPos++;
  }

  const isOpen = doc.rangeHasMark(
    pos,
    nextPos,
    state.schema.marks.collapsedHeading
  );

  if (isOpen) {
    // Remove collapsedHeading mark to make content visible
    dispatch(
      view.state.tr.removeMark(
        pos,
        nextPos,
        state.schema.marks.collapsedHeading
      )
    );
  } else {
    // Add collapsedHeading mark to make content collapsible
    dispatch(
      view.state.tr.addMark(
        pos,
        nextPos,
        state.schema.marks.collapsedHeading.create()
      )
    );
  }
}
