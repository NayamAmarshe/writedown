/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { commonmark } from "@milkdown/preset-commonmark";
import { clipboard } from "@milkdown/plugin-clipboard";
import { Milkdown, useEditor } from "@milkdown/react";
import { history } from "@milkdown/plugin-history";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/preset-gfm";
import "@milkdown/theme-nord/style.css";
import { useAtom } from "jotai";
import React from "react";

interface editorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  // clearSwitch: boolean;
  // setClearSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const MilkdownEditor = ({
  setInput,
  input,
  // clearSwitch,
  // setClearSwitch,
  className,
}: editorProps) => {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);

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
      .use(gfm)
  );

  // useEffect(() => {
  //   if (clearSwitch === false) {
  //     return;
  //   }

  //   editor.get()?.action(replaceAll(""));

  //   setClearSwitch(false);
  // }, [clearSwitch]);

  /* NOT SURE IF WE WANT THE TEXT FIELD TO RESET IF THE ACTIVE CHANNEL IS CHANGED
useEffect(() => {
    editor.get()?.action(replaceAll(""));
  }, [selectedChannelId]);
*/
  return <Milkdown />;
};

export default MilkdownEditor;
