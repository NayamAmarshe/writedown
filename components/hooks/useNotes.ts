import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { TNotesData } from "@/types/utils/firebaseOperations";
import { useCallback, useEffect, useState } from "react";
import { isSyncingAtom } from "@/stores/isSyncing";
import { toast } from "react-hot-toast";
import localForage from "localforage";
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
      : null,
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
      initialValue: [],
    }
  );

  const updateLocalNotes = useCallback(
    async (cloudNoteId: string) => {
      const updatedLocalNotes = localNotes.filter(
        (localNote) => localNote.id !== cloudNoteId
      );
      localForage.setItem("notes", updatedLocalNotes);
    },
    [localNotes]
  );

  const createNewNote = async () => {
    const newNoteId = await createNote();
    if (!newNoteId) return;
  };

  /**
   * Fetch local notes from localForage
   */
  useEffect(() => {
    const setLocalForageNotes = async () => {
      await localForage.setItem("notes", []);
    };

    const fetchLocalNotes = async () => {
      const localForageNotes = await localForage.getItem<TNotesData[]>("notes");

      if (!localForageNotes) {
        setLocalForageNotes();
        return;
      }

      setLocalNotes(localForageNotes);
    };

    fetchLocalNotes();
  }, []);

  /**
   * Merge local notes with cloud notes
   */
  useEffect(() => {
    console.log("🚀 => file: useNotes.ts:122 => localNotes:", localNotes);

    const mergedNotes = (localNotes || []).map((localNote) => {
      const cloudNote = cloudNotes?.find(
        (cloudNote) => localNote.id === cloudNote.id
      );

      if (!cloudNote) {
        return localNote;
      }

      /**
       * If cloud note and local note are the same
       * then delete local note from localforage
       */
      if (
        localNote.title === cloudNote.title &&
        localNote.content === cloudNote.content
      ) {
        updateLocalNotes(localNote.id);
      }

      return cloudNote;
    });

    console.log("mergedNotes", mergedNotes);
    setNotes(mergedNotes);
  }, [cloudNotes, localNotes]);

  const createNote = useCallback(async () => {
    if (!userId) return;

    const id = crypto.randomUUID();
    const currentTime = new Date().getTime();

    const noteData: TNotesData = {
      id,
      content: "",
      public: false,
      slug: id,
      title: "Untitled",
      userId,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    // const notesRef = doc(db, "users", userId, "notes", id);

    try {
      // Create a document inside channelsRef array
      await localForage.setItem("notes", [...localNotes, noteData]);
      setLocalNotes([...localNotes, noteData]);
      // await setDoc(notesRef, noteData, { merge: true });
      return id;
    } catch (error) {
      toast.error("Failed to create post, please try again later.");
    }
  }, [userId, new Date().getTime()]);

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
        const updatedLocalNotes = localNotes.filter(
          (localNote) => localNote.id !== noteId
        );
        await localForage.setItem("notes", updatedLocalNotes);
        setLocalNotes(updatedLocalNotes);
      } catch (error) {
        toast.error("Failed to delete post, please try again later.");
      }
    },
    [userId]
  );

  return {
    localNotes,
    cloudNotes,
    /**
     * Notes from firestore and localforage combined
     */
    notes,
    /**
     * Create a new note
     */
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNotes;
