/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { commonmark } from "@milkdown/preset-commonmark";
import { clipboard } from "@milkdown/plugin-clipboard";
import { Milkdown, useEditor } from "@milkdown/react";
import { history } from "@milkdown/plugin-history";
import { replaceAll } from "@milkdown/utils";
import { gfm } from "@milkdown/preset-gfm";
import React, { useEffect } from "react";
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
        ctx.get(listenerCtx).markdownUpdated((_, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            setInput(markdown);
          }
        });
      })
      .use(listener)
      .use(commonmark)
      .use(history)
      .use(clipboard)
      .use(gfm)
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
