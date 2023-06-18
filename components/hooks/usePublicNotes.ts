import {
  useDocumentData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import {
  notesConverter,
  publicNotesConverter,
} from "@/utils/firestoreDataConverter";
import { collection, doc, query } from "firebase/firestore";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { db } from "@/lib/firebase";

type UseNotesProps = {
  noteId: string;
};

export const usePublicNotes = ({ noteId }: UseNotesProps) => {
  const publicRef = noteId ? doc(db, "public_notes", noteId) : null;

  const [publicNotes, loading, error, snapshot] = useDocumentData(publicRef);

  const notesRef = publicNotes
    ? doc(db, "users", publicNotes.userId, "notes", noteId)
    : null;

  const [note, note_loading, note_error, note_snapshot] =
    useDocumentData(notesRef);

  return {
    publicNotes,
    note,
    publicLoading: loading,
    publicError: error,
    publicSnapshot: snapshot,
    notesLoading: note_loading,
    notesError: note_error,
    notesSnapshot: note_snapshot,
  };
};

export default usePublicNotes;
