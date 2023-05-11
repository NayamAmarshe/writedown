/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import {
  usePluginViewFactory,
  useWidgetViewFactory,
} from "@prosemirror-adapter/react";
import { linkPlugin } from "@/components/dashboard/TextArea/LinkWidget";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { history, historyKeymap } from "@milkdown/plugin-history";
import { EditorState, Transaction } from "@milkdown/prose/state";
import { $shortcut, Keymap, replaceAll } from "@milkdown/utils";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import { commonmark } from "@milkdown/preset-commonmark";
import { TooltipView, tooltip } from "./plugins/Tooltip";
import { Milkdown, useEditor } from "@milkdown/react";
import { trailing } from "@milkdown/plugin-trailing";
import javascript from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import { math } from "@milkdown/plugin-math";
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

  const pluginViewFactory = usePluginViewFactory();
  const widgetViewFactory = useWidgetViewFactory();

  const codeBlockDeleteHandler = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void
  ): boolean => {
    const { selection } = state;
    const { $from } = selection;

    if (
      !dispatch ||
      $from.pos !== 1 ||
      !$from.doc.content.firstChild ||
      $from.doc.content.firstChild?.content.size > 1 ||
      $from.doc.content.firstChild?.type.name !== "code_block"
    ) {
      return false;
    }

    const start = $from.start($from.depth);
    const end = $from.end($from.depth);

    const tr = state.tr.delete(start - 1, end);
    dispatch(tr);
    return true;
  };

  const codeBlockKeymap = $shortcut((): Keymap => {
    return {
      Backspace: (state, dispatch) => {
        return codeBlockDeleteHandler(state, dispatch);
      },
      Delete: (state, dispatch) => {
        return codeBlockDeleteHandler(state, dispatch);
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

        ctx.set(tooltip.key, {
          view: pluginViewFactory({
            component: TooltipView,
          }),
        });

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
      .use(linkPlugin(widgetViewFactory))
      .use(gfm) // GFM for GitHub Flavored Markdown
      .use(prism) // Prism for code highlighting
      .use(history) // History for undo/redo
      .use(math) // Math for math typesetting
      .use(codeBlockKeymap)
      .use(trailing)
      .use(tooltip)
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
