import { selectedNoteAtom } from "@/lib/atoms/post-data-atom";
import { NoteDocument } from "@/types/utils/firebaseOperations";
import { EditorContent, Editor } from "@tiptap/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

interface editorProps {
  notes?: NoteDocument[] | undefined;
  editor: Editor | null;
}

const WritedownEditor = ({ notes, editor }: editorProps) => {
  const selectedNote = useAtomValue(selectedNoteAtom);

  useEffect(() => {
    if (!editor) return;
    // If there are no notes or no selected note, clear the editor
    if (!notes || !selectedNote.id) {
      editor.commands.clearContent();

      return;
    }
    // Replace the editor content with the current note content
    const currentNote = notes.find((note) => note.id === selectedNote.id);
    if (!currentNote) return;
    editor.commands.setContent(currentNote.content);
  }, [selectedNote.id, notes]);

  return <EditorContent selected editor={editor} />;
};

export default WritedownEditor;
