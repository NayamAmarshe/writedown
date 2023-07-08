import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { Note } from "@/types/utils/firebaseOperations";
import { EditorContent, Editor } from "@tiptap/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

interface editorProps {
  notes?: Note[] | undefined;
  editor: Editor | null;
}

const WritedownEditor = ({ notes, editor }: editorProps) => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);

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

  return <EditorContent selected editor={editor} />;
};

export default WritedownEditor;
