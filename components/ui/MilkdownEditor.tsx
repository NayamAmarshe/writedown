import {
  defaultValueCtx,
  Editor,
  editorCtx,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { Milkdown, useEditor, MilkdownProvider } from "@milkdown/react";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { IChannelData } from "@/types/utils/firebaseOperations";
import React, { useEffect, useRef, useState } from "react";
import { commonmark } from "@milkdown/preset-commonmark";
import { getHTML, insert } from "@milkdown/utils";
import { nord } from "@milkdown/theme-nord";

interface editorProps {
  channelData?: IChannelData;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  clearSwitch?: boolean;
  setClearSwitch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MilkdownEditor = ({
  setInput,
  input,
  clearSwitch,
  setClearSwitch,
}: editorProps) => {
  const editorInstance = useRef<Editor>();

  useEditor((root) =>
    Editor.make()

      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class:
              "max-h-96 overflow-y-auto focus:outline-none w-96 border-2 rounded-xl p-2 prose max-w-none border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 prose-sm md:prose-base lg:prose-lg ",
          },
        }));
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, input);
        ctx.get(listenerCtx).mounted((ctx) => {
          editorInstance.current = ctx.get(editorCtx);
          const listener = ctx.get(listenerCtx);

          listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
            if (markdown !== prevMarkdown) {
              setInput(ctx.get(editorCtx).action(getHTML()));
            }
          });
        });
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
  );

  useEffect(() => {
    if (!setClearSwitch || !clearSwitch) return;
    editorInstance.current?.action(insert(""));
    setClearSwitch(false);
  }, [clearSwitch]);
  return <Milkdown />;
};

export default MilkdownEditor;
