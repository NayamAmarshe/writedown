"use client";

import { useDocumentData } from "@/components/hooks/firebase-hooks";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMemo } from "react";

type UseNotesProps = {
  noteId: string;
};

export const usePublicNotes = ({ noteId }: UseNotesProps) => {
  const publicNotesRef = useMemo(
    () => (noteId ? doc(db, "public_notes", noteId) : null),
    [noteId]
  );

  const [publicNotes, loading, error, snapshot] =
    useDocumentData(publicNotesRef);

  const noteRef = useMemo(() => {
    if (!publicNotes) return null;
    return doc(db, "users", publicNotes.userId, "notes", noteId);
  }, [noteId, publicNotes]);

  const [note, note_loading, note_error, note_snapshot] =
    useDocumentData(noteRef);

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
