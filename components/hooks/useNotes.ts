import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { isSyncingAtom } from "@/stores/isSyncing";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { useCallback } from "react";
import { useSetAtom } from "jotai";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const setIsSyncing = useSetAtom(isSyncingAtom);

  const createNote = useCallback(async () => {
    if (!userId) return;

    const id = crypto.randomUUID();
    const serverTime = serverTimestamp();

    const noteData: TNotesData = {
      id,
      content: "",
      public: false,
      slug: id,
      title: "Untitled",
      userId,
      createdAt: serverTime,
      updatedAt: serverTime,
    };

    const notesRef = doc(db, "users", userId, "notes", id);

    try {
      // Create a document inside channelsRef array
      await setDoc(notesRef, noteData, { merge: true });
      return id;
    } catch (error) {
      toast.error("Failed to create post, please try again later.");
    }
  }, [userId]);

  const updateNote = useCallback(
    async (note: { id: string; title: string; content: string }) => {
      if (!userId || !note) return;

      setIsSyncing(true);

      const notesRef = doc(db, "users", userId, "notes", note.id);
      const serverTime = serverTimestamp();

      try {
        // Create a document inside channelsRef array
        await updateDoc(notesRef, { ...note, updatedAt: serverTime });
        setIsSyncing(false);
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
      } catch (error) {
        toast.error("Failed to delete post, please try again later.");
      }
    },
    [userId]
  );

  return { createNote, updateNote, deleteNote };
};

export default useNotes;
