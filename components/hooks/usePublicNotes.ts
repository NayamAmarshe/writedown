import {
  useDocumentData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import {
  notesConverter,
  publicNotesConverter,
} from "@/utils/firestoreDataConverter";
import { collection, doc, query } from "firebase/firestore";
import { Note } from "@/types/utils/firebaseOperations";
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
