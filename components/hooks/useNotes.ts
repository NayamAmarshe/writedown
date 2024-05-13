import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { NoteDocument } from "@/types/utils/firebaseOperations";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { selectedNoteAtom } from "@/stores/postDataAtom";

import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const [notes, loading, error, snapshot, refreshNotes] = useCollectionDataOnce(
    userId
      ? query(
          collection(db, "users", userId, "notes"),
          orderBy("updatedAt", "desc")
        ).withConverter(notesConverter)
      : null
  );

  const createNote = useCallback(async () => {
    if (!userId) return;

    const id = crypto.randomUUID();
    const currentTime = new Date().getTime();

    const noteData: NoteDocument = {
      id,
      content: "",
      public: false,
      slug: id,
      title: "",
      userId,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    const notesRef = doc(db, "users", userId, "notes", id);

    try {
      // Create a document inside channelsRef array
      await setDoc(notesRef, noteData, { merge: true });
      refreshNotes();
      return id;
    } catch (error) {
      toast.error("Failed to create post, please try again later.");
    }
  }, [userId]);

  const updateNote = useCallback(
    async (note: {
      id: string;
      title: string;
      content: string;
      public?: boolean;
    }) => {
      if (!userId || !note) return;

      const notesRef = doc(db, "users", userId, "notes", note.id);
      const currentTime = new Date().getTime();
      const updatedContent = note.public
        ? { ...note, updatedAt: currentTime, publishedAt: currentTime }
        : { ...note, updatedAt: currentTime };

      try {
        // Create a document inside channelsRef array
        await updateDoc(notesRef, updatedContent);
        setSelectedNote((prev) => ({
          ...prev,
          lastUpdated: currentTime,
        }));
      } catch (error) {
        toast.error("Failed to update post, please try again later.");
      }
    },
    [userId]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!userId || !noteId) return;

      const notesRef = doc(db, "users", userId, "notes", noteId);

      try {
        // Create a document inside channelsRef array
        await deleteDoc(notesRef);
        refreshNotes();
      } catch (error) {
        toast.error("Failed to delete post, please try again later.");
      }
    },
    [userId]
  );

  return {
    notes,
    refreshNotes,
    notesLoading: loading,
    notesError: error,
    notesSnapshot: snapshot,
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNotes;
