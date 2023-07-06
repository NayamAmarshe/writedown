import CodeBlockLowLight from "@tiptap/extension-code-block-lowlight";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useEditor, EditorContent } from "@tiptap/react";
import { Note } from "@/types/utils/firebaseOperations";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Code from "@tiptap/extension-code";
import { useAtomValue } from "jotai";
import { lowlight } from "lowlight";
import { useEffect } from "react";

interface editorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  notes?: Note[] | undefined;
}

const TiptapEditor = ({ setInput, input, className, notes }: editorProps) => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: className || "",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "dark:text-slate-100 leading-none",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "dark:text-slate-100 text-base leading-none",
          },
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class:
            "text-white bg-slate-700 dark:bg-slate-950 p-1 rounded text-base",
        },
      }),
      CodeBlockLowLight.configure({
        lowlight,
        HTMLAttributes: {
          languageClassPrefix: "language-",
          class: "text-white bg-slate-700 dark:bg-slate-950 text-base",
        },
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: "tight",
        bulletListMarker: "-",
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: input,
    onUpdate: ({ editor }) => {
      if (editor) {
        setInput(editor.storage.markdown.getMarkdown());
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    // If there are no notes or no selected note, clear the editor
    if (!notes || !selectedNoteId) {
      editor.commands.clearContent();

      return;
    }

    // Replace the editor content with the current note content
    const currentNote = notes.find((note) => note.id === selectedNoteId);
    if (!currentNote) return;

    editor.commands.setContent(currentNote.content);
  }, [selectedNoteId, notes]);

  return (
    <div className="">
      <EditorContent selected editor={editor} />
    </div>
  );
};

export default TiptapEditor;
