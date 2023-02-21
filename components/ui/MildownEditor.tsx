import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, editorViewOptionsCtx, rootCtx } from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import React from "react";

const MilkdownEditor: React.FC = () => {
  const editor = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class:
              "max-h-96 overflow-y-auto focus:outline-none w-full border-2 rounded-xl p-2 prose max-w-none border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 prose-sm md:prose-base lg:prose-lg ",
          },
        }));
        ctx.set(rootCtx, root);
      })
      .use(commonmark)
  );

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
};
