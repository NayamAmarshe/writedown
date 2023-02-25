/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { IChannelData } from "@/types/utils/firebaseOperations";
import { commonmark } from "@milkdown/preset-commonmark";
import { clipboard } from "@milkdown/plugin-clipboard";
import { Milkdown, useEditor } from "@milkdown/react";
import { history } from "@milkdown/plugin-history";
import { replaceAll } from "@milkdown/utils";
import { nord } from "@milkdown/theme-nord";
import React, { useEffect } from "react";
import "@milkdown/theme-nord/style.css";
interface editorProps {
  channelData?: IChannelData;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  clearSwitch: boolean;
  setClearSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const MilkdownEditor = ({
  setInput,
  input,
  clearSwitch,
  setClearSwitch,
  className,
}: editorProps) => {
  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, input);
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class: className ? className : "",
          },
        }));
        ctx.get(listenerCtx).markdownUpdated((_, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            setInput(markdown);
          }
        });
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .use(history)
      .use(clipboard)
  );

  useEffect(() => {
    if (clearSwitch === false) {
      return;
    }

    editor.get()?.action(replaceAll(""));

    setClearSwitch(false);
  }, [clearSwitch]);

  return <Milkdown />;
};

export default MilkdownEditor;
