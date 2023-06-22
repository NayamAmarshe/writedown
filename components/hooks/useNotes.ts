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
import { notesConverter } from "@/utils/firestoreDataConverter";
import { postLastUpdatedAtom } from "@/stores/postDataAtom";
import { Note } from "@/types/utils/firebaseOperations";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { useCallback } from "react";
import { useSetAtom } from "jotai";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const setUpdatedAt = useSetAtom(postLastUpdatedAtom);
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

    const noteData: Note = {
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
      const publicRef = doc(db, "public_notes", note.id);
      const currentTime = new Date().getTime();

      const publicNote = await getDoc(publicRef);

      try {
        // Create a document inside channelsRef array
        await updateDoc(notesRef, { ...note, updatedAt: currentTime });
        setUpdatedAt(currentTime);
      } catch (error) {
        toast.error("Failed to update post, please try again later.");
      }

      if (note.public) {
        await setDoc(publicRef, { userId: userId });
      } else if (publicNote.exists()) {
        await deleteDoc(publicRef);
      }
    },
    [userId]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!userId || !noteId) return;

      const notesRef = doc(db, "users", userId, "notes", noteId);
      const publicRef = doc(db, "public_notes", noteId);

      const publicNote = await getDoc(publicRef);

      try {
        // Create a document inside channelsRef array
        await deleteDoc(notesRef);
        if (publicNote.exists()) {
          await deleteDoc(publicRef);
        }
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
