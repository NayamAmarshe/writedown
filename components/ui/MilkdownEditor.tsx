/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
  editorViewCtx,
  editorState,
} from "@milkdown/core";
import { $shortcut, Keymap, getMarkdown, replaceAll } from "@milkdown/utils";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { history, historyKeymap } from "@milkdown/plugin-history";
import { EditorState, Transaction } from "@milkdown/prose/state";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import { ResolvedPos, Slice } from "@milkdown/prose/model";
import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import javascript from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import { EditorView } from "@milkdown/prose/view";
import { math } from "@milkdown/plugin-math";
import { keymap } from "prosemirror-keymap";
import { Command } from "prosemirror-state";
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
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import "katex/dist/katex.min.css";
import c from "refractor/lang/c";

interface editorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  notes?: TNotesData[] | undefined;
}

const MilkdownEditor = ({ setInput, input, className, notes }: editorProps) => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);

  const codeBlockDeleteHandler = (state: EditorState): boolean => {
    const { selection } = state;
    const { $from } = selection;

    if (
      !($from as any)["path"][3] ||
      ($from as any)["path"][3].type.name !== "code_block" ||
      $from.pos !== 1
    ) {
      return false;
    }

    if (
      ($from as any)["path"][3].content.size === 0 ||
      ($from as any)["path"][3].content.content.text === 0
    ) {
      const currentMarkdown = editor.get()?.action(getMarkdown());

      if (!currentMarkdown) {
        return false;
      }

      const toReplace = currentMarkdown?.replace(
        currentMarkdown?.slice(
          state.selection.$from.pos - 1,
          state.selection.$from.pos + 6
        ),
        ""
      );
      editor.get()?.action(replaceAll(toReplace as string));
      return true;
    }

    return false;
  };

  const codeBlockKeymap = $shortcut((ctx): Keymap => {
    return {
      Backspace: (state) => {
        return codeBlockDeleteHandler(state);
      },
      Delete: (state) => {
        return codeBlockDeleteHandler(state);
      },
    };
  });

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);

        // Default value
        ctx.set(defaultValueCtx, input);

        // Editor View config
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class: className ? className : "",
          },
        }));

        // Prism plugin config
        ctx.set(prismConfig.key, {
          // Register languages
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
          // If the user pastes an image, we don't want to save it to the database
          if (markdown.includes("data:image") && prevMarkdown) {
            editor.get()?.action(replaceAll(prevMarkdown));
            toast.error(
              "Please paste a link to an image, pasting images from clipboard is not supported yet"
            );
          }

          // If the current markdown is different from the previous markdown, update the input
          if (markdown !== prevMarkdown) {
            setInput(markdown);
          }
        });
      })
      .use(listener) // Listener for listening to events
      .use(commonmark) // Commonmark is the default preset
      .use(gfm) // GFM for GitHub Flavored Markdown
      .use(prism) // Prism for code highlighting
      .use(history) // History for undo/redo
      .use(math) // Math for math typesetting
      .use(codeBlockKeymap)
  );

  useEffect(() => {
    // If there are no notes or no selected note, clear the editor
    if (!notes || !selectedNoteId) {
      editor.get()?.action(replaceAll(""));

      return;
    }

    // Replace the editor content with the current note content
    const currentNote = notes.find((note) => note.id === selectedNoteId);
    if (!currentNote) return;
    editor.get()?.action(replaceAll(currentNote.content));
  }, [selectedNoteId, notes]);

  return <Milkdown />;
};

export default MilkdownEditor;
