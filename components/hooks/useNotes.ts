import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { syncLoadingAtom } from "@/stores/syncLoadingAtom";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { useCallback } from "react";
import { useSetAtom } from "jotai";

type UseNotesProps = {
  userId: string | undefined;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const setSyncLoading = useSetAtom(syncLoadingAtom);

  const [notes, loading, error, snapshot, reload] = useCollectionDataOnce(
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

    const noteData: TNotesData = {
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
      reload();
      return id;
    } catch (error) {
      toast.error("Failed to create post, please try again later.");
    }
  }, [userId]);

  const updateNote = useCallback(
    async (note: { id: string; title: string; content: string }) => {
      if (!userId || !note) return;

      setSyncLoading(true);

      const notesRef = doc(db, "users", userId, "notes", note.id);
      const currentTime = new Date().getTime();

      try {
        // Create a document inside channelsRef array
        await updateDoc(notesRef, { ...note, updatedAt: currentTime });
        setSyncLoading(false);
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

  return {
    notes,
    reload,
    notesLoading: loading,
    notesError: error,
    notesSnapshot: snapshot,
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNotes;
