import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type UseNotesProps = {
  noteId: string;
};

export const usePublicNotes = ({ noteId }: UseNotesProps) => {
  const [publicNotes, loading, error, snapshot] = useDocumentData(
    noteId ? doc(db, "public_notes", noteId) : null
  );

  const [note, note_loading, note_error, note_snapshot] = useDocumentData(
    publicNotes ? doc(db, "users", publicNotes.userId, "notes", noteId) : null
  );

  return {
    publicNotes,
    note,
    publicNotesLoading: loading,
    publicNotesError: error,
    publicNotesSnapshot: snapshot,
    notesLoading: note_loading,
    notesError: note_error,
    notesSnapshot: note_snapshot,
  };
};

export default usePublicNotes;
