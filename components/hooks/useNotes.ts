import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { useCallback, useEffect, useState } from "react";
import { isSyncingAtom } from "@/stores/isSyncing";
import { toast } from "react-hot-toast";
import localforage from "localforage";
import { db } from "@/lib/firebase";
import { useSetAtom } from "jotai";

type UseNotesProps = {
  userId?: string;
};

export const useNotes = ({ userId }: UseNotesProps) => {
  const setIsSyncing = useSetAtom(isSyncingAtom);

  const [notes, setNotes] = useState<TNotesData[]>([]);
  const [localNotes, setLocalNotes] = useState<TNotesData[]>([]);

  /**
   * Fetch cloud notes from firestore
   * and set it to cloudNotes state
   */
  const [cloudNotes] = useCollectionData(
    userId
      ? query(
          collection(db, "users", userId, "notes"),
          orderBy("updatedAt", "desc")
        ).withConverter(notesConverter)
      : null
  );

  /**
   * Fetch local notes from localForage
   */
  useEffect(() => {
    const fetchLocalNotes = async () => {
      const localForageNotes = await localforage.getItem<TNotesData[]>("notes");
      if (!localForageNotes) return;
      setLocalNotes(localForageNotes);
    };
    fetchLocalNotes();
  }, []);

  /**
   * Merge local notes with cloud notes
   * and set it to notes state
   */
  useEffect(() => {
    const createNoteIfEmpty = async () => {
      await createNote();
    };

    if (!cloudNotes || !localNotes) return;

    if (cloudNotes.length === 0 && localNotes.length === 0) {
      createNoteIfEmpty();
    }

    const mergedNotes = cloudNotes.map((cloudNote) => {
      const localNote = localNotes.find(
        (localNote) => localNote.id === cloudNote.id
      );
      console.log("🚀 => file: useNotes.ts:75 => localNote:", localNote);

      if (!localNote) return cloudNote;
      return localNote;
    });

    setNotes(mergedNotes);
  }, [cloudNotes, localNotes]);

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

  return { notes, createNote, updateNote, deleteNote };
};

export default useNotes;
