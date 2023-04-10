/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { history, historyKeymap } from "@milkdown/plugin-history";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import javascript from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import { math } from "@milkdown/plugin-math";
import { replaceAll } from "@milkdown/utils";
import python from "refractor/lang/python";
import { gfm } from "@milkdown/preset-gfm";
import React, { useEffect } from "react";
import shell from "refractor/lang/bash";
import java from "refractor/lang/java";
import rust from "refractor/lang/rust";
import yaml from "refractor/lang/yaml";
import json from "refractor/lang/json";
import css from "refractor/lang/css";
import jsx from "refractor/lang/jsx";
import tsx from "refractor/lang/tsx";
import cpp from "refractor/lang/cpp";
import toast from "react-hot-toast";
import "katex/dist/katex.min.css";
import c from "refractor/lang/c";
import { useAtom } from "jotai";

interface editorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  notes?: TNotesData[] | undefined;
}

const MilkdownEditor = ({ setInput, input, className, notes }: editorProps) => {
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

        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(css);
            refractor.register(javascript);
            refractor.register(typescript);
            refractor.register(jsx);
            refractor.register(tsx);
            refractor.register(c);
            refractor.register(cpp);
            refractor.register(java);
            refractor.register(python);
            refractor.register(rust);
            refractor.register(yaml);
            refractor.register(shell);
            refractor.register(json);
          },
        });

        ctx.set(historyKeymap.key, {
          // Remap to one shortcut.
          Undo: "Mod-z",
          // Remap to multiple shortcuts.
          Redo: ["Mod-y", "Shift-Mod-z"],
        });

        ctx.get(listenerCtx).markdownUpdated((_, markdown, prevMarkdown) => {
          if (markdown.includes("data:image") && prevMarkdown) {
            editor.get()?.action(replaceAll(prevMarkdown));
            toast.error(
              "Please paste a link to an image, pasting images from clipboard is not supported yet"
            );
          }

          if (markdown !== prevMarkdown) {
            setInput(markdown);
          }
        });
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(prism)
      .use(history)
      .use(math)
  );

  useEffect(() => {
    if (!notes || !selectedNoteId) {
      editor.get()?.action(replaceAll(""));

      return;
    }

    const currentNote = notes.find((note) => note.id === selectedNoteId);

    if (!currentNote) return;

    editor.get()?.action(replaceAll(currentNote.content));
  }, [selectedNoteId, notes]);

  return <Milkdown />;
};

export default MilkdownEditor;
